import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const loyaltyAccounts: Record<string, any> = {};

// GET /api/loyalty - Get user's loyalty info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json({ error: "User address required" }, { status: 400 });
  }

  const account = loyaltyAccounts[user] || {
    points: 0,
    points_redeemed: 0,
    events_attended: 0,
    tickets_purchased: 0,
    tier: "bronze",
    history: [],
  };

  return NextResponse.json({ account });
}

// POST /api/loyalty - Award points
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, points, reason } = body;

    if (!user || !points) {
      return NextResponse.json(
        { error: "User and points required" },
        { status: 400 }
      );
    }

    if (!loyaltyAccounts[user]) {
      loyaltyAccounts[user] = {
        points: 0,
        points_redeemed: 0,
        events_attended: 0,
        tickets_purchased: 0,
        tier: "bronze",
        history: [],
      };
    }

    const account = loyaltyAccounts[user];
    account.points += points;
    account.history.push({
      points,
      reason,
      timestamp: new Date().toISOString(),
    });

    // Update tier
    if (account.points >= 1000) {
      account.tier = "platinum";
    } else if (account.points >= 500) {
      account.tier = "gold";
    } else if (account.points >= 200) {
      account.tier = "silver";
    } else {
      account.tier = "bronze";
    }

    return NextResponse.json({ account });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to award points" },
      { status: 500 }
    );
  }
}