"use client";

import { useState } from "react";
import { EventList } from "@/components/event-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EVENT_CATEGORIES } from "@/lib/types";
import type { Event, EventCategory } from "@/lib/types";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

// Mock data
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Sui Builder House SF",
    description: "Join the Sui community for a day of building, learning, and connecting.",
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
  {
    id: "2",
    name: "Web3 Conference 2024",
    description: "The premier Web3 conference featuring leading voices in blockchain.",
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
  {
    id: "3",
    name: "Sui Hackathon: DeFi Edition",
    description: "Build the future of decentralized finance on Sui. $50K in prizes!",
    image_url: "",
    start_time: Date.now() + 86400000 * 14,
    end_time: Date.now() + 86400000 * 16,
    venue: "Virtual",
    organizer: "0x9876543210fedcba",
    ticket_price: 0,
    resale_price_cap: 0,
    royalty_bps: 0,
    total_supply: 1000,
    tickets_sold: 892,
    category: "hackathon",
    is_active: true,
  },
  {
    id: "4",
    name: "NFT Art Gallery Opening",
    description: "Experience the intersection of art and technology at our exclusive NFT gallery.",
    image_url: "",
    start_time: Date.now() + 86400000 * 5,
    end_time: Date.now() + 86400000 * 6,
    venue: "Miami, FL",
    organizer: "0xdef0123456789abc",
    ticket_price: 10000000000,
    resale_price_cap: 15000000000,
    royalty_bps: 750,
    total_supply: 100,
    tickets_sold: 98,
    category: "party",
    is_active: true,
  },
  {
    id: "5",
    name: "Move Language Workshop",
    description: "Learn the Move programming language from core contributors.",
    image_url: "",
    start_time: Date.now() + 86400000 * 10,
    end_time: Date.now() + 86400000 * 11,
    venue: "Virtual",
    organizer: "0x567890abcdef1234",
    ticket_price: 5000000000,
    resale_price_cap: 5000000000,
    royalty_bps: 500,
    total_supply: 50,
    tickets_sold: 23,
    category: "workshop",
    is_active: true,
  },
  {
    id: "6",
    name: "DeFi Night: Tokyo",
    description: "Network with the Tokyo DeFi community over drinks and demos.",
    image_url: "",
    start_time: Date.now() + 86400000 * 8,
    end_time: Date.now() + 86400000 * 9,
    venue: "Tokyo, Japan",
    organizer: "0x1111222233334444",
    ticket_price: 0,
    resale_price_cap: 0,
    royalty_bps: 0,
    total_supply: 80,
    tickets_sold: 45,
    category: "meetup",
    is_active: true,
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesFree = !showFreeOnly || event.ticket_price === 0;
    return matchesSearch && matchesCategory && matchesFree;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Events</h1>
        <p className="text-muted-foreground mt-2">
          Discover the best Web3 events on Sui
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Events
          </Button>
          {EVENT_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.emoji} {cat.label}
            </Button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant={showFreeOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFreeOnly(!showFreeOnly)}
          >
            Free Events Only
          </Button>
          <Badge variant="secondary">
            {filteredEvents.length} events found
          </Badge>
        </div>
      </div>

      {/* Events Grid */}
      <EventList
        events={filteredEvents}
        emptyMessage="No events match your filters"
      />
    </div>
  );
}