import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// Network configuration
export const NETWORK = "testnet" as const;
export const FULLNODE_URL = getFullnodeUrl(NETWORK);

// Sui client instance
export const suiClient = new SuiClient({
  url: FULLNODE_URL,
});

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  conduit_core:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x8fc1517bbec170628606e01cd07863df9de2feac39b8155d9a5409e279382481",
};

// Helper to check if contract is deployed
export function isContractDeployed(): boolean {
  return !!CONTRACT_ADDRESSES.conduit_core;
}