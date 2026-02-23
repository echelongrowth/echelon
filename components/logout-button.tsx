"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
    setIsLoading(false);
  }

  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/50 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
      disabled={isLoading}
      onClick={handleLogout}
      type="button"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
