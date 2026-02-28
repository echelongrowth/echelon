import Link from "next/link";
import type { ReactNode } from "react";

export function ProGate({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)] p-6 sm:p-8">
      <div className="pointer-events-none opacity-65 blur-[2px]">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border border-[color-mix(in_oklab,var(--db-accent)_45%,transparent)] bg-[var(--db-surface)]/95 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-[var(--db-text)]">{title}</p>
          <p className="mt-1 text-xs text-[var(--db-muted)]">
            Available on Pro plan.
          </p>
          <Link
            className="apple-primary-btn mt-3 inline-flex h-9 items-center justify-center rounded-full px-3 text-xs font-medium"
            href="/pricing"
          >
            Unlock Full Intelligence
          </Link>
        </div>
      </div>
    </section>
  );
}
