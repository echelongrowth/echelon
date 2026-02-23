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
      "Yes. Subscription can be changed or canceled from account settings.",
  },
  {
    question: "How is this different from coaching?",
    answer:
      "Echelon provides a structured strategic intelligence system with repeatable diagnostics and execution frameworks.",
  },
  {
    question: "Who is this for?",
    answer:
      "Ambitious mid-career professionals seeking measurable leverage and reduced market risk.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Access is protected through authenticated sessions and row-level controls.",
  },
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          className="l2-surface rounded-xl px-4 py-3 text-sm text-slate-200"
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
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14">
        <section className="section-shell rounded-2xl p-8 text-center lg:p-10">
          <p className="label-micro">Pricing</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Strategic Intelligence Investment
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Structured intelligence, strategic clarity, and measurable market advantage.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="l2-surface inline-flex items-center rounded-xl p-1.5">
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  billingCycle === "monthly"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                onClick={() => setBillingCycle("monthly")}
                type="button"
              >
                Monthly
              </button>
              <button
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  billingCycle === "annual"
                    ? "bg-slate-800/80 text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                onClick={() => setBillingCycle("annual")}
                type="button"
              >
                Annual
              </button>
              <span className="ml-2 rounded-md border border-indigo-300/30 bg-indigo-400/15 px-2 py-1 text-xs font-medium text-indigo-200">
                Save 25%
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <article className="section-shell rounded-2xl p-8">
            <p className="label-micro">Free Plan</p>
            <h2 className="mt-3 text-3xl font-semibold">Free</h2>
            <p className="mt-2 text-5xl font-semibold tracking-tight">$0</p>
            <p className="mt-2 text-sm text-slate-400">No credit card required.</p>
            <FeatureList items={freeFeatures} />
            <button
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-600/65 bg-slate-900/55 px-4 text-sm font-medium text-slate-100 transition duration-200 ease-out hover:border-slate-400/70 hover:bg-slate-800/60"
              onClick={() => router.push("/auth/signup?plan=free")}
              type="button"
            >
              Start Free
            </button>
          </article>

          <article className="section-shell rounded-2xl border-indigo-300/40 p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="label-micro">Pro Plan</p>
              <span className="rounded-full border border-indigo-300/35 bg-indigo-400/15 px-3 py-1 text-xs font-semibold text-indigo-200">
                Most Popular
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold">Pro</h2>
            <div className="mt-2 flex items-end gap-1">
              <p className="text-5xl font-semibold tracking-tight text-slate-100">
                {proPrice.amount}
              </p>
              <p className="mb-1 text-sm text-slate-400">{proPrice.interval}</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Full strategic intelligence operating system.
            </p>
            <FeatureList items={proFeatures} />
            <button
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl border border-indigo-300/35 bg-indigo-400/20 px-4 text-sm font-medium text-indigo-100 transition duration-200 ease-out hover:border-indigo-200/50 hover:bg-indigo-400/30"
              onClick={() => router.push("/auth/signup?plan=pro")}
              type="button"
            >
              Upgrade to Pro
            </button>
          </article>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Increase Career Leverage",
              body: "Focus on high-return strategic moves based on quantified positioning signals.",
            },
            {
              title: "Reduce Structural Risk",
              body: "Surface exposure early and execute mitigation before market shifts escalate.",
            },
            {
              title: "Build Asymmetric Upside",
              body: "Align narrative, skills, and execution toward favorable optionality outcomes.",
            },
          ].map((item) => (
            <article className="section-shell rounded-2xl p-6" key={item.title}>
              <h3 className="text-xl font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 section-shell rounded-2xl p-8">
          <p className="label-micro text-center">FAQ</p>
          <div className="mx-auto mt-6 max-w-4xl space-y-4">
            {faqItems.map((item) => (
              <article className="l2-surface rounded-xl p-5" key={item.question}>
                <h3 className="text-base font-semibold text-slate-100">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
