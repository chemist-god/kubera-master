"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

type OrderStatusOnly = {
  status: string;
};

type Product = {
  id: string;
  name: string;
  type: string;
  bank: string;
  balance: number;
  price: number;
  region: string;
  status: string;
  description: string | null;
};

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


    const typedOrders: OrderStatusOnly[] = orders;

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

    return products.map((product: Product) => ({
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