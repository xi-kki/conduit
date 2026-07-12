"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConduitWallet } from "@/lib/hooks";
import {
  Trophy,
  Star,
  Gift,
  TrendingUp,
  Award,
  Gem,
  Crown,
  Medal,
  Wallet,
  Lock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Mock loyalty data
const MOCK_LOYALTY = {
  points: 750,
  tier: "gold",
  events_attended: 8,
  points_history: [
    { points: 50, reason: "Ticket Purchase", date: "2024-01-15" },
    { points: 25, reason: "Event Check-in", date: "2024-01-15" },
    { points: 10, reason: "Ticket Claim", date: "2024-01-10" },
    { points: 50, reason: "Ticket Purchase", date: "2024-01-08" },
    { points: 25, reason: "Event Check-in", date: "2024-01-08" },
    { points: 10, reason: "Ticket Claim", date: "2024-01-03" },
  ],
  availableRewards: [
    {
      id: 1,
      name: "Exclusive NFT Badge",
      description: "Limited edition Conduit supporter NFT",
      points_cost: 100,
      supply: 100,
      claimed: 67,
    },
    {
      id: 2,
      name: "Free Ticket Voucher",
      description: "Get a free ticket to any event",
      points_cost: 200,
      supply: 50,
      claimed: 23,
    },
    {
      id: 3,
      name: "VIP Upgrade",
      description: "Upgrade to VIP at your next event",
      points_cost: 500,
      supply: 25,
      claimed: 12,
    },
  ],
};

const TIER_CONFIG = {
  bronze: {
    name: "Bronze",
    icon: Medal,
    color: "text-amber-600",
    bg: "bg-amber-100",
    minPoints: 0,
    perks: ["Basic loyalty tracking", "10 pts per claim"],
  },
  silver: {
    name: "Silver",
    icon: Award,
    color: "text-gray-500",
    bg: "bg-gray-100",
    minPoints: 200,
    perks: ["Priority support", "15 pts per claim", "Early event access"],
  },
  gold: {
    name: "Gold",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-100",
    minPoints: 500,
    perks: ["VIP rewards", "20 pts per claim", "Exclusive events", "10% merch discount"],
  },
  platinum: {
    name: "Platinum",
    icon: Crown,
    color: "text-purple-600",
    bg: "bg-purple-100",
    minPoints: 1000,
    perks: ["All Gold perks", "25 pts per claim", "Backstage access", "20% merch discount", "Direct organizer contact"],
  },
};

export default function LoyaltyPage() {
  const { isConnected, connectWallet } = useConduitWallet();
  const [selectedReward, setSelectedReward] = useState<number | null>(null);

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-conduit-100 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-conduit-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loyalty Program</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your loyalty status and rewards.
          </p>
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  const currentTier = TIER_CONFIG[MOCK_LOYALTY.tier as keyof typeof TIER_CONFIG];
  const nextTier = MOCK_LOYALTY.tier === "platinum" ? null : 
    TIER_CONFIG[MOCK_LOYALTY.tier === "bronze" ? "silver" : MOCK_LOYALTY.tier === "silver" ? "gold" : "platinum"];
  
  const progressToNext = nextTier 
    ? ((MOCK_LOYALTY.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Loyalty Program</h1>
        <p className="text-muted-foreground mt-2">
          Earn points, level up, and unlock exclusive rewards
        </p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Tier Badge */}
            <div className={`h-32 w-32 rounded-full ${currentTier.bg} flex items-center justify-center`}>
              <currentTier.icon className={`h-16 w-16 ${currentTier.color}`} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-2xl font-bold">{currentTier.name} Member</h2>
                <Badge variant="secondary">
                  {currentTier.name}
                </Badge>
              </div>
              
              <div className="text-4xl font-bold mb-4">
                {MOCK_LOYALTY.points.toLocaleString()}{" "}
                <span className="text-lg text-muted-foreground">points</span>
              </div>

              {/* Progress to next tier */}
              {nextTier && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Progress to {nextTier.name}
                    </span>
                    <span className="font-medium">
                      {MOCK_LOYALTY.points} / {nextTier.minPoints} pts
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-conduit-500 to-sui-500 transition-all"
                      style={{ width: `${Math.min(progressToNext, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span>{MOCK_LOYALTY.events_attended} events attended</span>
                <span>·</span>
                <span>{currentTier.perks.length} perks unlocked</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentTier.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-sui-500 flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">How to Earn Points</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Claim free ticket</span>
                  <span className="font-medium text-foreground">+10 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Purchase ticket</span>
                  <span className="font-medium text-foreground">+50 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in at event</span>
                  <span className="font-medium text-foreground">+25 pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Resell ticket</span>
                  <span className="font-medium text-foreground">+5 pts</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Points History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Points History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_LOYALTY.points_history.map((entry, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-sui-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-sui-600" />
                    </div>
                    <div>
                      <div className="font-medium">{entry.reason}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-sui-600">+{entry.points}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Rewards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {MOCK_LOYALTY.availableRewards.map((reward) => {
              const canAfford = MOCK_LOYALTY.points >= reward.points_cost;
              const isAvailable = reward.claimed < reward.supply;

              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border transition-all ${
                    canAfford && isAvailable
                      ? "hover:border-conduit-500 hover:shadow-md cursor-pointer"
                      : "opacity-60"
                  }`}
                  onClick={() => canAfford && isAvailable && setSelectedReward(reward.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-conduit-600" />
                    <h3 className="font-semibold">{reward.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{reward.points_cost}</span>
                      <span className="text-sm text-muted-foreground">pts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {reward.supply - reward.claimed} left
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tier Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tier Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {Object.entries(TIER_CONFIG).map(([key, tier], i) => {
              const isActive = key === MOCK_LOYALTY.tier;
              const isPast = 
                (key === "bronze") ||
                (key === "silver" && ["gold", "platinum"].includes(MOCK_LOYALTY.tier)) ||
                (key === "gold" && MOCK_LOYALTY.tier === "platinum");

              return (
                <div key={key} className="flex flex-col items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? `${tier.bg} ring-2 ring-offset-2 ring-conduit-500`
                        : isPast
                        ? `${tier.bg}`
                        : "bg-muted"
                    }`}
                  >
                    <tier.icon
                      className={`h-6 w-6 ${
                        isActive ? tier.color : isPast ? tier.color : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium ${isActive ? "text-conduit-600" : ""}`}>
                      {tier.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tier.minPoints}+ pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
