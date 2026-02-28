"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  FadeInSection,
  GhostButton,
  PricingCard,
  PrimaryButton,
  SectionContainer,
  SurfaceCard,
} from "@/components/ui/primitives";

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
        <li className="flex items-start gap-2 text-sm text-[var(--app-muted)]" key={item}>
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#5b8cff]" />
          <span>{item}</span>
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const proPrice =
    billingCycle === "monthly"
      ? { amount: "$29", interval: "/month" }
      : { amount: "$249", interval: "/year" };

  return (
    <main className="min-h-screen text-[var(--app-text)]">
      <SectionContainer className="py-10 md:py-14">
        <div className="mb-6 flex h-16 items-center justify-between px-4 md:h-[72px] md:px-6">
          <Link className="inline-flex items-center" href="/">
            <BrandLogo
              className="h-9 w-[168px] md:h-11 md:w-[216px]"
              priority
              size="md"
              variant="full"
            />
          </Link>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--app-border)] px-4 text-sm font-medium text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff0a]"
            href="/"
          >
            Back to Home
          </Link>
        </div>
        <FadeInSection>
          <SurfaceCard className="p-7 text-center md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Pricing
            </p>
            <h1 className="mt-4 text-[30px] font-semibold tracking-tight md:text-[44px]">
              Strategic Intelligence Investment
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--app-muted)] md:text-base">
              Structured intelligence, strategic clarity, and measurable market advantage.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center rounded-full border border-[var(--app-border)] bg-[#ffffff05] p-1.5">
                <button
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    billingCycle === "monthly"
                      ? "bg-[#ffffff10] text-[var(--app-text)]"
                      : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  }`}
                  onClick={() => setBillingCycle("monthly")}
                  type="button"
                >
                  Monthly
                </button>
                <button
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    billingCycle === "annual"
                      ? "bg-[#ffffff10] text-[var(--app-text)]"
                      : "text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  }`}
                  onClick={() => setBillingCycle("annual")}
                  type="button"
                >
                  Annual
                </button>
                <span className="ml-2 rounded-full bg-[#5b8cff22] px-2.5 py-1 text-xs font-medium text-[#8fb3ff]">
                  Save 25%
                </span>
              </div>
            </div>
          </SurfaceCard>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-10">
        <FadeInSection className="grid gap-5 lg:grid-cols-2">
          <PricingCard>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
              Free Plan
            </p>
            <h2 className="mt-3 text-[24px] font-semibold">Free</h2>
            <p className="mt-2 text-5xl font-light tracking-tight">$0</p>
            <p className="mt-2 text-sm text-[var(--app-muted)]">No credit card required.</p>
            <FeatureList items={freeFeatures} />
            <button
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[var(--app-border)] text-sm font-medium text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff08]"
              onClick={() => router.push("/auth/signup?plan=free")}
              type="button"
            >
              Start Free
            </button>
          </PricingCard>

          <PricingCard highlighted>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
                Pro Plan
              </p>
              <span className="rounded-full bg-[#5b8cff22] px-3 py-1 text-xs font-semibold text-[#8fb3ff]">
                Most Popular
              </span>
            </div>
            <h2 className="mt-3 text-[24px] font-semibold">Pro</h2>
            <div className="mt-2 flex items-end gap-1">
              <p className="text-5xl font-light tracking-tight">{proPrice.amount}</p>
              <p className="mb-1 text-sm text-[var(--app-muted)]">{proPrice.interval}</p>
            </div>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Full strategic intelligence operating system.
            </p>
            <FeatureList items={proFeatures} />
            <button
              className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#5b8cff55] bg-[#5b8cff1f] text-sm font-medium text-[#b8ceff] transition-all duration-200 hover:-translate-y-[1px] hover:brightness-110"
              onClick={() => router.push("/auth/signup?plan=pro")}
              type="button"
            >
              Upgrade to Pro
            </button>
          </PricingCard>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-10">
        <FadeInSection className="grid gap-4 md:grid-cols-3">
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
            <SurfaceCard className="p-6" key={item.title}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--app-muted)]">{item.body}</p>
            </SurfaceCard>
          ))}
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-14">
        <FadeInSection>
          <SurfaceCard className="p-6 md:p-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              FAQ
            </p>
            <div className="mx-auto mt-6 max-w-4xl space-y-3">
              {faqItems.map((item, idx) => {
                const open = openFaq === idx;
                return (
                  <div className="rounded-2xl border border-[var(--app-border)] bg-[#ffffff05]" key={item.question}>
                    <button
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-5"
                      onClick={() => setOpenFaq(open ? null : idx)}
                      type="button"
                    >
                      <span className="text-sm font-medium text-[var(--app-text)]">{item.question}</span>
                      <span className="text-xs text-[var(--app-muted)]">{open ? "−" : "+"}</span>
                    </button>
                    <motion.div
                      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                      className="overflow-hidden"
                      initial={false}
                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="px-4 pb-4 text-sm leading-7 text-[var(--app-muted)] md:px-5">
                        {item.answer}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <GhostButton className="rounded-full px-5" onClick={() => router.push("/")}>
                Back Home
              </GhostButton>
              <PrimaryButton className="rounded-full px-5" onClick={() => router.push("/assessment")}>
                Start Assessment
              </PrimaryButton>
            </div>
          </SurfaceCard>
        </FadeInSection>
      </SectionContainer>
    </main>
  );
}
