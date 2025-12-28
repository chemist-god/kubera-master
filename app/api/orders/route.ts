import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/actions/orders";

export async function GET() {
  try {
    const result = await getOrders();
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
    const { cartItemIds } = body;
    if (!cartItemIds || !Array.isArray(cartItemIds)) {
      return NextResponse.json(
        { error: "cartItemIds array is required" },
        { status: 400 }
      );
    }
    const result = await createOrder(cartItemIds);
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

