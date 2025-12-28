import { NextResponse } from "next/server";
import { getDashboardStats, getBankLogs } from "@/lib/actions/dashboard";

export async function GET() {
  try {
    const [statsResult, bankLogsResult] = await Promise.all([
      getDashboardStats(),
      getBankLogs(),
    ]);

    if (!statsResult.success) {
      return NextResponse.json(
        { error: statsResult.error },
        { status: 500 }
      );
    }

    if (!bankLogsResult.success) {
      return NextResponse.json(
        { error: bankLogsResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        stats: statsResult.data,
        bankLogs: bankLogsResult.data,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

