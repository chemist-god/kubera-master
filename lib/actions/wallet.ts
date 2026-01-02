"use server";

import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/require-auth";
import { withErrorHandling } from "@/lib/utils/result";

// Lazy import Bitcoin utilities to avoid loading them on page load
async function getBitcoinUtils() {
  const { generateBitcoinAddress, validateBitcoinAddress } = await import("@/lib/utils/bitcoin");
  return { generateBitcoinAddress, validateBitcoinAddress };
}

export async function getWallet() {
  return withErrorHandling(async () => {
    const userId = await requireAuth();
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      });
    }

    return wallet;
  }, "Failed to fetch wallet");
}

export async function generateWalletAddress() {
  return withErrorHandling(async () => {
    try {
      const userId = await requireAuth();

      // Check if wallet already exists with an address
      const existingWallet = await prisma.wallet.findUnique({
        where: { userId },
        select: { address: true, updatedAt: true },
      });

      // Rate limiting: Prevent address regeneration within 24 hours
      if (existingWallet?.address) {
        const lastUpdate = existingWallet.updatedAt;
        const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);

        if (hoursSinceUpdate < 24) {
          const hoursRemaining = Math.ceil(24 - hoursSinceUpdate);
          throw new Error(
            `Address already generated. Please wait ${hoursRemaining} hour(s) before generating a new address.`
          );
        }
      }

      // Generate secure Bitcoin address using HD wallet
      const { generateBitcoinAddress, validateBitcoinAddress } = await getBitcoinUtils();

      let address: string;
      try {
        address = generateBitcoinAddress(userId);
      } catch (genError) {
        console.error("Bitcoin address generation error:", genError);
        throw new Error(
          `Failed to generate Bitcoin address: ${genError instanceof Error ? genError.message : String(genError)}`
        );
      }

      // Validate the generated address before storing
      if (!validateBitcoinAddress(address)) {
        console.error("Generated address failed validation:", address);
        throw new Error("Generated address failed validation. Please try again.");
      }

      // Update or create wallet with the new address
      const wallet = await prisma.wallet.upsert({
        where: { userId },
        update: {
          address,
          updatedAt: new Date(),
        },
        create: {
          userId,
          balance: 0,
          address,
        },
      });

      return wallet;
    } catch (error) {
      console.error("generateWalletAddress error:", error);
      throw error;
    }
  }, "Failed to generate wallet address");
}
