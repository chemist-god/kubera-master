"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

import { SESSION_CONFIG } from "@/lib/utils/constants";

const SESSION_COOKIE_NAME = SESSION_CONFIG.COOKIE_NAME;
const SESSION_MAX_AGE = SESSION_CONFIG.MAX_AGE;

export interface SessionUser {
  id: string;
  username: string;
  email: string;
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.id || null;
}

