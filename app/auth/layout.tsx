import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_480px] lg:items-center">
          <section className="hidden lg:block fade-in-soft">
            <p className="label-micro">Career Intelligence System</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-slate-100">
              Strategic Clarity For High-Agency Professionals.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Access the operating layer for leverage diagnostics, risk control,
              and structured execution planning.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Structured assessment and intelligence workflow",
                "Tiered strategic visibility for Free and Pro",
                "Enterprise-grade command interface",
              ].map((item) => (
                <div
                  className="l2-surface rounded-xl px-4 py-3 text-sm text-slate-200"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
          {children}
        </div>
      </div>
    </main>
  );
}
