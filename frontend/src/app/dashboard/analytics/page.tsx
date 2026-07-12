"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import { formatSui, formatDate } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  ArrowLeft,
  Download,
  Wallet,
  Ticket,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Mock analytics data
const MOCK_ANALYTICS = {
  overview: {
    totalRevenue: 85500000000000, // 85.5 SUI
    totalTicketsSold: 1438,
    totalCheckIns: 1124,
    averageTicketPrice: 59500000000, // ~0.06 SUI
    conversionRate: 78.2,
    revenueGrowth: 12.5,
    ticketGrowth: 8.3,
  },
  recentSales: [
    { date: "2024-01-15", tickets: 45, revenue: 2250000000000 },
    { date: "2024-01-14", tickets: 38, revenue: 1900000000000 },
    { date: "2024-01-13", tickets: 52, revenue: 2600000000000 },
    { date: "2024-01-12", tickets: 29, revenue: 1450000000000 },
    { date: "2024-01-11", tickets: 67, revenue: 3350000000000 },
  ],
  topEvents: [
    { name: "Web3 Conference 2024", tickets: 342, revenue: 17100000000000 },
    { name: "Sui Builder House SF", tickets: 156, revenue: 0 },
    { name: "NFT Art Gallery", tickets: 98, revenue: 9800000000000 },
  ],
  audienceInsights: {
    uniqueWallets: 892,
    returningAttendees: 234,
    averageTicketsPerUser: 1.61,
    topHolderTiers: [
      { tier: "Platinum", count: 45, percentage: 5 },
      { tier: "Gold", count: 124, percentage: 14 },
      { tier: "Silver", count: 287, percentage: 32 },
      { tier: "Bronze", count: 436, percentage: 49 },
    ],
  },
  secondaryMarket: {
    totalResales: 89,
    totalVolume: 4450000000000,
    averageResalePrice: 50000000000,
    royaltyDistributed: 445000000000,
  },
};

export default function AnalyticsPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view analytics.
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
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track your events performance and audience insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">
              {formatSui(MOCK_ANALYTICS.overview.totalRevenue)}{" "}
              <span className="text-lg text-muted-foreground">SUI</span>
            </p>
            <p className="text-sm text-sui-600 mt-1">
              +{MOCK_ANALYTICS.overview.revenueGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Tickets Sold</p>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">
              {MOCK_ANALYTICS.overview.totalTicketsSold.toLocaleString()}
            </p>
            <p className="text-sm text-sui-600 mt-1">
              +{MOCK_ANALYTICS.overview.ticketGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Check-in Rate</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">
              {((MOCK_ANALYTICS.overview.totalCheckIns / MOCK_ANALYTICS.overview.totalTicketsSold) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {MOCK_ANALYTICS.overview.totalCheckIns.toLocaleString()} check-ins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg. Ticket Price</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">
              {formatSui(MOCK_ANALYTICS.overview.averageTicketPrice)}{" "}
              <span className="text-lg text-muted-foreground">SUI</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Across all events
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ANALYTICS.recentSales.map((day) => (
                <div key={day.date} className="flex items-center">
                  <div className="w-20 text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-conduit-500"
                        style={{
                          width: `${(day.tickets / 70) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium">
                    {day.tickets}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ANALYTICS.topEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-conduit-100 flex items-center justify-center text-conduit-600 font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.tickets} tickets
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {event.revenue > 0 ? formatSui(event.revenue) : "—"} SUI
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Audience Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audience Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {MOCK_ANALYTICS.audienceInsights.uniqueWallets}
                </div>
                <div className="text-sm text-muted-foreground">
                  Unique Wallets
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {MOCK_ANALYTICS.audienceInsights.returningAttendees}
                </div>
                <div className="text-sm text-muted-foreground">
                  Returning Attendees
                </div>
              </div>
            </div>

            <h4 className="font-medium mb-3">Holder Tiers</h4>
            <div className="space-y-2">
              {MOCK_ANALYTICS.audienceInsights.topHolderTiers.map((tier) => (
                <div key={tier.tier} className="flex items-center">
                  <div className="w-20 text-sm">{tier.tier}</div>
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-conduit-500"
                        style={{ width: `${tier.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-muted-foreground">
                    {tier.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secondary Market */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Secondary Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {MOCK_ANALYTICS.secondaryMarket.totalResales}
                </div>
                <div className="text-sm text-muted-foreground">Total Resales</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold">
                  {formatSui(MOCK_ANALYTICS.secondaryMarket.totalVolume)}{" "}
                  <span className="text-sm">SUI</span>
                </div>
                <div className="text-sm text-muted-foreground">Volume</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-sui-50 border border-sui-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-sui-600" />
                <span className="font-medium text-sui-900">
                  Royalties Distributed
                </span>
              </div>
              <div className="text-3xl font-bold text-sui-700">
                {formatSui(MOCK_ANALYTICS.secondaryMarket.royaltyDistributed)}{" "}
                SUI
              </div>
              <div className="text-sm text-sui-600 mt-1">
                Automatically routed to creators
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
