"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatSui, formatDate, formatTime } from "@/lib/utils";
import { MapPin, Calendar, Clock, Users, Ticket } from "lucide-react";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isFree = event.ticket_price === 0;
  const spotsLeft = event.total_supply - event.tickets_sold;
  const isSoldOut = spotsLeft === 0;

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden cursor-pointer group h-full">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.name}
              className="object-cover transition-transform group-hover:scale-105 w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-conduit-500 to-conduit-700 flex items-center justify-center">
              <Ticket className="h-12 w-12 text-white/50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isFree ? (
              <Badge variant="free">Free</Badge>
            ) : (
              <Badge>{formatSui(event.ticket_price)} SUI</Badge>
            )}
            {isSoldOut && (
              <Badge variant="destructive">Sold Out</Badge>
            )}
          </div>

          {/* Category */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-conduit-600 transition-colors">
            {event.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {event.description}
          </p>

          <div className="mt-4 space-y-2">
            {/* Date & Time */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{formatDate(event.start_time)}</span>
              <span className="mx-1">·</span>
              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatTime(event.start_time)}</span>
            </div>

            {/* Venue */}
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            {/* Availability */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {isSoldOut ? (
                  <span className="text-red-500">Sold out</span>
                ) : (
                  <>
                    <span className="font-medium text-foreground">{spotsLeft}</span>
                    {" "}spots left
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}