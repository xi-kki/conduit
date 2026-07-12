import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const events: any[] = [];

// GET /api/events - List all events
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const freeOnly = searchParams.get("free") === "true";

  let filtered = events.filter((e) => e.is_active);

  if (category) {
    filtered = filtered.filter((e) => e.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
    );
  }

  if (freeOnly) {
    filtered = filtered.filter((e) => e.ticket_price === 0);
  }

  return NextResponse.json({ events: filtered, total: filtered.length });
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...body,
      tickets_sold: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    events.push(event);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}