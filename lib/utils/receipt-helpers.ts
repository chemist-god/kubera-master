/**
 * Receipt Helper Utilities
 * Functions for generating receipt numbers, transaction IDs, and formatting receipt data
 */

/**
 * Generate unique receipt number
 * Format: RCP-202601-12345
 */
export function generateReceiptNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `RCP-${year}${month}-${random}`;
}

/**
 * Generate unique transaction ID
 * Format: TXN-1738123456789-ABC123XYZ
 */
export function generateTransactionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `TXN-${timestamp}-${random}`;
}

/**
 * Calculate tax amount
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return Number((subtotal * taxRate).toFixed(2));
}

/**
 * Calculate order totals with tax
 */
export function calculateOrderTotals(subtotal: number, taxRate: number = 0) {
  const taxAmount = calculateTax(subtotal, taxRate);
  const total = subtotal + taxAmount;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount,
    taxRate,
    total: Number(total.toFixed(2))
  };
}

/**
 * Format currency with proper USD formatting
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date for receipt display
 */
export function formatReceiptDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}
