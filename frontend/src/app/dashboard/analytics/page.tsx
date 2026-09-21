"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduit } from "@/lib/useConduit";
import { formatSui, formatDate } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  Ticket,
  ArrowLeft,
  Wallet,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const { isConnected, connectWallet, organizerEvents, loadOrganizerEvents, isDeployed } = useConduit();

  useEffect(() => {
    if (isConnected && isDeployed) {
      loadOrganizerEvents();
    }
  }, [isConnected, isDeployed, loadOrganizerEvents]);

  // Calculate real stats
  const totalTicketsSold = organizerEvents.reduce((sum, e) => sum + e.tickets_sold, 0);
  const totalCapacity = organizerEvents.reduce((sum, e) => sum + e.total_supply, 0);
  const avgSoldPercent = totalCapacity > 0 ? (totalTicketsSold / totalCapacity) * 100 : 0;

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground mb-6">Connect your wallet to view analytics.</p>
          <Button onClick={connectWallet} size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Your events performance</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Events</p>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{organizerEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Tickets Sold</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{totalTicketsSold}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg. Fill Rate</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{avgSoldPercent.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Events Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {organizerEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events yet. Create one to see analytics.
            </div>
          ) : (
            <div className="space-y-4">
              {organizerEvents.map((event) => {
                const pct = (event.tickets_sold / event.total_supply) * 100;
                return (
                  <div key={event.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{event.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {event.tickets_sold}/{event.total_supply}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-conduit-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <Badge variant="secondary">{pct.toFixed(0)}%</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
