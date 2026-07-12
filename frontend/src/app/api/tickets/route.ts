import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const tickets: any[] = [];

// GET /api/tickets - List tickets (filtered by owner or event)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const eventId = searchParams.get("event_id");

  let filtered = tickets;

  if (owner) {
    filtered = filtered.filter((t) => t.original_owner === owner);
  }

  if (eventId) {
    filtered = filtered.filter((t) => t.event_id === eventId);
  }

  return NextResponse.json({ tickets: filtered, total: filtered.length });
}

// POST /api/tickets - Record a new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const ticket = {
      id: `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...body,
      checked_in: false,
      is_used: false,
      created_at: new Date().toISOString(),
    };

    tickets.push(ticket);

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record ticket" },
      { status: 500 }
    );
  }
}