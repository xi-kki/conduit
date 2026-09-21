"use client";

import { useState, useCallback, useEffect } from "react";
import { useCurrentAccount, useConnectWallet, useDisconnectWallet, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  isDeployed,
  buildRegisterOrganizer,
  buildCreateEvent,
  buildClaimFreeTicket,
  buildPurchaseTicket,
  buildCheckInTicket,
  fetchAllEvents,
  fetchEventById,
  fetchTicketsByOwner,
  fetchOrganizerCap,
  fetchEventsByOrganizer,
} from "./contracts";
import { suiClient } from "./sui";
import type { Event, Ticket } from "./types";

// ─── Main Contract Hook ───────────────────────────────────────

export function useConduit() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectAsync } = useConnectWallet();
  const { mutateAsync: disconnectAsync } = useDisconnectWallet();
  const signAndExecuteMutation = useSignAndExecuteTransaction();
  
  const isConnected = !!currentAccount;
  const address = currentAccount?.address || "";

  // ─── State ────────────────────────────────────────────────

  const [events, setEvents] = useState<Event[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [organizerCapId, setOrganizerCapId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Wallet Helpers ───────────────────────────────────────

  const connectWallet = useCallback(() => {
    // The connect modal should be triggered via ConnectModal component
    console.log("Connect wallet triggered - use ConnectModal component");
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnectAsync(undefined, {
      onSuccess: () => {
        setMyTickets([]);
        setOrganizerEvents([]);
        setOrganizerCapId(null);
      },
    });
  }, [disconnectAsync]);

  const truncateAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // ─── Sign & Execute ───────────────────────────────────────

  const signAndExecute = useCallback(
    async (txb: Transaction): Promise<string | null> => {
      if (!isConnected || !address) {
        setError("Connect your wallet first");
        return null;
      }

      if (!isDeployed()) {
        setError("Contract not deployed. Set NEXT_PUBLIC_CONTRACT_ADDRESS.");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        txb.setSender(address);
        txb.setGasBudget(50_000_000);

        const result = await signAndExecuteMutation.mutateAsync({
          transaction: txb as any,
        });

        const effects = result.effects as any;
        if (effects?.status?.status === "success") {
          return result.digest;
        } else {
          const errStr = effects?.status?.error || "Transaction failed";
          setError(errStr);
          return null;
        }
      } catch (err: any) {
        const msg = err?.message || err?.toString() || "Transaction error";
        if (msg.includes("User rejected")) {
          setError("Transaction rejected by user");
        } else {
          setError(msg);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, address, signAndExecuteMutation]
  );

  // ─── Event Operations ─────────────────────────────────────

  const loadAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const evts = await fetchAllEvents();
      setEvents(evts);
    } catch (err: any) {
      console.error("loadAllEvents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEvent = useCallback(async (eventId: string): Promise<Event | null> => {
    try {
      return await fetchEventById(eventId);
    } catch (err: any) {
      console.error("loadEvent:", err);
      return null;
    }
  }, []);

  // Alias for backward compatibility
  const fetchEvent = loadEvent;

  const loadOrganizerEvents = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Also fetch organizer cap
      const capId = await fetchOrganizerCap(address);
      setOrganizerCapId(capId);

      const evts = await fetchEventsByOrganizer(address);
      setOrganizerEvents(evts);
    } catch (err: any) {
      console.error("loadOrganizerEvents:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // ─── Create Event ─────────────────────────────────────────

  const createEvent = useCallback(
    async (params: {
      name: string;
      description: string;
      imageUrl: string;
      startTime: number;
      endTime: number;
      venue: string;
      ticketPrice: number;
      resalePriceCap: number;
      royaltyBps: number;
      totalSupply: number;
      category: string;
    }): Promise<string | null> => {
      // Ensure organizer cap exists — register if needed
      if (!organizerCapId) {
        setError("Registering as organizer...");
        const regTxb = buildRegisterOrganizer("Conduit Organizer", address);
        const regResult = await signAndExecute(regTxb);
        if (!regResult) return null;

        // Re-fetch cap
        const newCap = await fetchOrganizerCap(address);
        setOrganizerCapId(newCap);
        if (!newCap) {
          setError("Failed to register as organizer");
          return null;
        }
      }

      const txb = new Transaction();
      txb.setSender(address);

      txb.moveCall({
        target: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::conduit_core::create_event`,
        arguments: [
          txb.object(organizerCapId!),
          txb.pure.string(params.name),
          txb.pure.string(params.description),
          txb.pure.string(params.imageUrl),
          txb.pure.u64(params.startTime),
          txb.pure.u64(params.endTime),
          txb.pure.string(params.venue),
          txb.pure.u64(params.ticketPrice),
          txb.pure.u64(params.resalePriceCap),
          txb.pure.u64(params.royaltyBps),
          txb.pure.u64(params.totalSupply),
          txb.pure.string(params.category),
        ],
      });

      return signAndExecute(txb);
    },
    [address, organizerCapId, signAndExecute]
  );

  // ─── Ticket Operations ────────────────────────────────────

  const loadMyTickets = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const tickets = await fetchTicketsByOwner(address);
      setMyTickets(tickets);
    } catch (err: any) {
      console.error("loadMyTickets:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  const claimFreeTicket = useCallback(
    async (eventId: string, tier: string): Promise<string | null> => {
      const txb = buildClaimFreeTicket(eventId, tier, address);
      const result = await signAndExecute(txb);
      if (result) {
        // Refresh tickets
        await loadMyTickets();
      }
      return result;
    },
    [address, signAndExecute, loadMyTickets]
  );

  const purchaseTicket = useCallback(
    async (
      eventId: string,
      ticketPrice: number,
      tier: string
    ): Promise<string | null> => {
      const txb = buildPurchaseTicket(eventId, ticketPrice, tier, address);
      const result = await signAndExecute(txb);
      if (result) {
        await loadMyTickets();
      }
      return result;
    },
    [address, signAndExecute, loadMyTickets]
  );

  const checkInTicket = useCallback(
    async (eventId: string, ticketId: string): Promise<string | null> => {
      const txb = buildCheckInTicket(eventId, ticketId, address);
      const result = await signAndExecute(txb);
      if (result) {
        await loadMyTickets();
      }
      return result;
    },
    [address, signAndExecute, loadMyTickets]
  );

  // Verify ticket validity (check if it exists and is not used)
  const verifyTicket = useCallback(
    async (
      ticketId: string,
      eventId: string
    ): Promise<{ valid: boolean; message: string }> => {
      try {
        const ticketObj = await suiClient.getObject({
          id: ticketId,
          options: { showContent: true },
        });

        if (!ticketObj.data || ticketObj.data.content?.dataType !== "moveObject") {
          return { valid: false, message: "Ticket not found on-chain" };
        }

        const fields = ticketObj.data.content.fields as any;

        // Check if ticket belongs to this event
        if (fields.event_id !== eventId) {
          return { valid: false, message: "Ticket is for a different event" };
        }

        // Check if already used
        if (fields.is_used || fields.checked_in) {
          return { valid: false, message: "Ticket already used / checked in" };
        }

        return { valid: true, message: "Ticket is valid ✓" };
      } catch (err: any) {
        console.error("verifyTicket error:", err);
        return { valid: false, message: "Verification failed — " + (err.message || "unknown error") };
      }
    },
    []
  );

  // ─── Auto-load on connect ─────────────────────────────────

  useEffect(() => {
    if (isConnected && isDeployed()) {
      loadAllEvents();
      loadMyTickets();
      loadOrganizerEvents();
    }
  }, [isConnected, loadAllEvents, loadMyTickets, loadOrganizerEvents]);

  // ─── Return ───────────────────────────────────────────────

  return {
    // Wallet
    isConnected,
    address,
    connectWallet,
    disconnectWallet,
    truncateAddress,
    signAndExecute,

    // Events
    events,
    organizerEvents,
    organizerCapId,
    loadAllEvents,
    loadEvent,
    fetchEvent,
    loadOrganizerEvents,
    createEvent,

    // Tickets
    myTickets,
    loadMyTickets,
    claimFreeTicket,
    purchaseTicket,
    checkInTicket,
    verifyTicket,

    // State
    loading,
    error,
    setError,
    isDeployed: isDeployed(),
  };
}
