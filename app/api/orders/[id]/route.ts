import { NextRequest } from "next/server";
import { getOrder } from "@/lib/actions/orders";
import { apiHandler } from "@/lib/utils/api-handler";

export const GET = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return { success: false, error: "Order ID is required" };
    }
    const { id } = await context.params;
    return await getOrder(id);
  },
  { errorStatus: 404 }
);
