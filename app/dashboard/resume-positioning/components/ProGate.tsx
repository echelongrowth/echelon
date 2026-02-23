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
    <section className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/60 p-8">
      <div className="pointer-events-none opacity-65 blur-[2px]">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border border-indigo-300/35 bg-slate-900/92 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="mt-1 text-xs text-slate-400">
            Available on Pro plan.
          </p>
          <Link
            className="mt-3 inline-flex h-9 items-center justify-center rounded-xl border border-indigo-300/25 bg-indigo-400/20 px-3 text-xs font-medium text-indigo-100 transition-all duration-150 ease-out hover:border-indigo-200/45 hover:bg-indigo-400/28"
            href="/pricing"
          >
            Unlock Full Intelligence
          </Link>
        </div>
      </div>
    </section>
  );
}
