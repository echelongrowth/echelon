import Link from "next/link";

export function UpgradeGate() {
  return (
    <section className="l1-surface rounded-xl p-8">
      <p className="label-micro">
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
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-indigo-300/25 bg-indigo-400/20 px-5 text-sm font-medium text-indigo-100 transition-all duration-200 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28"
        href="/pricing"
      >
        Upgrade to Pro
      </Link>
    </section>
  );
}
