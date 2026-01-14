import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWallet } from "@/lib/actions/wallet";
import { GenerateWalletButton } from "./generate-wallet-button";
import { WalletAddressDisplay } from "./wallet-address-display";
import { HowToTopUp } from "./how-to-top-up";

export default async function WalletPage() {
  const result = await getWallet();
  const wallet = result.success && result.data ? result.data : null;

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Manage your account balance and top up funds</p>
        </div>

        {/* Current Balance Card */}
        <Card className="mb-6">
          <CardContent className="p-10 flex flex-col items-center">
            <div className="mb-4">
              <svg width="48" height="48" fill="none" className="text-primary">
                <rect width="48" height="48" rx="12" fill="var(--card)" />
                <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-lg mb-2">Current Balance</span>
            <span className="text-3xl font-bold text-primary">
              ${wallet ? wallet.balance.toFixed(2) : "0.00"}
            </span>
          </CardContent>
        </Card>

        {/* Top Up Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {wallet?.address ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 dark:bg-emerald-500/20">
                    Wallet Active
                  </Badge>
                </div>
                <WalletAddressDisplay address={wallet.address} />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1">
                    Wallet Setup Required
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-foreground">Top Up Your Balance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a wallet address to start receiving payments.
                    </p>
                    <GenerateWalletButton />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* How to Top Up Instructions */}
        {wallet?.address && (
          <Card>
            <CardContent className="p-6">
              <HowToTopUp />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
