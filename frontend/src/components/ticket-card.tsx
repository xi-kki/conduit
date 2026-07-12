"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSui, formatDate, formatTime } from "@/lib/utils";
import { Ticket, MapPin, Calendar, Clock, QrCode, CheckCircle } from "lucide-react";
import type { Ticket as TicketType, Event } from "@/lib/types";

interface TicketCardProps {
  ticket: TicketType;
  event?: Event;
  onCheckIn?: () => void;
}

export function TicketCard({ ticket, event, onCheckIn }: TicketCardProps) {
  const isFree = ticket.purchase_price === 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Left: QR Code Placeholder */}
        <div className="w-32 bg-gradient-to-br from-conduit-500 to-conduit-700 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-2">
            <QrCode className="h-16 w-16 text-conduit-700" />
          </div>
        </div>

        {/* Right: Ticket Info */}
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={isFree ? "free" : "default"}>
                  {ticket.tier}
                </Badge>
                {ticket.checked_in && (
                  <Badge variant="success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Checked In
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-lg">
                {event?.name || `Event #${ticket.event_id.slice(0, 8)}`}
              </h3>

              {event && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.start_time)}
                    <span className="mx-1">·</span>
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(event.start_time)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue}
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <Ticket className="h-4 w-4 mr-2" />
                Ticket #{ticket.ticket_number}
                {!isFree && (
                  <>
                    <span className="mx-1">·</span>
                    {formatSui(ticket.purchase_price)} SUI
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              {!ticket.checked_in && onCheckIn && (
                <Button size="sm" onClick={onCheckIn}>
                  Check In
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}