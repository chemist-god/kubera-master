/**
 * Application constants
 */

import { genVariable } from "@/lib/config/genVariable";

// Session configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: genVariable.cookies.session,
  MAX_AGE: genVariable.timeouts.sessionMaxAge,
} as const;

// Route configurations
export const ROUTES = {
  PROTECTED: ["/user", "/shop"],
  AUTH: ["/login", "/register"],
  DASHBOARD: "/user/dashboard",
  LOGIN: "/login",
} as const;

