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

  return (
    <div className="flex items-center gap-4">
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
        ${walletBalance.toFixed(2)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-muted hover:bg-muted/80 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
            <User className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 mt-2">
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Signed in as<br />
            <span className="font-semibold text-foreground">{username}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/user/profile">Profile Settings</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

