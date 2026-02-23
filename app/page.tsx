import Link from "next/link";
import { FloatingRoadmapCard } from "@/components/home/FloatingRoadmapCard";
import { PromotionProbabilityCard } from "@/components/home/PromotionProbabilityCard";
import { RiskRadarCard } from "@/components/home/RiskRadarCard";
import { SalaryProjectionChart } from "@/components/home/SalaryProjectionChart";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0E1117_0%,#111827_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-10 top-96 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
        <header className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Echelon
          </p>
          <nav className="flex items-center gap-3">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-[#4F8CFF]/40 hover:text-white"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 text-sm font-medium text-slate-200 transition-all duration-200 hover:border-[#8B5CF6]/40 hover:text-white"
              href="/auth/login"
            >
              Login
            </Link>
          </nav>
        </header>

        <section className="pointer-events-none mt-8 hidden xl:grid xl:grid-cols-[1fr_0.9fr_1fr] xl:gap-8">
          <div className="flex flex-col gap-5">
            <FloatingRoadmapCard />
            <SalaryProjectionChart />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Strategic Signal Layer
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Market Momentum", value: "Positive Drift" },
                  { label: "Role Leverage", value: "Improving" },
                  { label: "Risk Horizon", value: "Medium-Term" },
                ].map((item) => (
                  <div
                    className="rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2"
                    key={item.label}
                  >
                    <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-5 pt-3">
            <RiskRadarCard />
            <PromotionProbabilityCard />
          </div>
        </section>

        <section className="relative mt-10 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">

          <div className="fade-in-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Strategic Career Operating System
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Design Your Career Like a CEO - Not an Employee.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Echelon is an AI-powered strategic intelligence system for
              mid-career professionals focused on leverage, risk control, and
              intentional career compounding.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_26px_rgba(79,140,255,0.35)]"
                href="/assessment"
              >
                Start Strategic Assessment
              </Link>
              <a
                className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-100 transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                href="#how-it-works"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="fade-in-up rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Strategic Intelligence Preview
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Leverage Score
                </p>
                <p className="mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-4xl font-semibold text-transparent">
                  74
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Risk Score
                </p>
                <p className="mt-2 text-4xl font-semibold text-slate-100">39</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                Leverage Map
              </p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Market Positioning", width: "82%" },
                  { label: "Leadership Visibility", width: "68%" },
                  { label: "Compensation Optionality", width: "76%" },
                  { label: "Risk Defensibility", width: "63%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{item.label}</span>
                      <span>{item.width}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF]"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Mid-Career Reality
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            The Most Dangerous Career Stage Is the Middle.
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Experience without positioning",
              "Income without leverage",
              "Promotions without strategy",
              "Skills without visibility",
            ].map((item) => (
              <div
                className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            The Echelon System
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            The Career Intelligence Framework
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Positioning Engine",
                points: [
                  "Market value analysis",
                  "Skill gap intelligence",
                  "Promotion probability",
                ],
              },
              {
                title: "Leverage Mapping",
                points: [
                  "Influence strategy",
                  "Internal visibility scoring",
                  "Political capital model",
                ],
              },
              {
                title: "Compensation Optimizer",
                points: [
                  "Salary benchmarking",
                  "Negotiation preparation",
                  "Role transition modeling",
                ],
              },
              {
                title: "Career Risk Radar",
                points: [
                  "Layoff exposure scoring",
                  "Industry alignment analysis",
                  "Defensibility index",
                ],
              },
            ].map((card) => (
              <article
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out hover:border-[#8B5CF6]/35"
                key={card.title}
              >
                <h3 className="text-2xl font-semibold">{card.title}</h3>
                <ul className="mt-5 space-y-2 text-sm text-slate-300">
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 fade-in-up" id="how-it-works">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Execution Flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">How It Works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Complete Career Intelligence Profile",
              "Receive Strategic Positioning Report",
              "Execute 90-Day Leverage Roadmap",
              "Track Compounding Gains",
            ].map((step, idx) => (
              <article
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-sm"
                key={step}
              >
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Step {idx + 1}
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-200">
                  {step}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Strategic Philosophy
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Careers Should Compound.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
            Sustainable career growth is compounding: reputation strength,
            network density, compensation leverage, optionality, and strategic
            positioning improve when managed as an operating system, not a series
            of reactive decisions.
          </p>
        </section>

        <section className="mt-16 fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Fit
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Who It&apos;s For
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                Built For
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>5-15 year professionals</li>
                <li>Senior engineers</li>
                <li>Product managers</li>
                <li>Tech leads</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                Not For
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Interns</li>
                <li>Entry-level candidates</li>
                <li>Career drifters</li>
                <li>Quick hack seekers</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mt-16 fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Pricing Preview
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                tier: "Free",
                price: "Assessment Access",
                highlight: false,
              },
              {
                tier: "Pro",
                price: "Strategic Dashboard + Roadmap",
                highlight: true,
              },
              {
                tier: "Executive",
                price: "Advanced Intelligence & Risk Modeling",
                highlight: false,
              },
            ].map((item) => (
              <article
                className={`rounded-2xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-200 ease-in-out ${
                  item.highlight
                    ? "scale-[1.02] border-violet-400/45 bg-gradient-to-br from-white/[0.08] to-white/[0.04] shadow-violet-500/20"
                    : "border-white/10 bg-white/[0.04]"
                }`}
                key={item.tier}
              >
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  {item.tier}
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-100">
                  {item.price}
                </p>
              </article>
            ))}
          </div>
          <Link
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-slate-100 transition-all duration-200 hover:border-[#8B5CF6]/45"
            href="/pricing"
          >
            View Full Pricing
          </Link>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-xl backdrop-blur-sm fade-in-up">
          <h2 className="text-4xl font-semibold tracking-tight">
            Stop Drifting. Start Compounding.
          </h2>
          <Link
            className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-6 text-sm font-medium text-white transition-all duration-200 hover:shadow-[0_0_26px_rgba(79,140,255,0.35)]"
            href="/assessment"
          >
            Enter the System
          </Link>
        </section>
      </div>
    </main>
  );
}
