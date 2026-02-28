"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type {
  SideProjectsApiResponse,
  StrategicSideProject,
} from "@/types/side-projects";
import { EntrepreneurialTrackLocked } from "@/components/pro/EntrepreneurialTrackLocked";
import { GenerationLimitReached } from "@/components/pro/GenerationLimitReached";
import { SectionHeader, SurfaceCard } from "@/components/dashboard-primitives";

type RequestState = "idle" | "loading" | "error";

const defaultError =
  "Unable to generate strategic analysis right now. Please try again shortly.";

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "revenue" | "complexity";
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        tone === "revenue"
          ? "bg-[#DDF5EA] text-[#0A7F49] dark:bg-[#133227] dark:text-[#56D39C]"
          : "bg-[color-mix(in_oklab,var(--db-border)_75%,transparent)] text-[var(--db-muted)]"
      }`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: StrategicSideProject }) {
  return (
    <motion.article
      className="apple-card-hover rounded-[20px] border border-[var(--db-border)] bg-[var(--db-surface)] p-6"
      layout
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-xl font-semibold tracking-tight text-[var(--db-text)]">{project.title}</h4>
        <div className="flex gap-2">
          <Badge label={`Revenue: ${project.revenuePotential}`} tone="revenue" />
          <Badge
            label={`Complexity: ${project.executionComplexity}`}
            tone="complexity"
          />
        </div>
      </div>
      <dl className="mt-5 grid gap-4 text-sm text-[var(--db-muted)] lg:grid-cols-2">
        <div>
          <dt className="apple-label">Strategic Objective</dt>
          <dd className="mt-2 leading-7">{project.strategicObjective}</dd>
        </div>
        <div>
          <dt className="apple-label">Market Opportunity</dt>
          <dd className="mt-2 leading-7">{project.marketOpportunity}</dd>
        </div>
        <div>
          <dt className="apple-label">Monetization Angle</dt>
          <dd className="mt-2 leading-7">{project.monetizationAngle}</dd>
        </div>
        <div>
          <dt className="apple-label">AI Integration</dt>
          <dd className="mt-2 leading-7">{project.aiIntegrationAngle}</dd>
        </div>
        <div className="lg:col-span-2">
          <dt className="apple-label">Execution Roadmap</dt>
          <dd className="mt-2 leading-7">{project.executionRoadmap}</dd>
        </div>
        <div className="lg:col-span-2">
          <dt className="apple-label">Resume Bullet</dt>
          <dd className="mt-2 leading-7">{project.resumeBulletExample}</dd>
        </div>
        <div className="lg:col-span-2">
          <dt className="apple-label">Risk Assessment</dt>
          <dd className="mt-2 leading-7">{project.riskAssessment}</dd>
        </div>
      </dl>
    </motion.article>
  );
}

export function EntrepreneurialSideProjectEngine({
  initialProjects,
  initialUnavailableReason,
}: {
  initialProjects: StrategicSideProject[] | null;
  initialUnavailableReason?: string;
}) {
  const [projects, setProjects] = useState<StrategicSideProject[] | null>(
    initialProjects
  );
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockedReason, setLockedReason] = useState<string | null>(
    initialUnavailableReason ?? null
  );
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const canGenerate = useMemo(
    () => requestState !== "loading" && !limitMessage && !lockedReason,
    [requestState, limitMessage, lockedReason]
  );

  async function handleGenerate() {
    setRequestState("loading");
    setErrorMessage(null);
    setLockedReason(null);
    setLimitMessage(null);

    try {
      const response = await fetch("/api/pro/side-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const payload = (await response.json()) as SideProjectsApiResponse | { error?: string };

      if (!response.ok) {
        const error =
          payload && "error" in payload && payload.error
            ? payload.error
            : defaultError;
        throw new Error(error);
      }

      if ("feature_available" in payload && payload.feature_available === false) {
        setLockedReason(payload.feature_unavailable_reason);
        setProjects(null);
        setRequestState("idle");
        return;
      }

      if ("regeneration_blocked" in payload && payload.regeneration_blocked) {
        setLimitMessage(payload.message);
        setRequestState("idle");
        return;
      }

      if ("projects" in payload) {
        setProjects(payload.projects);
        setRequestState("idle");
        return;
      }

      throw new Error(defaultError);
    } catch (error) {
      const message = error instanceof Error ? error.message : defaultError;
      setErrorMessage(message);
      setRequestState("error");
    }
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <SurfaceCard className="rounded-[20px] p-7 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            label="Strategic Side-Project Engine"
            subtitle="Venture-grade project strategy aligned to leverage, positioning, and execution horizon."
            title="Entrepreneurial Track Intelligence"
          />
          <button
            className="apple-ghost-btn inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canGenerate}
            onClick={handleGenerate}
            type="button"
          >
            {requestState === "loading"
              ? "Generating strategic analysis..."
              : "Generate Strategic Side Projects"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl border border-[#F2C6C4] bg-[#FBECEC] px-4 py-3 text-sm text-[#A73A35] dark:border-[#5A2C2A] dark:bg-[#311C1B] dark:text-[#FF9A95]">
            {errorMessage}
          </p>
        ) : null}

        {lockedReason ? <EntrepreneurialTrackLocked reason={lockedReason} /> : null}
        {limitMessage ? <GenerationLimitReached message={limitMessage} /> : null}

        {projects?.length ? (
          <div className="mt-6 space-y-5">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        ) : null}
      </SurfaceCard>
    </motion.section>
  );
}
