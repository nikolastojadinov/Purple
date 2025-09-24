import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
// ...existing code...

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

  // ...Pi login mutation uklonjen...

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
    // Pi SDK i advanced storage uklonjeni
    // Fallback: ništa ne inicijalizuje
  }, []);

  // Guest user fallback
  useEffect(() => {
    if (!sessionLoading && !sessionUser) {
      // Minimalni guest fallback
      const guestId = `guest-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      setGuestUser({ uid: guestId, username: "Guest User", isGuest: true });
    }
  }, [sessionUser, sessionLoading]);

  // Minimalni fakeAuth login
  const login = async (): Promise<void> => {
    setGuestUser({ uid: `guest-${Date.now()}`, username: "Guest User", isGuest: true });
  };

  const logout = async () => {
    setGuestUser(null);
  };

  const clearGuestProfile = async () => {
    setGuestUser(null);
  };

  // Who is the current user?
  const currentUser = (sessionUser as AuthUser) || guestUser;
  const isAuthenticated = !!sessionUser;
  const isLoading = sessionLoading;

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