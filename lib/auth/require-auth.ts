"use server";

import { getCurrentUserId, getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

/**
 * Requires authentication and returns the current user ID
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }
  return userId;
}

/**
 * Requires authentication and returns the current user session
 * Redirects to login if not authenticated
 */
export async function requireUser() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Checks if user is authenticated (does not redirect)
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId();
  return !!userId;
}

