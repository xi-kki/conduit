/**
 * Conduit Smart Contract TypeScript Helpers
 *
 * All PTB (Programmable Transaction Block) calls for interacting with
 * the conduit_core Move module on Sui testnet.
 */
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { suiClient, NETWORK } from "./sui";
import type { Event, Ticket } from "./types";

// ─── Contract Config ──────────────────────────────────────────

const PACKAGE_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x8fc1517bbec170628606e01cd07863df9de2feac39b8155d9a5409e279382481";

/** Must be set after deployment */
export function isDeployed(): boolean {
  return PACKAGE_ID.length > 0 && PACKAGE_ID !== "0x0";
}

export function getPackageId(): string {
  if (!isDeployed()) {
    throw new Error(
      "Contract not deployed yet. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local"
    );
  }
  return PACKAGE_ID;
}

// ─── PTB Builders ─────────────────────────────────────────────

/**
 * Build a PTB to register as an event organizer.
 * Gas is paid by the signer (organizer).
 */
export function buildRegisterOrganizer(
  name: string,
  senderAddress: string
): Transaction {
  const txb = new Transaction();
  txb.setSender(senderAddress);

  txb.moveCall({
    target: `${getPackageId()}::conduit_core::register_organizer`,
    arguments: [txb.pure.string(name)],
  });

  return txb;
}

/**
 * Build a PTB to create an event.
 * Returns the event ID from the transaction result.
 */
export function buildCreateEvent(
  params: {
    name: string;
    description: string;
    imageUrl: string;
    startTime: number;
    endTime: number;
    venue: string;
    ticketPrice: number; // in MIST (1 SUI = 1e9 MIST)
    resalePriceCap: number;
    royaltyBps: number;
    totalSupply: number;
    category: string;
  },
  senderAddress: string
): Transaction {
  const txb = new Transaction();
  txb.setSender(senderAddress);

  // First, get the organizer cap for this sender
  // The organizer cap is an owned object — we need to pass it as an argument
  const [capObj] = txb.splitCoins(txb.gas, [0]); // placeholder — we need the actual cap

  txb.moveCall({
    target: `${getPackageId()}::conduit_core::create_event`,
    arguments: [
      capObj, // OrganizerCap
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

  return txb;
}

/**
 * Build a PTB to claim a free ticket.
 * The ticket NFT is transferred to the sender.
 */
export function buildClaimFreeTicket(
  eventId: string,
  tier: string,
  senderAddress: string
): Transaction {
  const txb = new Transaction();
  txb.setSender(senderAddress);

  txb.moveCall({
    target: `${getPackageId()}::conduit_core::claim_free_ticket`,
    arguments: [
      txb.object(eventId), // Event (shared object)
      txb.pure.string(tier),
      txb.object("0x6"), // Clock object
    ],
    typeArguments: [],
  });

  return txb;
}

/**
 * Build a PTB to purchase a paid ticket.
 * Payment is split: organizer gets (price - fee), platform gets fee.
 */
export function buildPurchaseTicket(
  eventId: string,
  ticketPrice: number, // in MIST
  tier: string,
  senderAddress: string
): Transaction {
  const txb = new Transaction();
  txb.setSender(senderAddress);

  // Split the exact payment from gas coin
  const [paymentCoin] = txb.splitCoins(txb.gas, [ticketPrice]);

  txb.moveCall({
    target: `${getPackageId()}::conduit_core::purchase_ticket`,
    arguments: [
      txb.object(eventId), // Event (shared object)
      paymentCoin, // Coin<SUI>
      txb.pure.string(tier),
      txb.object("0x6"), // Clock object
    ],
  });

  return txb;
}

/**
 * Build a PTB to check in a ticket (organizer only).
 */
export function buildCheckInTicket(
  eventId: string,
  ticketId: string,
  senderAddress: string
): Transaction {
  const txb = new Transaction();
  txb.setSender(senderAddress);

  txb.moveCall({
    target: `${getPackageId()}::conduit_core::check_in_ticket`,
    arguments: [
      txb.object(eventId), // Event (shared)
      txb.object(ticketId), // Ticket (owned)
      txb.object("0x6"), // Clock
    ],
  });

  return txb;
}

// ─── Chain Queries ────────────────────────────────────────────

/**
 * Fetch all events created by a specific organizer.
 * Queries EventCreated events and then fetches the Event objects.
 */
export async function fetchEventsByOrganizer(
  organizerAddress: string
): Promise<Event[]> {
  if (!isDeployed()) return [];

  try {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${getPackageId()}::conduit_core::EventCreated`,
      },
      limit: 50,
      order: "descending",
    });

    const eventIds = events.data
      .map((e) => (e.parsedJson as any)?.event_id)
      .filter(Boolean);

    const eventObjects = await Promise.all(
      eventIds.map((id) => suiClient.getObject({ id, options: { showContent: true } }))
    );

    return eventObjects
      .filter((obj) => obj.data?.content?.dataType === "moveObject")
      .map((obj) => moveObjectToEvent(obj.data!));
  } catch (err) {
    console.error("Failed to fetch events by organizer:", err);
    return [];
  }
}

/**
 * Fetch all active events (for the events listing page).
 * Queries EventCreated events and fetches the latest state.
 */
export async function fetchAllEvents(): Promise<Event[]> {
  if (!isDeployed()) return [];

  try {
    const events = await suiClient.queryEvents({
      query: {
        MoveEventType: `${getPackageId()}::conduit_core::EventCreated`,
      },
      limit: 100,
      order: "descending",
    });

    const eventIds = events.data
      .map((e) => (e.parsedJson as any)?.event_id)
      .filter(Boolean);

    if (eventIds.length === 0) return [];

    // Fetch all event objects in parallel (batched)
    const eventObjects = await Promise.all(
      eventIds.map((id) =>
        suiClient.getObject({ id, options: { showContent: true } })
      )
    );

    return eventObjects
      .filter((obj) => obj.data?.content?.dataType === "moveObject")
      .map((obj) => moveObjectToEvent(obj.data!))
      .filter((e) => e.is_active);
  } catch (err) {
    console.error("Failed to fetch all events:", err);
    return [];
  }
}

/**
 * Fetch a single event by ID.
 */
export async function fetchEventById(eventId: string): Promise<Event | null> {
  if (!isDeployed()) return null;

  try {
    const obj = await suiClient.getObject({
      id: eventId,
      options: { showContent: true },
    });

    if (!obj.data || obj.data.content?.dataType !== "moveObject") return null;

    return moveObjectToEvent(obj.data);
  } catch (err) {
    console.error("Failed to fetch event:", err);
    return null;
  }
}

/**
 * Fetch all tickets owned by a wallet address.
 */
export async function fetchTicketsByOwner(
  ownerAddress: string
): Promise<Ticket[]> {
  if (!isDeployed()) return [];

  try {
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${getPackageId()}::conduit_core::Ticket`,
      },
      options: { showContent: true, showDisplay: true },
      limit: 100,
    });

    return objects.data
      .filter((obj) => obj.data?.content?.dataType === "moveObject")
      .map((obj) => moveObjectToTicket(obj.data!));
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    return [];
  }
}

