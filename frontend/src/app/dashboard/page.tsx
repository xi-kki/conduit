"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import { formatSui, formatDate, formatTime } from "@/lib/utils";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Wallet,
  Ticket,
  ArrowUpRight,
  Calendar,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/types";

// Mock organizer events
const MOCK_ORGANIZER_EVENTS: (Event & { revenue: number; check_ins: number })[] = [
  {
    id: "1",
    name: "Sui Builder House SF",
    description: "Building day",
    image_url: "",
    start_time: Date.now() + 86400000 * 3,
    end_time: Date.now() + 86400000 * 4,
    venue: "San Francisco, CA",
    organizer: "0x1234",
    ticket_price: 0,
    resale_price_cap: 0,
    royalty_bps: 500,
    total_supply: 200,
    tickets_sold: 156,
    category: "meetup",
    is_active: true,
    revenue: 0,
    check_ins: 0,
  },
  {
    id: "2",
    name: "Web3 Conference 2024",
    description: "Premier conference",
    image_url: "",
    start_time: Date.now() + 86400000 * 7,
    end_time: Date.now() + 86400000 * 9,
    venue: "New York, NY",
    organizer: "0x1234",
    ticket_price: 50000000000,
    resale_price_cap: 75000000000,
    royalty_bps: 1000,
    total_supply: 500,
    tickets_sold: 342,
    category: "conference",
    is_active: true,
    revenue: 17100000000000,
    check_ins: 128,
  },
];

export default function DashboardPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Calculate stats
  const totalEvents = MOCK_ORGANIZER_EVENTS.length;
  const totalTicketsSold = MOCK_ORGANIZER_EVENTS.reduce(
    (sum, e) => sum + e.tickets_sold,
    0
  );
  const totalRevenue = MOCK_ORGANIZER_EVENTS.reduce(
    (sum, e) => sum + e.revenue,
    0
  );
  const totalCheckIns = MOCK_ORGANIZER_EVENTS.reduce(
    (sum, e) => sum + e.check_ins,
    0
  );

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to manage your events.
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
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your events and track performance
          </p>
        </div>
        <Link href="/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-conduit-100 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-conduit-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-3xl font-bold">{totalTicketsSold}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-sui-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-sui-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold">
                  {totalRevenue > 0 ? formatSui(totalRevenue) : "0"}{" "}
                  <span className="text-lg text-muted-foreground">SUI</span>
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Check-ins</p>
                <p className="text-3xl font-bold">{totalCheckIns}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <QrCode className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Events</span>
            <Badge variant="secondary">{totalEvents} events</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_ORGANIZER_EVENTS.map((event) => {
              const soldPercentage = (event.tickets_sold / event.total_supply) * 100;
              const isPast = event.end_time < Date.now();

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{event.name}</h3>
                      {isPast ? (
                        <Badge variant="secondary">Ended</Badge>
                      ) : event.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.start_time)}
                      </span>
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    {/* Progress */}
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {event.tickets_sold} / {event.total_supply}
                      </div>
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                        <div
                          className="h-full bg-conduit-600 rounded-full"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="text-right w-24">
                      <div className="text-sm font-medium">
                        {event.revenue > 0 ? formatSui(event.revenue) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">SUI</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/scan`}>
                        <Button variant="ghost" size="icon">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Link href="/dashboard/scan">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <QrCode className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold">Venue Scanner</h3>
                <p className="text-sm text-muted-foreground">
                  Scan tickets at the door
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-conduit-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-conduit-600" />
              </div>
              <div>
                <h3 className="font-semibold">Create Event</h3>
                <p className="text-sm text-muted-foreground">
                  Launch a new event
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-sui-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-sui-600" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  View detailed insights
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
