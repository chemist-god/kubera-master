"use server";

import { prisma } from "@/lib/db/prisma";
import { hash, compare } from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth/session";
import { withErrorHandling, ActionResult } from "@/lib/utils/result";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeInput,
  sanitizeEmail,
} from "@/lib/utils/validation";
import { validateCaptchaAnswer } from "@/lib/actions/captcha";

// Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaAnswer: string;
  agreeToTerms: boolean;
}

export interface LoginData {
  username: string;
  password: string;
  captchaAnswer: string;
}

export type AuthResult<T = unknown> = ActionResult<T>;

export async function register(
  data: RegisterData
): Promise<AuthResult<{ id: string; username: string; email: string; createdAt: Date }>> {
  return withErrorHandling(async () => {
    // Sanitize inputs
    const username = sanitizeInput(data.username);
    const email = sanitizeEmail(data.email);

    // Validate all required fields
    if (!username || !email || !data.password || !data.confirmPassword) {
      throw new Error("All fields are required");
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      throw new Error(usernameValidation.error);
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.error);
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error);
    }

    // Check password match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Validate captcha
    const captchaResult = await validateCaptchaAnswer(data.captchaAnswer);
    if (!captchaResult.success) {
      throw new Error(captchaResult.error || "CAPTCHA validation failed");
    }

    // Check terms agreement
    if (!data.agreeToTerms) {
      throw new Error("You must agree to the Terms of Service");
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUsername) {
      throw new Error("Username already exists. Please choose a different username.");
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingEmail) {
      throw new Error("Email already registered. Please use a different email or sign in.");
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }, "Failed to create account. Please try again later.");
}

export async function login(
  data: LoginData
): Promise<AuthResult<{ id: string; username: string; email: string }>> {
  return withErrorHandling(async () => {
    // Sanitize inputs
    const username = sanitizeInput(data.username);

    // Validate inputs
    if (!username || !data.password) {
      throw new Error("Username and password are required");
    }

    // Validate captcha
    const captchaResult = await validateCaptchaAnswer(data.captchaAnswer);
    if (!captchaResult.success) {
      throw new Error(captchaResult.error || "CAPTCHA validation failed");
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    // Generic error message to prevent username enumeration
    if (!user || !user.password) {
      throw new Error("Invalid username or password");
    }

    // Verify password
    const passwordValid = await compare(data.password, user.password);
    if (!passwordValid) {
      throw new Error("Invalid username or password");
    }

    // Create session
    await createSession(user.id);

    // Return user data (without password)
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }, "Failed to login. Please try again later.");
}

export async function logout(): Promise<AuthResult> {
  return withErrorHandling(async () => {
    await deleteSession();
    return true;
  }, "Failed to logout");
}
