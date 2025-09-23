import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { authenticateCallback } from "@/lib/piAuth";

interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

const SCOPES = ["username", "payments"];

interface PiLoginProps {
  onAuth: (user: PiUser) => void;
  user: PiUser | null;
}

const PiLogin: React.FC<PiLoginProps> = ({ onAuth, user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    
    // Use the corrected wrapper from piAuth.ts
    authenticateCallback(
      SCOPES,
      (authResult) => {
        console.log("🎉 PiLogin: Authentication successful");
        onAuth({
          uid: authResult.user.uid,
          username: authResult.user.username,
          accessToken: authResult.accessToken,
        });
        setLoading(false);
      },
      (error) => {
        console.error("❌ PiLogin: Authentication failed:", error);
        setError(error || "Authentication failed");
        setLoading(false);
      }
    );
  };

  if (user) {
    return (
      <div className="flex items-center space-x-2" data-testid="pi-user-authenticated">
        <span className="font-semibold text-green-400">@{user.username}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
        onClick={handleLogin}
        disabled={loading}
        data-testid="button-pi-login"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Login with Pi"
        )}
      </Button>
      {error && (
        <span className="text-red-500 text-xs mt-2" data-testid="text-pi-error">
          {error}
        </span>
      )}
    </div>
  );
};

export type { PiUser };
export default PiLogin;