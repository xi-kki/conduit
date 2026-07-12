"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { rank: 1, address: "0x1234...5678", points: 2450, tier: "platinum", events: 24 },
  { rank: 2, address: "0xabcd...ef01", points: 1890, tier: "platinum", events: 19 },
  { rank: 3, address: "0x9876...5432", points: 1234, tier: "platinum", events: 15 },
  { rank: 4, address: "0xdead...beef", points: 876, tier: "gold", events: 12 },
  { rank: 5, address: "0xcafe...babe", points: 654, tier: "gold", events: 10 },
  { rank: 6, address: "0xface...food", points: 543, tier: "gold", events: 8 },
  { rank: 7, address: "0xbeef...cake", points: 432, tier: "silver", events: 7 },
  { rank: 8, address: "0x1337...hax0r", points: 321, tier: "silver", events: 6 },
  { rank: 9, address: "0x0000...0001", points: 210, tier: "silver", events: 5 },
  { rank: 10, address: "0xffff...ffff", points: 150, tier: "bronze", events: 4 },
];

const TIER_ICONS: Record<string, any> = {
  platinum: Crown,
  gold: Star,
  silver: Award,
  bronze: Medal,
};

const TIER_COLORS: Record<string, string> = {
  platinum: "text-purple-600 bg-purple-100",
  gold: "text-yellow-500 bg-yellow-100",
  silver: "text-gray-500 bg-gray-100",
  bronze: "text-amber-600 bg-amber-100",
};

export default function LeaderboardPage() {
  const { isConnected, address } = useConduitWallet();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-2">
          Top Conduit community members by loyalty points
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Medal className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-1">2</div>
            <div className="font-medium text-sm mb-1">
              {MOCK_LEADERBOARD[1].address}
            </div>
            <div className="text-muted-foreground text-sm">
              {MOCK_LEADERBOARD[1].points.toLocaleString()} pts
            </div>
            <Badge variant="secondary" className="mt-2">
              {MOCK_LEADERBOARD[1].tier}
            </Badge>
          </CardContent>
        </Card>

        {/* 1st Place */}
        <Card className="border-yellow-400 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-3">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold mb-1">1</div>
            <div className="font-medium mb-1">
              {MOCK_LEADERBOARD[0].address}
            </div>
            <div className="text-muted-foreground">
              {MOCK_LEADERBOARD[0].points.toLocaleString()} pts
            </div>
            <Badge className="mt-2 bg-yellow-500">
              {MOCK_LEADERBOARD[0].tier}
            </Badge>
          </CardContent>
        </Card>

        {/* 3rd Place */}
        <Card className="mt-12">
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="font-medium text-sm mb-1">
              {MOCK_LEADERBOARD[2].address}
            </div>
            <div className="text-muted-foreground text-sm">
              {MOCK_LEADERBOARD[2].points.toLocaleString()} pts
            </div>
            <Badge variant="secondary" className="mt-2">
              {MOCK_LEADERBOARD[2].tier}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Rankings
            </span>
            <Badge variant="secondary">
              {MOCK_LEADERBOARD.length} members
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((entry) => {
              const TierIcon = TIER_ICONS[entry.tier] || Medal;
              const tierColor = TIER_COLORS[entry.tier] || TIER_COLORS.bronze;
              const isCurrentUser = isConnected && address === entry.address;

              return (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser ? "bg-conduit-50 border border-conduit-200" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 text-center font-bold ${
                        entry.rank <= 3 ? "text-lg" : "text-muted-foreground"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className={`h-8 w-8 rounded-full ${tierColor} flex items-center justify-center`}>
                      <TierIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {entry.address}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.events} events attended
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Want to climb the ranks? Start attending events!
        </p>
        <Link href="/events">
          <Button>Browse Events</Button>
        </Link>
      </div>
    </div>
  );
}
