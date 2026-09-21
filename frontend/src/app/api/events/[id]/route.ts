import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const events: any[] = [];

// GET /api/events/:id - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}

// PATCH /api/events/:id - Update event
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventIndex = events.findIndex((e) => e.id === id);

  if (eventIndex === -1) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    events[eventIndex] = { ...events[eventIndex], ...body };

    return NextResponse.json({ event: events[eventIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/:id - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventIndex = events.findIndex((e) => e.id === id);

  if (eventIndex === -1) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  events.splice(eventIndex, 1);

  return NextResponse.json({ success: true });
}