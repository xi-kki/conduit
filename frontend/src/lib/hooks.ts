"use client";

import { useCallback } from "react";
import { useWalletKit } from "@mysten/dapp-kit";

/**
 * Hook for wallet connection with proper error handling
 * Use this instead of directly calling connect()
 */
export function useConduitWallet() {
  const walletKit = useWalletKit();

  const connectWallet = useCallback(() => {
    // Open the connect modal - user picks their wallet
    walletKit.connect();
  }, [walletKit]);

  const disconnectWallet = useCallback(() => {
    walletKit.disconnect();
  }, [walletKit]);

  const truncateAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    ...walletKit,
    connectWallet,
    disconnectWallet,
    truncateAddress,
    isConnected: !!walletKit.currentAccount,
    address: walletKit.currentAccount?.address,
  };
}
