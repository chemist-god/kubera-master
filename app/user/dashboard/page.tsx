import { getDashboardStats } from "@/lib/actions/dashboard";
import { getCurrentUser } from "@/lib/actions/user";
import { getCart } from "@/lib/actions/cart";
import { BankLogsTable } from "./bank-logs-table";
import { getBankLogs } from "@/lib/data/bank-logs";
import * as motion from "framer-motion/client";

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
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Welcome back, {username}
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Overview of your account and available logs.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Available Funds"
            value={`$${stats.availableFunds.toFixed(2)}`}
            delay={0.1}
            highlight
          />
          <StatCard
            title="Total Completed"
            value={stats.totalCompleted}
            delay={0.2}
          />
          <StatCard
            title="Awaiting Processing"
            value={stats.awaitingProcessing}
            delay={0.3}
          />
        </div>

        {/* content Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Available Bank Logs</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Updates
            </div>
          </div>

          <div className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <BankLogsTable initialData={initialBankLogs} cartProductIds={cartProductIds} />
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function StatCard({ title, value, delay, highlight = false }: { title: string, value: string | number, delay: number, highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`
        relative p-8 rounded-2xl flex flex-col justify-between h-40 transition-all duration-300 hover:shadow-lg group
        ${highlight
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-card border hover:border-sidebar-primary/50 text-card-foreground"
        }
      `}
    >
      <span className={`text-sm font-medium tracking-wide ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {title}
      </span>
      <span className="text-4xl font-bold tracking-tight mt-2">{value}</span>
      {highlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      )}
    </motion.div>
  );
}
