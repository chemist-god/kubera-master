// API Response types - Re-export ActionResult for consistency
export type { ActionResult as ApiResponse } from "@/lib/utils/result";

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  balance: number;
  status: string;
  region: string;
  bank: string;
  type: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

// Order types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  receiptNumber?: string | null;
  transactionId?: string | null;
  subtotal?: number | null;
  taxAmount: number;
  taxRate: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  transaction?: Transaction | null;
  user?: UserInfo | null;
}

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  type: string;
  method: string;
  status: string;
  reference?: string | null;
  metadata?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// User info types (for receipts)
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  createdAt: Date;
}

// Ticket types
export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard types
export interface DashboardStats {
  availableFunds: number;
  totalCompleted: number;
  awaitingProcessing: number;
}

export interface BankLog {
  id: string;
  product: string;
  type: string;
  bank: string;
  balance: number;
  price: number;
  region: string;
  status: string;
  description: string;
}

