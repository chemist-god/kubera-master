import { NextRequest, NextResponse } from "next/server";
import { getTickets, createTicket } from "@/lib/actions/tickets";

export async function GET() {
  try {
    const result = await getTickets();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message } = body;
    if (!subject || !message) {
      return NextResponse.json(
        { error: "subject and message are required" },
        { status: 400 }
      );
    }
    const result = await createTicket({ subject, message });
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

