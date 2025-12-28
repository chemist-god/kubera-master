import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getBankLogs } from "@/lib/actions/dashboard";
import { AddToCartButton } from "@/app/shop/add-to-cart-button";

export default async function DashboardPage() {
  const [statsResult, bankLogsResult] = await Promise.all([
    getDashboardStats(),
    getBankLogs(),
  ]);

  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    availableFunds: 0,
    totalCompleted: 0,
    awaitingProcessing: 0,
  };
  const bankLogs = bankLogsResult.success && bankLogsResult.data ? bankLogsResult.data : [];
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-2">Welcome, User!</h1>
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
          <h2 className="text-2xl font-semibold mb-4">Available Bank Logs</h2>
          <div className="overflow-x-auto rounded-xl shadow bg-card">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-stone-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Bank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Region</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bankLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No bank logs available
                    </td>
                  </tr>
                ) : (
                  bankLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-900/60 transition">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="rounded-full px-2 py-1 text-xs font-semibold bg-primary/10 text-primary">CH</Badge>
                          <div>
                            <div className="font-semibold text-sm">{log.product}</div>
                            <div className="text-xs text-muted-foreground">{log.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-sm text-muted-foreground">{log.description}</td>
                      <td className="px-4 py-3 text-sm">{log.bank}</td>
                      <td className="px-4 py-3 text-primary font-bold">${log.balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground font-semibold">${log.price}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{log.region}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 bg-green-700/20 text-green-400">{log.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <AddToCartButton productId={log.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
