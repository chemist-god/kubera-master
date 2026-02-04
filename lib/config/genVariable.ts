/**
 * Centralized Application Configuration
 * 
 * This file contains all dynamic application-wide variables.
 * Change values here to automatically update throughout the application.
 */

export const genVariable = {
  // Version Information
  version: {
    app: "0.9.1", // Semantic versioning (MAJOR.MINOR.PATCH)
    lastUpdated: "2026-01-31", // Date of last major update
  },

  // Application Identity
  app: {
    name: "Klassico",
    displayName: "Klassico",
    description: "Your trusted platform for secure digital banking solutions",
    cookiePrefix: "Klassico_",
  },

  // Contact Information
  contact: {
    email: "support@klassico.com",
    phone: "1-800-KLASSICO-0",
    website: "https://klassico.vercel.app/",
    supportUrl: "/user/tickets",
    hours: "Available 24/7",
  },

  // Business Address
  address: {
    street: "123 Business Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },

  // Time Durations (in seconds)
  timeouts: {
    sessionMaxAge: 60 * 60 * 24 * 7,      // 7 days
    captchaMaxAge: 60 * 5,                 // 5 minutes
    cartTimerMinutes: 10,                  // 10 minutes
    cartTimerSeconds: 10 * 60,             // 10 minutes in seconds
    walletRegenerationHours: 24,           // 24 hours
    warrantyHours: 24,                     // 24 hours
  },

  // Polling & UI Intervals (in milliseconds)
  intervals: {
    bankLogsPolling: 4000,                 // 4 seconds
    defaultTimeout: 5000,                  // 5 seconds
    toastDuration: 3000,                   // 3 seconds
  },

  // Pagination & Limits
  limits: {
    itemsPerPage: 6,
    notificationsLimit: 10,
    usernameMin: 3,
    usernameMax: 20,
    passwordMin: 8,
  },

  // Financial Settings
  financial: {
    defaultTaxRate: 0.00,                  // 0%
    receiptPrefix: "RCP",
    invoicePrefix: "INV",
  },

  // Cookie Names
  cookies: {
    session: "klassico_session",
    captcha: "klassico_captcha",
  },

  // Storage Keys
  storage: {
    cartTimerPrefix: "cart_timer_",
  },

  // CAPTCHA Configuration
  captcha: {
    multiplyRange: { min: 1, max: 10 },
    subtractMin: 20,
    subtractMax: 50,
    addRange: { min: 1, max: 50 },
  },

  // Order Protection & Rate Limiting
  orderLimits: {
    maxOrdersPerHour: 5,                   // Max orders user can create per hour
    maxPendingOrders: 5,                   // Max pending orders before blocking
    pendingOrderWarningThreshold: 3,       // Show warning at this count
    autoCleanupAfterHours: 24,             // Auto-cancel old orders after X hours
    rateLimitWindowMinutes: 60,            // Rate limit window in minutes
    paymentExpiryMinutes: 30,              // Payment window expires after X minutes
  },

  // Assets
  assets: {
    logoUrl: "/logo.png",
    logoPrintUrl: "/logo-print.png",
  },

  // Policy Texts
  policies: {
    returnPolicy: "Digital products are final sale. All sales are final once delivery is completed. Please review your order carefully before completing purchase.",
    warranty: "All accounts are guaranteed to be as described. If there are any discrepancies, contact support within 24 hours of purchase for resolution.",
    legal: "By completing this purchase, you agree to our Terms of Service and Privacy Policy. All transactions are securely processed.",
    thankYou: "Thank you for choosing Klassico. We appreciate your business and trust in our platform.",
    additionalNotes: "Please keep this receipt for your records. For any questions or concerns, contact our support team.",
  },
} as const;

// Export type for type safety
export type GenVariable = typeof genVariable;