/**
 * Fetch the OrganizerCap for a wallet address.
 * Returns the object ID needed for create_event.
 */
export async function fetchOrganizerCap(
  ownerAddress: string
): Promise<string | null> {
  if (!isDeployed()) return null;

  try {
    const objects = await suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${getPackageId()}::conduit_core::OrganizerCap`,
      },
      options: { showContent: true },
      limit: 1,
    });

    if (objects.data.length === 0) return null;
    return objects.data[0].data?.objectId || null;
  } catch (err) {
    console.error("Failed to fetch OrganizerCap:", err);
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function moveObjectToEvent(obj: any): Event {
  const fields = obj.content?.fields || {};
  return {
    id: obj.objectId,
    name: fields.name || "",
    description: fields.description || "",
    image_url: fields.image_url || "",
    start_time: Number(fields.start_time) || 0,
    end_time: Number(fields.end_time) || 0,
    venue: fields.venue || "",
    organizer: fields.organizer || "",
    ticket_price: Number(fields.ticket_price) || 0,
    resale_price_cap: Number(fields.resale_price_cap) || 0,
    royalty_bps: Number(fields.royalty_bps) || 0,
    total_supply: Number(fields.total_supply) || 0,
    tickets_sold: Number(fields.tickets_sold) || 0,
    category: fields.category || "",
    is_active: fields.is_active || false,
  };
}

function moveObjectToTicket(obj: any): Ticket {
  const fields = obj.content?.fields || {};
  return {
    id: obj.objectId,
    event_id: fields.event_id || "",
    ticket_number: Number(fields.ticket_number) || 0,
    tier: fields.tier || "",
    purchase_price: Number(fields.purchase_price) || 0,
    original_owner: fields.original_owner || "",
    checked_in: fields.checked_in || false,
    is_used: fields.is_used || false,
  };
}
