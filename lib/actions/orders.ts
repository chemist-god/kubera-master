"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

type CartItemWithProduct = {
  product: { price: number };
  quantity: number;
};

export async function getOrders() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  }, "Failed to fetch orders");
}

export async function getOrder(orderId: string) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new Error("Unauthorized access to order");
    }

    return order;
  }, "Failed to fetch order");
}

export async function createOrder(cartItemIds: string[]) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new Error("No items in cart");
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum: number, item: CartItemWithProduct) => sum + item.product.price * item.quantity,
      0
    );

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "Pending",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Remove cart items
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
    });

    return order;
  }, "Failed to create order");
}
