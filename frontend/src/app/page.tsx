"use client";

import { useState, useEffect } from "react";
import { EventList } from "@/components/event-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EVENT_CATEGORIES } from "@/lib/types";
import type { Event, EventCategory } from "@/lib/types";
import {
  Search,
  Sparkles,
  TrendingUp,
  Calendar,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data for demo
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Sui Builder House SF",
    description:
      "Join the Sui community for a day of building, learning, and connecting with fellow developers.",
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
    description:
      "The premier Web3 conference featuring leading voices in blockchain, DeFi, and NFTs.",
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
    description:
      "Build the future of decentralized finance on Sui. $50K in prizes!",
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
    description:
      "Experience the intersection of art and technology at our exclusive NFT gallery opening.",
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
    description:
      "Learn the Move programming language from core contributors. Hands-on coding included!",
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
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = events.filter((e) => e.tickets_sold > e.total_supply * 0.7);
  const freeEvents = events.filter((e) => e.ticket_price === 0);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-conduit-500/10 via-transparent to-sui-500/10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Built on Sui
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              The{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-conduit-600 to-sui-600">
                Curated
              </span>{" "}
              Web3 Events Hub
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover, attend, and own the best on-chain experiences. NFT
              tickets with enforced royalties, zero counterfeits, and instant
              venue entry.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="xl">
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/create">
                <Button variant="outline" size="xl">
                  Create Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Quality Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0%</div>
              <div className="text-sm text-muted-foreground">Fraud Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Royalty Enforcement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">&lt;3s</div>
              <div className="text-sm text-muted-foreground">Entry Confirmation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
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
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-conduit-600" />
            <h2 className="text-2xl font-bold">Trending on Sui</h2>
          </div>
          <Link href="/events" className="text-sm text-conduit-600 hover:underline">
            View all
          </Link>
        </div>
        <EventList events={featuredEvents.slice(0, 3)} />
      </section>

      {/* Free Events */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-sui-600" />
            <h2 className="text-2xl font-bold">Free Events</h2>
          </div>
        </div>
        <EventList events={freeEvents} emptyMessage="No free events available" />
      </section>

      {/* All Events */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-conduit-600" />
            <h2 className="text-2xl font-bold">All Events</h2>
          </div>
          <Badge variant="secondary">{filteredEvents.length} events</Badge>
        </div>
        <EventList events={filteredEvents} />
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-conduit-600 to-sui-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Host Your Event?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Create fraud-free, royalty-enforcing NFT tickets in minutes. No
            hidden fees, no scalpers, no counterfeits.
          </p>
          <Link href="/create">
            <Button size="xl" variant="secondary">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}