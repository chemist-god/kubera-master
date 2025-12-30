"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { Order } from "@prisma/client";

export async function getDashboardStats() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    const [wallet, orders] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId },
      }),
      prisma.order.findMany({
        where: { userId },
      }),
    ]);

    const availableFunds = wallet?.balance || 0;
    const totalCompleted = orders.filter((o: Order) => o.status === "Completed").length;
    const awaitingProcessing = orders.filter(
      (o: Order) => o.status === "Pending" || o.status === "Processing"
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
    await requireAuth(); // Ensure user is authenticated

    // Bank logs are essentially products available for purchase
    const products = await prisma.product.findMany({
      where: { status: "Available" },
      orderBy: { createdAt: "desc" },
    });

    // Transform products to bank log format
    return products.map((product) => ({
      id: product.id,
      product: product.name,
      type: product.type,
      bank: product.bank,
      balance: product.balance,
      price: product.price,
      region: product.region,
      status: product.status,
      description: product.description || "",
    }));
  }, "Failed to fetch bank logs");
}
