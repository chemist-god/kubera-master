import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/user";
import { getWallet } from "@/lib/actions/wallet";
import { LogoutButton } from "./logout-button";

export async function UserNav() {
  const [userResult, walletResult] = await Promise.all([
    getCurrentUser(),
    getWallet(),
  ]);

  const username = userResult.success && userResult.data
    ? userResult.data.username
    : "User";
  const walletBalance = walletResult.success && walletResult.data
    ? walletResult.data.balance
    : 0;

  // Use username initials for the fallback avatar
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* Wallet Pill - only visible on tablet+ to save space on mobile, or keep if critical */}
      <span className="hidden sm:inline-flex bg-primary/10 text-primary px-3 py-1.5 rounded-full font-mono font-semibold text-xs border border-primary/20 backdrop-blur-sm">
        ${walletBalance.toFixed(2)}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none group relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/50 transition-all hover:border-primary/50 hover:shadow-md focus:ring-2 focus:ring-primary/20">
            <div className="flex h-full w-full items-center justify-center bg-muted/50 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
              <span className="font-semibold text-sm">{initials}</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-xl border border-white/10 bg-background/90 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none text-foreground">{username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* Could add email here if available */}
              Account
            </p>
          </div>

          {/* Mobile only wallet display in dropdown */}
          <div className="sm:hidden p-2 bg-muted/30 rounded-lg mb-2 mx-1 flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Balance</span>
            <span className="font-mono font-bold text-primary">${walletBalance.toFixed(2)}</span>
          </div>

          <DropdownMenuSeparator className="bg-border/50 my-1" />

          <DropdownMenuItem asChild className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer mb-1">
            <a href="/user/profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/50 my-1" />
          <DropdownMenuItem asChild className="rounded-lg focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

