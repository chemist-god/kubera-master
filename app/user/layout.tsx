import "../globals.css";
import { UserNav } from "@/components/nav/user-nav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-stone-950 shadow-lg">
        <div className="flex items-center gap-4">
          <a href="/user/dashboard" className="text-2xl font-bold tracking-tight text-primary">Kubera</a>
          <a href="/shop" className="ml-6 text-foreground hover:text-primary transition">Shop</a>
          <a href="/user/cart" className="ml-4 text-foreground hover:text-primary transition">View Cart</a>
          <a href="/user/orders" className="ml-4 text-foreground hover:text-primary transition">My Orders</a>
          <a href="/user/wallet" className="ml-4 text-foreground hover:text-primary transition">Wallet</a>
          <a href="/user/tickets" className="ml-4 text-foreground hover:text-primary transition">Support</a>
        </div>
        <UserNav />
      </nav>
      <div>{children}</div>
    </div>
  );
}
