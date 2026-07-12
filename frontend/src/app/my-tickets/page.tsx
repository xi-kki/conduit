"use client";

import { useState } from "react";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import { Ticket, Wallet, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Ticket as TicketType, Event } from "@/lib/types";

// Mock data
const MOCK_TICKETS: TicketType[] = [
  {
    id: "t1",
    event_id: "1",
    ticket_number: 42,
    tier: "GA",
    purchase_price: 0,
    original_owner: "0x1234",
    checked_in: false,
    is_used: false,
  },
  {
    id: "t2",
    event_id: "2",
    ticket_number: 108,
    tier: "VIP",
    purchase_price: 50000000000,
    original_owner: "0x1234",
    checked_in: true,
    is_used: true,
  },
];

const MOCK_EVENTS: Record<string, Event> = {
  "1": {
    id: "1",
    name: "Sui Builder House SF",
    description: "Building day",
    image_url: "",
    start_time: Date.now() + 86400000 * 3,
    end_time: Date.now() + 86400000 * 4,
    venue: "San Francisco, CA",
    organizer: "0x1234567890abcdef",
    ticket_price: 0,
    resale_price_cap: 0,
    royalty_bps: 500,
    total_supply: 200,
    tickets_sold: 156,
    category: "meetup",
    is_active: true,
  },
  "2": {
    id: "2",
    name: "Web3 Conference 2024",
    description: "Premier conference",
    image_url: "",
    start_time: Date.now() + 86400000 * 7,
    end_time: Date.now() + 86400000 * 9,
    venue: "New York, NY",
    organizer: "0xabcdef1234567890",
    ticket_price: 50000000000,
    resale_price_cap: 75000000000,
    royalty_bps: 1000,
    total_supply: 500,
    tickets_sold: 342,
    category: "conference",
    is_active: true,
  },
};

export default function MyTicketsPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Filter tickets based on tab
  const now = Date.now();
  const upcomingTickets = MOCK_TICKETS.filter((t) => {
    const event = MOCK_EVENTS[t.event_id];
    return event && event.start_time > now && !t.checked_in;
  });

  const pastTickets = MOCK_TICKETS.filter((t) => {
    const event = MOCK_EVENTS[t.event_id];
    return t.checked_in || (event && event.start_time <= now);
  });

  const displayTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your tickets.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-muted-foreground mt-2">
            Your NFT tickets for upcoming and past events
          </p>
        </div>
        <Link href="/events">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Browse Events
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "upcoming" ? "default" : "outline"}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
          {upcomingTickets.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {upcomingTickets.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === "past" ? "default" : "outline"}
          onClick={() => setActiveTab("past")}
        >
          Past
          {pastTickets.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pastTickets.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Tickets List */}
      {displayTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Ticket className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground">
            {activeTab === "upcoming"
              ? "No upcoming tickets"
              : "No past tickets"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {activeTab === "upcoming"
              ? "Browse events to get your first ticket!"
              : "Your attended events will appear here"}
          </p>
          {activeTab === "upcoming" && (
            <Link href="/events">
              <Button>
                Browse Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              event={MOCK_EVENTS[ticket.event_id]}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{MOCK_TICKETS.length}</div>
          <div className="text-sm text-muted-foreground">Total Tickets</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{upcomingTickets.length}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{pastTickets.length}</div>
          <div className="text-sm text-muted-foreground">Attended</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Listed for Resale</div>
        </div>
      </div>
    </div>
  );
}
