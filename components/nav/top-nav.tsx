import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { ROUTES } from "@/lib/utils/constants";
import { UserNav } from "@/components/nav/user-nav";
import { ModeToggle } from "@/components/nav/mode-toggle";

export async function TopNav() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href={session ? ROUTES.DASHBOARD : "/"}
            className="text-xl font-bold tracking-tight text-primary"
          >
            Kubera
          </Link>

          {session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/shop"
                className="text-sm text-foreground hover:text-primary transition"
              >
                Shop
              </Link>
              <Link
                href="/user/cart"
                className="text-sm text-foreground hover:text-primary transition"
              >
                Cart
              </Link>
              <Link
                href="/user/orders"
                className="text-sm text-foreground hover:text-primary transition"
              >
                Orders
              </Link>
              <Link
                href="/user/wallet"
                className="text-sm text-foreground hover:text-primary transition"
              >
                Wallet
              </Link>
              <Link
                href="/user/tickets"
                className="text-sm text-foreground hover:text-primary transition"
              >
                Support
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {session ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm text-foreground hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm rounded-full bg-primary text-primary-foreground px-3 py-1.5 hover:opacity-90 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

