import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { ROUTES } from "@/lib/utils/constants";
import { UserNav } from "@/components/nav/user-nav";
import { ModeToggle } from "@/components/nav/mode-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export async function TopNav() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          {session ? (
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full h-auto max-h-[80vh] overflow-y-auto rounded-b-3xl border-b border-white/10 bg-background/95 backdrop-blur-xl pt-16 pb-10">
                  <SheetHeader className="px-4">
                    <SheetTitle className="text-left text-lg font-bold">Menu</SheetTitle>
                    <SheetDescription className="text-left">
                      Navigate through the application
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6 px-4">
                    <SheetClose asChild>
                      <Link
                        href={ROUTES.DASHBOARD}
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/shop"
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Shop
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/user/cart"
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Cart
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/user/orders"
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Orders
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/user/wallet"
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Wallet
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/user/tickets"
                        className="flex items-center py-3 text-base font-medium text-foreground hover:text-primary transition-colors border-b border-border/50"
                      >
                        Support
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : null}

          <Link
            href={session ? ROUTES.DASHBOARD : "/"}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary hover:opacity-90 transition-opacity"
          >
            {/* Optional: Add a logo icon here if available */}
            Kubera
          </Link>

          {session ? (
            <div className="hidden md:flex items-center gap-1 bg-background/50 p-1 rounded-full border border-white/5 backdrop-blur-sm">
              <Link
                href="/shop"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/10 px-4 py-1.5 rounded-full transition-all"
              >
                Shop
              </Link>
              <Link
                href="/user/cart"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/10 px-4 py-1.5 rounded-full transition-all"
              >
                Cart
              </Link>
              <Link
                href="/user/orders"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/10 px-4 py-1.5 rounded-full transition-all"
              >
                Orders
              </Link>
              <Link
                href="/user/wallet"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/10 px-4 py-1.5 rounded-full transition-all"
              >
                Wallet
              </Link>
              <Link
                href="/user/tickets"
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/10 px-4 py-1.5 rounded-full transition-all"
              >
                Support
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {session ? <NotificationBell /> : null}
          <ModeToggle />

          {session ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium rounded-full bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-all"
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

