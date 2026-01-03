"use server";

import { prisma } from "@/lib/db/prisma";
import { getBankLogs } from "@/lib/data/bank-logs";
import { BankLog } from "@/lib/api/types";

/**
 * Product Helper Utilities
 * 
 * Provides clean, modular functions for product lifecycle management:
 * - Finding products by bank log ID
 * - Creating products from bank log data
 * - Reusing existing products when available
 */

/**
 * Find a product by bank log ID
 * @param bankLogId - The bank log ID (e.g., "bl-1")
 * @returns Product if found, null otherwise
 */
export async function findProductByBankLogId(
  bankLogId: string
): Promise<{ id: string; status: string } | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: bankLogId },
      select: {
        id: true,
        status: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error finding product by bank log ID:", error);
    return null;
  }
}

/**
 * Get bank log data by ID
 * @param bankLogId - The bank log ID (e.g., "bl-1")
 * @returns BankLog data if found, null otherwise
 */
export async function getBankLogById(bankLogId: string): Promise<BankLog | null> {
  try {
    const bankLogs = getBankLogs();
    const bankLog = bankLogs.find((log) => log.id === bankLogId);
    return bankLog || null;
  } catch (error) {
    console.error("Error getting bank log by ID:", error);
    return null;
  }
}

/**
 * Create a product from bank log data
 * @param bankLog - The bank log data
 * @returns Created product
 */
export async function createProductFromBankLog(
  bankLog: BankLog
): Promise<{ id: string; status: string }> {
  const product = await prisma.product.create({
    data: {
      id: bankLog.id, // Use bank log ID as product ID for consistency
      name: bankLog.product,
      price: bankLog.price,
      balance: bankLog.balance,
      status: bankLog.status || "Available",
      region: bankLog.region,
      bank: bankLog.bank,
      type: bankLog.type,
      description: bankLog.description || null,
    },
    select: {
      id: true,
      status: true,
    },
  });
  return product;
}

/**
 * Get or create a product from bank log ID
 * 
 * This is the main function that handles product lifecycle:
 * 1. Checks if product exists
 * 2. If exists and available, reuses it
 * 3. If not exists, creates from bank log data
 * 4. Handles edge cases (sold products, etc.)
 * 
 * @param bankLogId - The bank log ID (e.g., "bl-1")
 * @returns Product ID
 * @throws Error if bank log not found or product creation fails
 */
export async function getOrCreateProduct(
  bankLogId: string
): Promise<string> {
  // Step 1: Check if product already exists
  const existingProduct = await findProductByBankLogId(bankLogId);

  // Step 2: If product exists and is available, reuse it
  if (existingProduct && existingProduct.status === "Available") {
    return existingProduct.id;
  }

  // Step 3: If product exists but is sold/pending, it's not available
  if (existingProduct) {
    if (existingProduct.status === "Sold") {
      throw new Error(
        "This product has already been sold and is no longer available"
      );
    }
    if (existingProduct.status === "Pending") {
      throw new Error(
        "This product is currently being processed and is not available"
      );
    }
    // For any other status, return the product ID
    return existingProduct.id;
  }

  // Step 4: Product doesn't exist, get bank log data and create product
  const bankLog = await getBankLogById(bankLogId);
  if (!bankLog) {
    throw new Error(`Bank log with ID ${bankLogId} not found`);
  }

  // Step 5: Create product from bank log data
  try {
    const newProduct = await createProductFromBankLog(bankLog);
    return newProduct.id;
  } catch (error) {
    // Handle race condition: product might have been created by another request
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      // Product was created by another request, fetch it
      const product = await findProductByBankLogId(bankLogId);
      if (product) {
        return product.id;
      }
    }
    throw new Error(`Failed to create product: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

