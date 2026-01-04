import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { getCurrentUser } from "@/lib/actions/user";
import { getCart } from "@/lib/actions/cart";
import { BankLogsTable } from "./bank-logs-table";
import { getBankLogs } from "@/lib/data/bank-logs";

export default async function DashboardPage() {
  const [statsResult, userResult, cartResult] = await Promise.all([
    getDashboardStats(),
    getCurrentUser(),
    getCart(),
  ]);

  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    availableFunds: 0,
    totalCompleted: 0,
    awaitingProcessing: 0,
  };
  const username = userResult.success && userResult.data ? userResult.data.username : "User";

  // Get cart items to check which products are already in cart
  const cartItems = cartResult.success && cartResult.data ? cartResult.data : [];
  // Create a Set of product IDs that are in the cart for quick lookup
  const cartProductIds = new Set(cartItems.map((item) => item.productId));

  // Get initial bank logs data for SSR
  const initialBankLogs = getBankLogs();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, {username}!</h1>
        <p className="text-muted-foreground mb-8">Happy Shopping</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Available funds</span>
                <span className="text-3xl font-bold text-primary">${stats.availableFunds.toFixed(2)}</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Total completed</span>
                <span className="text-3xl font-bold">{stats.totalCompleted}</span>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-linear-to-br from-stone-950 to-stone-900 border-none flex items-center justify-center">
            <CardHeader className="w-full flex items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-base font-medium text-muted-foreground">Awaiting processing</span>
                <span className="text-3xl font-bold">{stats.awaitingProcessing}</span>
              </div>
            </CardHeader>
          </Card>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span>Available Bank Logs</span>
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </h2>
          <BankLogsTable initialData={initialBankLogs} cartProductIds={cartProductIds} />
        </section>
      </div>
    </main>
  );
}
