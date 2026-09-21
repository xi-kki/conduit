"use client";

import { ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFullnodeUrl } from "@mysten/sui/client";
import {
  SuiClientProvider,
  WalletProvider,
  ConnectModal,
  useWallets,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

// ============================================================
// ZKLOGIN CONFIGURATION
// ============================================================
// To enable Google sign-in:
// 1. Go to https://console.cloud.google.com/apis/credentials
// 2. Create an OAuth 2.0 Client ID (Web application)
// 3. Add your domain to authorized origins:
//    - http://localhost:3000 (development)
//    - https://your-vercel-domain.vercel.app (production)
// 4. Set the redirect URI to your domain
// 5. Copy the Client ID below
//
// For testnet, you can use the Mysten testnet ephemeral keypair.
// For production, you'll need your own Keymaster/OPAQUE server.
// ============================================================

const ZKLOGIN_CLIENT_ID = process.env.NEXT_PUBLIC_ZKLOGIN_CLIENT_ID || "";
const ZKLOGIN_KEYSTORE_URL = process.env.NEXT_PUBLIC_ZKLOGIN_KEYSTORE_URL || "";

const networks: Record<string, { url: string; network: string }> = {
  testnet: { url: getFullnodeUrl("testnet"), network: "testnet" },
  mainnet: { url: getFullnodeUrl("mainnet"), network: "mainnet" },
};

// ============================================================
// MOUNTED CHECKER — prevents hydration mismatch
// ============================================================

function WalletConnectionChecker({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading Conduit...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================================
// ZKLOGIN BUTTON — "Sign in with Google"
// ============================================================

export function ZkLoginButton({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // zkLogin requires a backend service (Keymaster/OPAQUE)
      // For now, redirect to Google OAuth and handle callback
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ZKLOGIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=openid email profile`;
      
      window.location.href = authUrl;
      
      onSuccess?.();
    } catch (err: any) {
      console.error("zkLogin error:", err);
      
      if (!ZKLOGIN_CLIENT_ID) {
        setError("zkLogin not configured. Add NEXT_PUBLIC_ZKLOGIN_CLIENT_ID to .env.local");
      } else {
        setError(err.message || "Sign-in failed");
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Sign-In Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading || !ZKLOGIN_CLIENT_ID}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl text-gray-900 font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <p className="text-amber-400 text-xs">{error}</p>
        </div>
      )}

      {/* Setup instructions when not configured */}
      {!ZKLOGIN_CLIENT_ID && !loading && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-500 text-xs leading-relaxed">
            <strong className="text-gray-400">Setup required:</strong> Add your Google OAuth Client ID to{" "}
            <code className="text-purple-400">.env.local</code>:
            <br />
            <code className="text-gray-400">NEXT_PUBLIC_ZKLOGIN_CLIENT_ID=your-client-id</code>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN PROVIDER
// ============================================================

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          <WalletConnectionChecker>
            {children}
          </WalletConnectionChecker>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
