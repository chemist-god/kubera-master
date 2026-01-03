"use server";

import { prisma } from "@/lib/db/prisma";

/**
 * Product Cleanup Utilities
 * 
 * Handles cleanup of orphaned products that are:
 * - Not in any cart
 * - Not in any order
 * - Status is "Available"
 */

/**
 * Check if a product is orphaned (not in use)
 * @param productId - The product ID to check
 * @returns true if product is orphaned, false otherwise
 */
export async function isProductOrphaned(
  productId: string
): Promise<boolean> {
  try {
    // Check if product is in any cart
    const cartItemCount = await prisma.cartItem.count({
      where: { productId },
    });

    if (cartItemCount > 0) {
      return false; // Product is in a cart, not orphaned
    }

    // Check if product is in any order
    const orderItemCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderItemCount > 0) {
      return false; // Product is in an order, not orphaned
    }

    // Check product status
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { status: true },
    });

    // Only cleanup if status is "Available"
    // Products with status "Sold" or "Pending" should be kept for history
    if (product && product.status === "Available") {
      return true; // Product is orphaned
    }

    return false;
  } catch (error) {
    console.error("Error checking if product is orphaned:", error);
    return false; // On error, don't cleanup (safer)
  }
}

/**
 * Cleanup a single orphaned product
 * @param productId - The product ID to cleanup
 * @returns true if product was deleted, false otherwise
 */
export async function cleanupOrphanedProduct(
  productId: string
): Promise<boolean> {
  try {
    const isOrphaned = await isProductOrphaned(productId);
    if (!isOrphaned) {
      return false; // Product is not orphaned, don't delete
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return true;
  } catch (error) {
    console.error("Error cleaning up orphaned product:", error);
    return false;
  }
}

/**
 * Cleanup multiple orphaned products
 * Finds all orphaned products and deletes them
 * @returns Number of products cleaned up
 */
export async function cleanupAllOrphanedProducts(): Promise<number> {
  try {
    // Find all products with status "Available"
    const availableProducts = await prisma.product.findMany({
      where: { status: "Available" },
      select: { id: true },
    });

    let cleanedCount = 0;

    // Check each product and cleanup if orphaned
    for (const product of availableProducts) {
      const isOrphaned = await isProductOrphaned(product.id);
      if (isOrphaned) {
        try {
          await prisma.product.delete({
            where: { id: product.id },
          });
          cleanedCount++;
        } catch (error) {
          console.error(
            `Error deleting product ${product.id}:`,
            error
          );
          // Continue with other products even if one fails
        }
      }
    }

    return cleanedCount;
  } catch (error) {
    console.error("Error cleaning up orphaned products:", error);
    return 0;
  }
}

