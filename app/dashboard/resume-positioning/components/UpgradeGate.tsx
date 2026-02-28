import Link from "next/link";

export function UpgradeGate() {
  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <p className="apple-label">
        Pro Feature
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--db-text)]">
        Resume Positioning Intelligence
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--db-muted)]">
        This module is available on Pro plan only. Upgrade to unlock structured
        executive positioning diagnostics and strategic rewrite recommendations.
      </p>
      <Link
        className="apple-primary-btn mt-6 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium"
        href="/pricing"
      >
        Upgrade to Pro
      </Link>
    </section>
  );
}
