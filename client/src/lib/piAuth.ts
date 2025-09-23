// Pi Authentication - Official Demo App Implementation
import type { AuthResult, PaymentDTO } from '@/types/pi';

export interface PiAuthResult {
  accessToken: string;
  user: { uid: string; username: string };
}

export async function initPiSDK(sandbox = true): Promise<void> {
  if (typeof window === "undefined") throw new Error("Window not available");

  // Wait for Pi SDK to load from our backend
  const initPromise = new Promise<void>((resolve, reject) => {
    const checkReady = () => {
      if (typeof (window as any).Pi !== 'undefined') {
        resolve();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    setTimeout(() => reject(new Error("Pi SDK timeout")), 10000);
    checkReady();
  });

  await initPromise;
  console.log("✅ Pi SDK loaded successfully");
}

// Official Pi authentication flow with payment handling
const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("💰 Incomplete payment found:", payment);
  // Handle incomplete payments if needed
  // This could call your backend to handle the incomplete payment
};

// Callback-based authenticate function using CORRECT Promise-based Pi SDK API
export function authenticateCallback(
  scopes: string[] = ["username", "payments"],
  onSuccess: (authResult: AuthResult) => void,
  onError: (error: string) => void
): void {
  if (!window.Pi || typeof window.Pi.authenticate !== "function") {
    onError("Pi SDK not ready - authenticate missing");
    return;
  }

  console.log("🔐 Starting Pi authentication with scopes:", scopes);
  console.log("🔍 Pi SDK ready status:", !!window.Pi);

  try {
    console.log("🔥 Calling Pi.authenticate with Promise API...");
    
    // CORRECTED: Use Promise-based Pi SDK API
    window.Pi.authenticate(scopes, onIncompletePaymentFound)
      .then((authResult: AuthResult) => {
        console.log("📋 Pi auth result received");
        
        if (!authResult?.accessToken || !authResult?.user?.uid) {
          console.error("❌ Missing data in Pi result:", authResult);
          onError("Pi authentication failed - missing user or token");
          return;
        }

        console.log("✅ Pi Authentication successful for:", authResult.user.username);
        onSuccess(authResult);
      })
      .catch((error: any) => {
        console.error("❌ Pi.authenticate failed:", error);
        onError(error?.message || "Authentication failed");
      });
      
  } catch (error: any) {
    console.error("❌ Pi.authenticate error:", error);
    onError(error.message || "Unknown error");
  }
}

// Promise-based function for direct use
export async function authenticate(scopes: string[] = ["username", "payments"]): Promise<AuthResult> {
  if (!window.Pi || typeof window.Pi.authenticate !== "function") {
    throw new Error("Pi SDK not ready - authenticate missing");
  }

  console.log("🔐 Starting Pi authentication with scopes:", scopes);
  
  try {
    console.log("🔥 Calling Pi.authenticate with Promise API...");
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    
    if (!authResult?.accessToken || !authResult?.user?.uid) {
      throw new Error("Pi authentication failed - missing user or token");
    }
    
    console.log("✅ Pi Authentication successful for:", authResult.user.username);
    return authResult;
  } catch (error: any) {
    console.error("❌ Pi.authenticate failed:", error);
    throw error;
  }
}

// Legacy compatibility
export async function authenticateOld(scopes: string[] = ["username"]): Promise<PiAuthResult> {
  const result = await authenticate(scopes);
  return {
    accessToken: result.accessToken,
    user: result.user
  };
}