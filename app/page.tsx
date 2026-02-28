import Link from "next/link";
import { FloatingRoadmapCard } from "@/components/home/FloatingRoadmapCard";
import { PromotionProbabilityCard } from "@/components/home/PromotionProbabilityCard";
import { RiskRadarCard } from "@/components/home/RiskRadarCard";
import { SalaryProjectionChart } from "@/components/home/SalaryProjectionChart";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  FadeInSection,
  SectionContainer,
  SurfaceCard,
} from "@/components/ui/primitives";

const features = [
  {
    title: "Positioning Engine",
    points: ["Market value analysis", "Skill gap intelligence", "Promotion probability"],
  },
  {
    title: "Leverage Mapping",
    points: ["Influence strategy", "Internal visibility scoring", "Political capital model"],
  },
  {
    title: "Compensation Optimizer",
    points: ["Salary benchmarking", "Negotiation preparation", "Role transition modeling"],
  },
  {
    title: "Career Risk Radar",
    points: ["Layoff exposure scoring", "Industry alignment analysis", "Defensibility index"],
  },
];

const steps = [
  {
    title: "Complete Career Intelligence Profile",
    description: "Share your baseline to map strategic upside and structural risk.",
  },
  {
    title: "Receive Strategic Positioning Report",
    description: "Get a quantified narrative of leverage, gaps, and market posture.",
  },
  {
    title: "Execute 90-Day Leverage Roadmap",
    description: "Prioritize focused moves that compound visible outcomes.",
  },
  {
    title: "Track Compounding Gains",
    description: "Measure progress with clear execution checkpoints.",
  },
];

function Stepper() {
  return (
    <>
      <div className="hidden md:grid md:grid-cols-4 md:gap-4">
        {steps.map((step, idx) => (
          <div className="relative" key={step.title}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--app-border)] text-xs text-[var(--app-muted)]">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-[var(--app-text)]">{step.title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">{step.description}</p>
            {idx < steps.length - 1 ? (
              <div className="absolute right-0 top-3 hidden h-px w-6 translate-x-4 bg-[var(--app-border)] lg:block" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="space-y-4 md:hidden">
        {steps.map((step, idx) => (
          <div
            className="rounded-2xl border border-[var(--app-border)] bg-[#ffffff05] p-4"
            key={step.title}
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--app-border)] text-xs text-[var(--app-muted)]">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-[var(--app-text)]">{step.title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">{step.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-[var(--app-text)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5b8cff22] blur-3xl" />
      </div>

      <SectionContainer className="relative">
        <header className="flex h-16 items-center justify-between px-4 md:h-[72px] md:px-6">
          <Link className="inline-flex items-center" href="/">
            <BrandLogo
              className="h-9 w-[168px] md:h-11 md:w-[216px]"
              priority
              size="md"
              variant="full"
            />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--app-border)] px-4 text-sm text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff0a]"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--app-border)] px-4 text-sm text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff0a]"
              href="/auth/login"
            >
              Login
            </Link>
          </nav>
        </header>
      </SectionContainer>

      <SectionContainer className="pb-8 pt-4 md:pb-12 md:pt-6">
        <FadeInSection className="mx-auto max-w-[720px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
            Strategic Career Operating System
          </p>
          <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight md:text-[42px]">
            Design Your Career Like a CEO, Not an Employee
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[var(--app-muted)] md:text-base">
            Echelon is an AI-powered strategic intelligence system for mid-career professionals
            focused on leverage, risk control, and intentional career compounding.
          </p>
          <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
            <Link
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#7aa4ff55] bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff] px-6 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105 sm:w-auto"
              href="/assessment"
            >
              Start Strategic Assessment
            </Link>
            <a
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[var(--app-border)] px-6 text-sm font-medium text-[var(--app-text)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ffffff0a] sm:w-auto"
              href="#how-it-works"
            >
              See How It Works
            </a>
          </div>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-10">
        <FadeInSection className="grid gap-4 lg:grid-cols-2">
          <SurfaceCard className="p-6 md:p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--app-muted)]">
              Strategic Intelligence Preview
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[var(--app-border)] bg-[#ffffff04] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--app-muted)]">Leverage Score</p>
                <p className="mt-2 text-4xl font-light text-[var(--app-text)]">74</p>
              </div>
              <div className="rounded-2xl border border-[var(--app-border)] bg-[#ffffff04] p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--app-muted)]">Risk Score</p>
                <p className="mt-2 text-4xl font-light text-[var(--app-text)]">39</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: "Market Positioning", width: "82%" },
                { label: "Leadership Visibility", width: "68%" },
                { label: "Compensation Optionality", width: "76%" },
                { label: "Risk Defensibility", width: "63%" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-[var(--app-muted)]">
                    <span>{item.label}</span>
                    <span>{item.width}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-[#ffffff0a]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff]"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="grid min-h-[320px] place-items-center p-4 md:p-6">
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <FloatingRoadmapCard />
              <SalaryProjectionChart />
              <RiskRadarCard />
              <PromotionProbabilityCard />
            </div>
          </SurfaceCard>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-10">
        <FadeInSection className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              The Echelon System
            </p>
            <h2 className="mt-3 text-[24px] font-semibold tracking-tight">Career Intelligence Framework</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((card) => (
              <SurfaceCard
                className="transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[1px] hover:scale-[1.01]"
                key={card.title}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--app-muted)]">
                    {card.points.map((point) => (
                      <li className="flex items-center gap-2" key={point}>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5b8cff]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-10" id="how-it-works">
        <FadeInSection>
          <SurfaceCard className="p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-muted)]">
              Execution Flow
            </p>
            <h2 className="mt-3 text-[24px] font-semibold tracking-tight">How It Works</h2>
            <div className="mt-6">
              <Stepper />
            </div>
          </SurfaceCard>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-12">
        <FadeInSection>
          <SurfaceCard className="p-7 text-center md:p-10">
            <h2 className="text-[28px] font-semibold tracking-tight md:text-[36px]">
              Stop Drifting. Start Compounding.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--app-muted)]">
              Sustainable career growth compounds when managed as a strategic system, not as
              reactive decisions.
            </p>
            <Link
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-[#7aa4ff55] bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff] px-7 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105"
              href="/assessment"
            >
              Enter the System
            </Link>
          </SurfaceCard>
        </FadeInSection>
      </SectionContainer>

      <SectionContainer className="pb-8">
        <footer className="border-t border-[var(--app-border)] py-6 text-xs text-[var(--app-muted)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Echelon</p>
            <p>Strategic intelligence for measurable career leverage.</p>
          </div>
        </footer>
      </SectionContainer>
    </main>
  );
}
