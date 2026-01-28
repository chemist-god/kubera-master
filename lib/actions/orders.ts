"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";
import { revalidatePath } from "next/cache";
import { businessConfig } from "@/lib/config/business";
import {
  generateReceiptNumber,
  generateTransactionId,
  calculateOrderTotals,
} from "@/lib/utils/receipt-helpers";

type CartItemWithProduct = {
  productId: string;
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
        transaction: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            country: true,
            createdAt: true,
          },
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

/**
 * Create order from cart items
 * 
 * This function now handles product status management:
 * 1. Creates order with items
 * 2. Updates product status to "Pending"
 * 3. Removes cart items
 * 
 * @param cartItemIds - Array of cart item IDs to create order from
 */
export async function createOrder(cartItemIds: string[]) {
  return withErrorHandling(async () => {
    const userId = await requireAuth();

    // Step 1: Get cart items
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

    // Step 2: Calculate totals with tax
    const subtotal = cartItems.reduce(
      (sum: number, item: CartItemWithProduct) =>
        sum + item.product.price * item.quantity,
      0
    );

    const totals = calculateOrderTotals(subtotal, businessConfig.defaultTaxRate);
    const receiptNumber = generateReceiptNumber();
    const transactionId = generateTransactionId();

    // Step 3: Create order with items and transaction
    const order = await prisma.order.create({
      data: {
        userId,
        receiptNumber,
        transactionId,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        taxRate: totals.taxRate,
        total: totals.total,
        paymentMethod: "Wallet Balance",
        status: "Pending",
        items: {
          create: cartItems.map((item: CartItemWithProduct) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
        transaction: {
          create: {
            userId,
            amount: totals.total,
            type: "purchase",
            method: "wallet",
            status: "completed",
          },
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        transaction: true,
      },
    });

    // Step 4: Update product status to "Pending" for all products in order
    // This marks them as being processed
    const productIds = cartItems.map((item) => item.productId);
    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        status: "Available", // Only update if still available
      },
      data: {
        status: "Pending",
      },
    });

    // Step 5: Remove cart items
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
    });

    // Create Notification
    try {
      const { createNotification } = await import("@/lib/actions/notifications");
      await createNotification(
        userId,
        "Order Placed Successfully",
        `Order #${order.id.slice(0, 8)} has been placed and is being processed.`,
        "success"
      );
    } catch (e) {
      console.error("Failed to create order notification", e);
    }

    revalidatePath("/user/cart");
    return order;
  }, "Failed to create order");
}

/**
 * Update order status
 * 
 * This function handles product status updates:
 * - When order is "Completed": Update products to "Sold"
 * - When order is "Cancelled": Update products back to "Available"
 * 
 * @param orderId - The order ID to update
 * @param status - New status (Pending, Processing, Completed, Cancelled)
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  await withErrorHandling(async () => {
    const userId = await requireAuth();

    // Get order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: { productId: true },
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

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Update product statuses based on order status
    const productIds = order.items.map((item) => item.productId);

    if (status === "Completed") {
      // Mark products as sold
      await prisma.product.updateMany({
        where: {
          id: { in: productIds },
        },
        data: {
          status: "Sold",
        },
      });
    } else if (status === "Cancelled") {
      // Return products to available (if they were pending)
      await prisma.product.updateMany({
        where: {
          id: { in: productIds },
          status: "Pending",
        },
        data: {
          status: "Available",
        },
      });
    }
    // For "Processing" status, keep products as "Pending"
  }, "Failed to update order status");
}
