import { NextRequest } from "next/server";
import { getProduct } from "@/lib/actions/products";
import { prisma } from "@/lib/db/prisma";
import { apiHandler, parseRequestBody } from "@/lib/utils/api-handler";
import { withErrorHandling } from "@/lib/utils/result";

export const GET = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return { success: false, error: "Product ID is required" };
    }
    const { id } = await context.params;
    return await getProduct(id);
  },
  { errorStatus: 404 }
);

export const PUT = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!request || !context?.params) {
      return { success: false, error: "Request and product ID are required" };
    }
    const { id } = await context.params;
    const body = await parseRequestBody(request);

    return await withErrorHandling(async () => {
      const product = await prisma.product.update({
        where: { id },
        data: body,
      });
      return product;
    }, "Failed to update product");
  }
);

export const DELETE = apiHandler(
  async (request?: NextRequest, context?: { params?: Promise<{ id: string }> }) => {
    if (!context?.params) {
      return { success: false, error: "Product ID is required" };
    }
    const { id } = await context.params;

    return await withErrorHandling(async () => {
      await prisma.product.delete({
        where: { id },
      });
      return { success: true };
    }, "Failed to delete product");
  }
);
