import Link from "next/link";

export function UpgradeGate() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Pro Feature
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
        Resume Positioning Intelligence
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
        This module is available on Pro plan only. Upgrade to unlock structured
        executive positioning diagnostics and strategic rewrite recommendations.
      </p>
      <Link
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_26px_rgba(79,140,255,0.35)]"
        href="/pricing"
      >
        Upgrade to Pro
      </Link>
    </section>
  );
}

