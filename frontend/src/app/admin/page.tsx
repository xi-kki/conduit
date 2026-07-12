"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatSui, formatDate } from "@/lib/utils";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  Users,
  Ticket,
  Calendar,
} from "lucide-react";

// Mock pending events
const MOCK_PENDING_EVENTS = [
  {
    id: "pending1",
    name: "DeFi Summit Miami",
    organizer: "0x1234...5678",
    organizer_name: "DeFi Miami",
    submitted: "2024-01-15",
    category: "conference",
    start_time: Date.now() + 86400000 * 14,
    venue: "Miami, FL",
    ticket_price: 25000000000,
    total_supply: 300,
  },
  {
    id: "pending2",
    name: "NFT Art Night",
    organizer: "0xabcd...ef01",
    organizer_name: "Art Collective",
    submitted: "2024-01-14",
    category: "party",
    start_time: Date.now() + 86400000 * 7,
    venue: "New York, NY",
    ticket_price: 0,
    total_supply: 100,
  },
  {
    id: "pending3",
    name: "Move Workshop Berlin",
    organizer: "0x9876...5432",
    organizer_name: "Sui Berlin",
    submitted: "2024-01-13",
    category: "workshop",
    start_time: Date.now() + 86400000 * 21,
    venue: "Berlin, Germany",
    ticket_price: 0,
    total_supply: 50,
  },
];

export default function AdminPage() {
  const [events, setEvents] = useState(MOCK_PENDING_EVENTS);

  const handleApprove = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    // In production: call API to approve event
  };

  const handleReject = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    // In production: call API to reject event
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-conduit-600" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Review and approve event submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold">{events.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-sui-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected Today</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">52</p>
              </div>
              <Ticket className="h-8 w-8 text-conduit-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Events
            </span>
            <Badge variant="secondary">{events.length} pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events pending review
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{event.name}</h3>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.organizer_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.start_time)}
                      </span>
                      <span>{event.venue}</span>
                      <span>
                        {event.ticket_price === 0
                          ? "Free"
                          : `${formatSui(event.ticket_price)} SUI`}
                      </span>
                      <span>{event.total_supply} tickets</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sui-600 border-sui-200 hover:bg-sui-50"
                      onClick={() => handleApprove(event.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleReject(event.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Queue */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Flagged Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No flagged content
          </div>
        </CardContent>
      </Card>
    </div>
  );
}