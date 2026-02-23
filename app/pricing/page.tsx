"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const freeFeatures = [
  "Career Leverage Score",
  "Risk Exposure Score",
  "Limited Market Positioning Summary",
  "Limited Strategic Gaps",
  "Limited 30-Day Roadmap",
];

const proFeatures = [
  "Full Intelligence Report",
  "Full 30 & 90-Day Strategic Plan",
  "Resume Positioning Insights",
  "Skill Monetization Strategy",
  "Side Project Leverage Ideas",
  "Execution Tracking",
  "Priority AI Generation",
];

const faqItems = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can switch or cancel your subscription anytime from your account settings.",
  },
  {
    question: "How is this different from coaching?",
    answer:
      "Echelon provides a repeatable intelligence system with structured diagnostics and strategic recommendations, not ad-hoc advice sessions.",
  },
  {
    question: "Who is this for?",
    answer:
      "Ambitious mid-career professionals who want market-aware career strategy, measurable leverage, and execution discipline.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data is scoped to your account with secure authentication and row-level access controls.",
  },
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const proPrice =
    billingCycle === "monthly"
      ? { amount: "$29", interval: "/month" }
      : { amount: "$249", interval: "/year" };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-20 top-72 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <section className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Pricing
          </p>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            Own Your Career Leverage.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Structured intelligence. Strategic clarity. Market advantage.
          </p>
        </section>

        <section className="mt-10 flex justify-center">
          <div className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1 shadow-xl backdrop-blur-sm">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                billingCycle === "monthly"
                  ? "bg-white/10 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setBillingCycle("monthly")}
              type="button"
            >
              Monthly
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                billingCycle === "annual"
                  ? "bg-white/10 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setBillingCycle("annual")}
              type="button"
            >
              Annual
            </button>
            <span className="ml-2 rounded-md border border-violet-400/30 bg-violet-500/15 px-2 py-1 text-xs font-medium text-violet-200">
              Save 25%
            </span>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Free Plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Free</h2>
            <p className="mt-3 text-5xl font-semibold tracking-tight">$0</p>
            <p className="mt-2 text-sm text-slate-400">No credit card required.</p>

            <FeatureList items={freeFeatures} />

            <button
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#4F8CFF]/50 hover:shadow-[0_0_24px_rgba(79,140,255,0.2)]"
              onClick={() => router.push("/auth/signup?plan=free")}
              type="button"
            >
              Start Free
            </button>
          </article>

          <article className="relative scale-[1.01] rounded-2xl border border-violet-400/40 bg-white/5 p-8 shadow-xl shadow-violet-500/15 backdrop-blur-sm transition-all duration-200 ease-in-out hover:scale-[1.02]">
            <div className="absolute -top-3 left-8 rounded-full border border-violet-400/40 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
              Most Popular
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Pro Plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Pro</h2>
            <div className="mt-3 flex items-end gap-1">
              <p className="bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
                {proPrice.amount}
              </p>
              <p className="mb-1 text-sm text-slate-400">{proPrice.interval}</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Full strategic intelligence operating system.
            </p>

            <FeatureList items={proFeatures} />

            <button
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-4 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_28px_rgba(79,140,255,0.35)]"
              onClick={() => router.push("/auth/signup?plan=pro")}
              type="button"
            >
              Upgrade to Pro
            </button>
          </article>
        </section>

        <section className="mt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Strategic Value
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold">Increase Career Leverage</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Quantify your upside drivers and focus on high-yield positioning
                moves with the strongest strategic return.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold">Reduce Structural Risk</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Surface exposure early and execute targeted mitigation before
                market shifts affect trajectory.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold">Build Asymmetric Upside</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Align skills, narrative, and execution into a compounding strategy
                with favorable downside protection.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-14">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            FAQ
          </p>
          <div className="mx-auto mt-6 max-w-4xl space-y-4">
            {faqItems.map((item) => (
              <article
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm"
                key={item.question}
              >
                <h3 className="text-base font-semibold text-slate-100">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
