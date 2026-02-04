/**
 * Rate Limiter Utility
 * 
 * In-memory rate limiting for order creation and other actions.
 * Tracks user actions and enforces limits to prevent abuse.
 * 
 * Note: In-memory storage is acceptable for Vercel single-instance deployments.
 * For multi-server deployments, consider migrating to Redis or database-based limiting.
 */

import { orderLimits } from "@/lib/config/business";

interface RateLimitEntry {
  count: number;
  resetAt: Date;
  firstAttempt: Date;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  waitMinutes: number;
}

// In-memory storage for rate limits
// Key format: `${userId}:${action}`
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Clean up expired entries periodically
 * Called automatically on each rate limit check
 */
function cleanupExpiredEntries(): void {
  const now = new Date();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a user action is within rate limits
 * 
 * @param userId - The user ID to check
 * @param action - The action type (e.g., "create_order")
 * @returns RateLimitResult with allowed status and remaining attempts
 */
export function checkRateLimit(
  userId: string,
  action: string = "create_order"
): RateLimitResult {
  // Clean up expired entries first
  cleanupExpiredEntries();
  
  const key = `${userId}:${action}`;
  const now = new Date();
  const entry = rateLimitStore.get(key);
  
  const windowMs = orderLimits.rateLimitWindowMinutes * 60 * 1000;
  const maxAttempts = orderLimits.maxOrdersPerHour;
  
  // No existing entry or entry has expired
  if (!entry || entry.resetAt < now) {
    return {
      allowed: true,
      remaining: maxAttempts,
      resetAt: new Date(now.getTime() + windowMs),
      waitMinutes: 0,
    };
  }
  
  // Entry exists and is still valid
  const remaining = Math.max(0, maxAttempts - entry.count);
  const waitMinutes = Math.ceil((entry.resetAt.getTime() - now.getTime()) / (1000 * 60));
  
  return {
    allowed: entry.count < maxAttempts,
    remaining,
    resetAt: entry.resetAt,
    waitMinutes: remaining === 0 ? waitMinutes : 0,
  };
}

/**
 * Increment the rate limit counter for a user action
 * Call this AFTER a successful action (e.g., order created)
 * 
 * @param userId - The user ID
 * @param action - The action type (e.g., "create_order")
 */
export function incrementRateLimit(
  userId: string,
  action: string = "create_order"
): void {
  const key = `${userId}:${action}`;
  const now = new Date();
  const windowMs = orderLimits.rateLimitWindowMinutes * 60 * 1000;
  
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetAt < now) {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: new Date(now.getTime() + windowMs),
      firstAttempt: now,
    });
  } else {
    // Increment existing entry
    entry.count += 1;
    rateLimitStore.set(key, entry);
  }
}

/**
 * Reset rate limit for a user action
 * Useful for admin overrides or testing
 * 
 * @param userId - The user ID
 * @param action - The action type
 */
export function resetRateLimit(
  userId: string,
  action: string = "create_order"
): void {
  const key = `${userId}:${action}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status for debugging/monitoring
 * 
 * @param userId - The user ID
 * @param action - The action type
 * @returns Current entry or null if none exists
 */
export function getRateLimitStatus(
  userId: string,
  action: string = "create_order"
): RateLimitEntry | null {
  const key = `${userId}:${action}`;
  return rateLimitStore.get(key) || null;
}

/**
 * Format rate limit error message for user display
 * 
 * @param waitMinutes - Minutes until reset
 * @returns User-friendly error message
 */
export function formatRateLimitMessage(waitMinutes: number): string {
  if (waitMinutes <= 1) {
    return "You've created too many orders recently. Please wait about 1 minute.";
  }
  return `You've created too many orders recently. Please wait ${waitMinutes} minutes.`;
}
