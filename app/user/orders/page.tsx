import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getOrders } from "@/lib/actions/orders";
import { OrdersList } from "./orders-list";

export default async function OrdersPage() {
  const result = await getOrders();
  const orders = result.success && result.data ? result.data : [];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-2xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
        <p className="mb-8 text-muted-foreground">Track and manage your order history</p>
        {orders.length === 0 ? (
          <Card className="p-12 flex flex-col items-center w-full">
            <CardContent className="flex flex-col items-center">
              <svg width="48" height="48" fill="none" className="mb-4 text-primary"><rect width="48" height="48" rx="12" fill="var(--card)"/><path d="M16 24h16M16 28h16M16 20h16" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/></svg>
              <span className="text-xl font-semibold mb-2">No orders yet</span>
              <span className="mb-4 text-muted-foreground">{"You haven't placed any orders yet. Start shopping!"}</span>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 rounded-full shadow transition-transform duration-150 active:scale-95">
                <a href="/shop">
                  <ShoppingCart className="w-4 h-4" />
                  Start Shopping
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </main>
  );
}
