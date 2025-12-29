"use client";

import { logout } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/utils/constants";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const result = await logout();
    if (result.success) {
      router.push(ROUTES.LOGIN);
      router.refresh();
    }
  }

  return (
    <button onClick={handleLogout} className="w-full text-left">
      Logout
    </button>
  );
}

