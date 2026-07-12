"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventList } from "@/components/event-list";
import { formatSui } from "@/lib/utils";
import {
  User,
  MapPin,
  Calendar,
  Ticket,
  DollarSign,
  ExternalLink,
  Twitter,
  Globe,
} from "lucide-react";
import type { Event } from "@/lib/types";

// Mock organizer data
const MOCK_ORGANIZER = {
  address: "0x1234567890abcdef",
  name: "Sui Foundation",
  bio: "Building the future of decentralized commerce and social interaction on Sui.",
  location: "San Francisco, CA",
  website: "https://sui.io",
  twitter: "@suinetwork",
  events_hosted: 12,
  tickets_sold: 2450,
  total_revenue: 122500000000000,
  joined: "2023-06-15",
};

const MOCK_EVENTS: Event[] = [
  {
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
  {
    id: "2",
    name: "Sui Developer Workshop",
    description: "Hands-on Move workshop",
    image_url: "",
    start_time: Date.now() + 86400000 * 10,
    end_time: Date.now() + 86400000 * 11,
    venue: "Virtual",
    organizer: "0x1234567890abcdef",
    ticket_price: 0,
    resale_price_cap: 0,
    royalty_bps: 0,
    total_supply: 100,
    tickets_sold: 45,
    category: "workshop",
    is_active: true,
  },
];

export default function OrganizerProfilePage({
  params,
}: {
  params: { address: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-conduit-500 to-sui-500 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold">{MOCK_ORGANIZER.name}</h1>
                <Badge variant="secondary">Verified Organizer</Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {MOCK_ORGANIZER.bio}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {MOCK_ORGANIZER.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(MOCK_ORGANIZER.joined).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                {MOCK_ORGANIZER.website && (
                  <a
                    href={MOCK_ORGANIZER.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {MOCK_ORGANIZER.twitter && (
                  <a
                    href={`https://twitter.com/${MOCK_ORGANIZER.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Ticket className="h-6 w-6 text-conduit-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{MOCK_ORGANIZER.events_hosted}</div>
            <div className="text-sm text-muted-foreground">Events Hosted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <User className="h-6 w-6 text-sui-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{MOCK_ORGANIZER.tickets_sold.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Tickets Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formatSui(MOCK_ORGANIZER.total_revenue)} <span className="text-sm">SUI</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Events */}
      <div>
        <h2 className="text-xl font-bold mb-4">Events by {MOCK_ORGANIZER.name}</h2>
        <EventList events={MOCK_EVENTS} />
      </div>
    </div>
  );
}
