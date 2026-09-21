"use client";

import { useCallback } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";

/**
 * Hook for wallet connection with proper error handling
 * The connect modal should be triggered via ConnectModal component
 */
export function useConduitWallet() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: disconnectAsync } = useDisconnectWallet();

  const connectWallet = useCallback(() => {
    // This will be handled by ConnectModal component
    // The actual connection is triggered by the modal
    console.log("Connect wallet triggered - use ConnectModal component");
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnectAsync();
  }, [disconnectAsync]);

  const truncateAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    truncateAddress,
    isConnected: !!currentAccount,
    address: currentAccount?.address,
  };
}
