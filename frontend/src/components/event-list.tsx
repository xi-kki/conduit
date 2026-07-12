"use client";

import { EventCard } from "@/components/event-card";
import type { Event } from "@/lib/types";
import { Ticket } from "lucide-react";

interface EventListProps {
  events: Event[];
  emptyMessage?: string;
}

export function EventList({ events, emptyMessage = "No events found" }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Ticket className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Check back later for new events
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}