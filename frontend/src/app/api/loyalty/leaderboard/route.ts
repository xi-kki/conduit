import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const loyaltyAccounts: Record<string, any> = {};

// GET /api/loyalty/leaderboard - Get top users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  // Sort by points descending
  const leaderboard = Object.entries(loyaltyAccounts)
    .map(([address, account]) => ({
      address,
      points: account.points,
      tier: account.tier,
      events_attended: account.events_attended,
    }))
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);

  return NextResponse.json({ leaderboard });
}