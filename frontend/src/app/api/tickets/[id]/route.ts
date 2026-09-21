import { NextRequest, NextResponse } from "next/server";

// In-memory store (replace with Supabase in production)
const tickets: any[] = [];

// GET /api/tickets/:id - Get ticket by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({ ticket });
}

// PATCH /api/tickets/:id - Update ticket (e.g., check-in)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    tickets[ticketIndex] = { ...tickets[ticketIndex], ...body };

    return NextResponse.json({ ticket: tickets[ticketIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// POST /api/tickets/:id/checkin - Check in a ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (tickets[ticketIndex].checked_in) {
    return NextResponse.json(
      { error: "Ticket already checked in" },
      { status: 400 }
    );
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    checked_in: true,
    is_used: true,
    checked_in_at: new Date().toISOString(),
  };

  return NextResponse.json({ ticket: tickets[ticketIndex] });
}