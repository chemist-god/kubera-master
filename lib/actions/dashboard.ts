"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { Order } from "@prisma/client"; //  Use Prisma-generated type

// Helper type: shape of order when only `status` is selected
type OrderStatusOnly = Pick<Order, "status">;

export async function getDashboardStats() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    const [wallet, orders] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId },
        select: { balance: true },
      }),
      prisma.order.findMany({
        where: { userId },
        select: { status: true },
      }),
    ]);

    //  Explicitly narrow type for safety & inference
    const typedOrders = orders as OrderStatusOnly[];

    const availableFunds = wallet?.balance || 0;
    const totalCompleted = typedOrders.filter(
      (order) => order.status === "Completed"
    ).length;

    const awaitingProcessing = typedOrders.filter(
      (order) => order.status === "Pending" || order.status === "Processing"
    ).length;

    return {
      availableFunds,
      totalCompleted,
      awaitingProcessing,
    };
  }, "Failed to fetch dashboard stats");
}

export async function getBankLogs() {
  return withErrorHandling(async () => {
    await requireAuth();

    const products = await prisma.product.findMany({
      where: { status: "Available" },
      orderBy: { createdAt: "desc" },
    });

    //  Optional: add type annotation for clarity (not required, but helpful)
    return products.map((product) => ({
      id: product.id,
      product: product.name,
      type: product.type,
      bank: product.bank,
      balance: product.balance,
      price: product.price,
      region: product.region,
      status: product.status,
      description: product.description ?? "",
    }));
  }, "Failed to fetch bank logs");
}