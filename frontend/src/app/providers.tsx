"use client";

import { ReactNode, useState, useEffect } from "react";
import { getFullnodeUrl } from "@mysten/sui/client";
import {
  SuiClientProvider,
  WalletProvider,
  ConnectModal,
  useWalletKit,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

const networks = {
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

function WalletConnectionChecker({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading Conduit...</div>
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SuiClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider>
        <WalletConnectionChecker>
          {children}
        </WalletConnectionChecker>
      </WalletProvider>
    </SuiClientProvider>
  );
}
