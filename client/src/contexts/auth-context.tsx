import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { advancedPiStorage } from "@/lib/advanced-storage";
import { initPiSDK, authenticate, authenticateCallback } from "@/lib/piAuth";
import type { AuthResult, PaymentDTO } from "@/types/pi";

interface AuthUser {
  uid: string;
  username: string;
  isGuest?: boolean;
}

// Pi Network specific user type (cloned from purleemusic)
export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearGuestProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [guestUser, setGuestUser] = useState<AuthUser | null>(null);

  // Backend session
  const { data: sessionUser, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Pi login mutation - official flow
  const loginMutation = useMutation({
    mutationFn: async (authResult: AuthResult) => {
      // Security: Never log authResult as it contains sensitive credentials
      console.log('🔐 Sending Pi auth data to backend...');
      const response = await apiRequest("POST", "/api/auth/pi-login", { authResult });
      return response.json();
    },
    onSuccess: () => {
      console.log('✅ Pi login successful, invalidating session cache');
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
    onError: (error: any) => {
      console.error('❌ Pi login failed:', error);
    }
  });

  // Pi logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return response.json();
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      setGuestUser(null);
      await advancedPiStorage.clearAllPiData();
    },
  });

  // Init Pi SDK and storage on mount
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize storage first
        const storageInitialized = await advancedPiStorage.initialize();
        if (storageInitialized) {
          console.log("✅ Advanced storage inicijalizovan");
        } else {
          console.warn("⚠️ Advanced storage init failed, continuing with fallback");
        }
        
        // Then initialize Pi SDK
        await initPiSDK(true);
        console.log("✅ Pi SDK ready");
      } catch (error) {
        console.error("❌ Service initialization error:", error);
      }
    };
    
    initializeServices();
  }, []);

  // Guest user fallback
  useEffect(() => {
    if (!sessionLoading && !sessionUser) {
      const setupGuest = async () => {
        try {
          // Try to restore guest from storage
          const recovered = await advancedPiStorage.findAnyPiUser();
          if (recovered) {
            setGuestUser({ ...recovered, isGuest: true });
            return;
          }

          // If no guest found, create new
          const guestId = `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
          const newGuest: AuthUser = { uid: guestId, username: "Guest User", isGuest: true };

          setGuestUser(newGuest);
          await advancedPiStorage.savePiUser(newGuest);
        } catch (err) {
          console.warn("⚠️ Guest fallback failed:", err);
          setGuestUser({ uid: `guest-${Date.now()}`, username: "Guest User", isGuest: true });
        }
      };

      setupGuest();
    }
  }, [sessionUser, sessionLoading]);

  // Pi login flow - Enhanced with PurpleBeats integration
  const piLogin = async (): Promise<void> => {
    try {
      console.log("🎵 PurpleBeats Pi login started...");
      
      // Use PurpleBeats Pi methods from global scope
      if (window.PurpleBeats && window.PurpleBeats.piLogin) {
        console.log("🔧 Using PurpleBeats Pi login method");
        const authResult = await window.PurpleBeats.piLogin();
        
        // Store Pi user data locally
        const piUser: PiUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          accessToken: authResult.accessToken
        };
        
        await advancedPiStorage.savePiUser(piUser);
        console.log("✅ Pi user saved to PurpleBeats storage");
        
        // Send to backend for session creation
        await loginMutation.mutateAsync(authResult);
        console.log("✅ PurpleBeats Pi login completed successfully");
        
      } else {
        // Fallback to existing piAuth.ts method
        console.log("🔄 Fallback to existing Pi auth method");
        const promise = new Promise<void>((resolve, reject) => {
          authenticateCallback(
            ["username", "payments"],
            async (authResult: AuthResult) => {
              try {
                const piUser: PiUser = {
                  uid: authResult.user.uid,
                  username: authResult.user.username,
                  accessToken: authResult.accessToken
                };
                
                await advancedPiStorage.savePiUser(piUser);
                await loginMutation.mutateAsync(authResult);
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            (error: string) => {
              reject(new Error(error));
            }
          );
        });
        
        await promise;
      }
    } catch (error) {
      console.error("❌ PurpleBeats Pi login failed:", error);
      throw error;
    }
  };
  // Replace old login with enhanced PurpleBeats Pi login
  const login = async (): Promise<void> => {
    return piLogin();
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const clearGuestProfile = async () => {
    setGuestUser(null);
    await advancedPiStorage.clearAllPiData();
  };

  // Who is the current user?
  const currentUser = (sessionUser as AuthUser) || guestUser;
  const isAuthenticated = !!sessionUser;
  const isLoading = sessionLoading || loginMutation.isPending || logoutMutation.isPending;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        userId: currentUser?.uid || null,
        isAuthenticated,
        isLoading,
        login,
        logout,
        clearGuestProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}