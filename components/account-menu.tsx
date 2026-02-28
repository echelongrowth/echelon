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
        className="apple-ghost-btn inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--db-text)]"
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
        <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/95 p-2 shadow-[var(--db-shadow)] backdrop-blur-md">
          <Link
            className="block rounded-xl px-3 py-2 text-sm text-[var(--db-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--db-accent)_10%,transparent)]"
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <button
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--db-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--db-accent)_10%,transparent)] disabled:cursor-not-allowed disabled:opacity-70"
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
