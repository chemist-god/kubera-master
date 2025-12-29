"use server";

import { prisma } from "@/lib/db/prisma";
import { hash, compare } from "bcryptjs";
import { createSession, deleteSession } from "@/lib/auth/session";

// Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaAnswer: string;
  captchaExpected: number;
  agreeToTerms: boolean;
}

export interface LoginData {
  username: string;
  password: string;
  captchaAnswer: string;
  captchaExpected: number;
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Validation helpers
function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Invalid email address format" };
  }
  
  return { valid: true };
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: "Password is required" };
  }
  
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  
  return { valid: true };
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: "Username is required" };
  }
  
  const trimmedUsername = username.trim();
  
  if (trimmedUsername.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long" };
  }
  
  if (trimmedUsername.length > 20) {
    return { valid: false, error: "Username must be less than 20 characters" };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return { valid: false, error: "Username can only contain letters, numbers, and underscores" };
  }
  
  return { valid: true };
}

function validateCaptcha(answer: string, expected: number): { valid: boolean; error?: string } {
  if (!answer || answer.trim().length === 0) {
    return { valid: false, error: "Captcha answer is required" };
  }
  
  const parsedAnswer = parseInt(answer.trim(), 10);
  
  if (isNaN(parsedAnswer)) {
    return { valid: false, error: "Captcha answer must be a number" };
  }
  
  if (parsedAnswer !== expected) {
    return { valid: false, error: "Incorrect captcha answer" };
  }
  
  return { valid: true };
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input.trim();
}

export async function register(data: RegisterData): Promise<AuthResult<{ id: string; username: string; email: string; createdAt: Date }>> {
  try {
    // Sanitize inputs
    const username = sanitizeInput(data.username);
    const email = sanitizeInput(data.email).toLowerCase();
    
    // Validate all required fields
    if (!username || !email || !data.password || !data.confirmPassword) {
      return { success: false, error: "All fields are required" };
    }
    
    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return { success: false, error: usernameValidation.error };
    }
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { success: false, error: emailValidation.error };
    }
    
    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }
    
    // Check password match
    if (data.password !== data.confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }
    
    // Validate captcha
    const captchaValidation = validateCaptcha(data.captchaAnswer, data.captchaExpected);
    if (!captchaValidation.valid) {
      return { success: false, error: captchaValidation.error };
    }
    
    // Check terms agreement
    if (!data.agreeToTerms) {
      return { success: false, error: "You must agree to the Terms of Service" };
    }
    
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    
    if (existingUsername) {
      return { success: false, error: "Username already exists. Please choose a different username." };
    }
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    
    if (existingEmail) {
      return { success: false, error: "Email already registered. Please use a different email or sign in." };
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
    
    return { success: true, data: user };
  } catch (error) {
    // Handle Prisma unique constraint errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        const target = (error as { meta?: { target?: string[] } }).meta?.target?.[0];
        if (target === "username") {
          return { success: false, error: "Username already exists. Please choose a different username." };
        }
        if (target === "email") {
          return { success: false, error: "Email already registered. Please use a different email or sign in." };
        }
      }
    }
    
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account. Please try again later." };
  }
}

export async function login(data: LoginData): Promise<AuthResult<{ id: string; username: string; email: string }>> {
  try {
    // Sanitize inputs
    const username = sanitizeInput(data.username);
    
    // Validate inputs
    if (!username || !data.password) {
      return { success: false, error: "Username and password are required" };
    }
    
    // Validate captcha
    const captchaValidation = validateCaptcha(data.captchaAnswer, data.captchaExpected);
    if (!captchaValidation.valid) {
      return { success: false, error: captchaValidation.error };
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
      return { success: false, error: "Invalid username or password" };
    }
    
    // Verify password
    const passwordValid = await compare(data.password, user.password);
    if (!passwordValid) {
      return { success: false, error: "Invalid username or password" };
    }
    
    // Create session
    await createSession(user.id);
    
    // Return user data (without password)
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login. Please try again later." };
  }
}

export async function logout(): Promise<AuthResult> {
  try {
    await deleteSession();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Failed to logout" };
  }
}
