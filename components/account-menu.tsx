"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function AccountMenu() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
    setIsLoggingOut(false);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-500/40 bg-slate-800/45 text-slate-100 transition-all duration-200 ease-out hover:border-slate-400/65 hover:bg-slate-700/45"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <svg
          aria-hidden
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-14 z-30 w-44 rounded-xl border border-slate-600/55 bg-slate-900/95 p-2 shadow-xl backdrop-blur-md">
          <Link
            className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors duration-200 hover:bg-white/10"
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <button
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
