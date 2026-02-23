"use client";

import { useMemo, useState } from "react";
import type {
  SideProjectsApiResponse,
  StrategicSideProject,
} from "@/types/side-projects";
import { EntrepreneurialTrackLocked } from "@/components/pro/EntrepreneurialTrackLocked";
import { GenerationLimitReached } from "@/components/pro/GenerationLimitReached";

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
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
        tone === "revenue"
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
          : "border-slate-500/50 bg-slate-800/60 text-slate-200"
      }`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project }: { project: StrategicSideProject }) {
  return (
    <article className="l2-surface rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="text-lg font-semibold text-slate-100">{project.title}</h4>
        <div className="flex gap-2">
          <Badge label={`Revenue: ${project.revenuePotential}`} tone="revenue" />
          <Badge
            label={`Complexity: ${project.executionComplexity}`}
            tone="complexity"
          />
        </div>
      </div>
      <dl className="mt-4 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
        <div>
          <dt className="label-micro">Strategic Objective</dt>
          <dd className="mt-2 leading-6">{project.strategicObjective}</dd>
        </div>
        <div>
          <dt className="label-micro">Market Opportunity</dt>
          <dd className="mt-2 leading-6">{project.marketOpportunity}</dd>
        </div>
        <div>
          <dt className="label-micro">Monetization Angle</dt>
          <dd className="mt-2 leading-6">{project.monetizationAngle}</dd>
        </div>
        <div>
          <dt className="label-micro">AI Integration</dt>
          <dd className="mt-2 leading-6">{project.aiIntegrationAngle}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="label-micro">Execution Roadmap</dt>
          <dd className="mt-2 leading-6">{project.executionRoadmap}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="label-micro">Resume Bullet</dt>
          <dd className="mt-2 leading-6">{project.resumeBulletExample}</dd>
        </div>
        <div className="md:col-span-2">
          <dt className="label-micro">Risk Assessment</dt>
          <dd className="mt-2 leading-6">{project.riskAssessment}</dd>
        </div>
      </dl>
    </article>
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
    <section className="l1-surface rounded-xl p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-micro">Strategic Side-Project Engine</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-100">
            Entrepreneurial Track Intelligence
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Venture-grade project strategy aligned to leverage, positioning, and execution horizon.
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-500/45 bg-slate-800/45 px-4 text-sm font-medium text-slate-100 transition duration-200 ease-out enabled:hover:border-slate-400/65 enabled:hover:bg-slate-700/45 disabled:cursor-not-allowed disabled:opacity-60"
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
        <p className="mt-5 rounded-lg border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
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
    </section>
  );
}
