import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, AlertCircle } from "lucide-react";
import { getCart } from "@/lib/actions/cart";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CartTable } from "./cart-table";
import { CartPageClient } from "./cart-page-client";

export default async function CartPage() {
  const [cartResult, statsResult] = await Promise.all([
    getCart(),
    getDashboardStats(),
  ]);

  const cartItems = cartResult.success && cartResult.data ? cartResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    availableFunds: 0,
    totalCompleted: 0,
    awaitingProcessing: 0,
  };

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasInsufficientBalance = stats.availableFunds < total;

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground text-lg font-light max-w-lg">
              Review your items and proceed to secure checkout.
            </p>
          </div>

          {/* Balance Display */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Available Balance</span>
              <span className="text-xl font-bold text-primary font-mono">${stats.availableFunds.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5 animate-in fade-in duration-500">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6 ring-8 ring-primary/5">
              <ShoppingCart className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-sm text-center font-light">
              Looks like you haven't added any items yet. Explore our marketplace to find what you need.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full h-12 px-8 font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              <a href="/user/dashboard">
                Start Shopping
              </a>
            </Button>
          </div>
        ) : (
          <CartPageClient
            initialCartItems={cartItems}
            availableFunds={stats.availableFunds}
            total={total}
            hasInsufficientBalance={hasInsufficientBalance}
          />
        )}
      </div>
    </main>
  );
}
