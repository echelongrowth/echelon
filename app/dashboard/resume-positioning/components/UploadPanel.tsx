"use client";

import { useActionState, useEffect, useState } from "react";
import { analyzeResumeSubmission } from "@/app/dashboard/resume-positioning/actions";
import { AnalysisLoader } from "@/app/dashboard/resume-positioning/components/AnalysisLoader";
import type {
  ResumeAnalysis,
  ResumeAnalysisActionState,
} from "@/types/resume-positioning";

export function UploadPanel({
  onCompleted,
}: {
  onCompleted: (analysis: ResumeAnalysis) => void;
}) {
  const initialResumeAnalysisState: ResumeAnalysisActionState = {
    ok: false,
    error: null,
    analysis: null,
  };

  const [state, formAction, isPending] = useActionState(
    analyzeResumeSubmission,
    initialResumeAnalysisState
  );
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (state.ok && state.analysis) {
      onCompleted(state.analysis);
    }
  }, [onCompleted, state.analysis, state.ok]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Resume Positioning Intake
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
          Resume Positioning Intelligence
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Upload a resume PDF or paste resume text to generate structured
          executive-level positioning diagnostics.
        </p>

        <form action={formAction} className="mt-6 space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="resumeFile"
            >
              Upload Resume (PDF)
            </label>
            <input
              accept="application/pdf"
              className="block w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-white/15"
              id="resumeFile"
              name="resumeFile"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? "")
              }
              type="file"
            />
            {fileName ? (
              <p className="mt-2 text-xs text-slate-400">{fileName}</p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-200"
              htmlFor="resumeText"
            >
              Or Paste Resume Text
            </label>
            <textarea
              className="min-h-48 w-full rounded-lg border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-[#8B5CF6]/60"
              id="resumeText"
              name="resumeText"
              placeholder="Paste resume content here..."
            />
          </div>

          {state.error ? (
            <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {state.error}
            </p>
          ) : null}

          <button
            className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] px-5 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:shadow-[0_0_24px_rgba(79,140,255,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Generating Intelligence..." : "Generate Resume Intelligence"}
          </button>
        </form>
      </section>

      {isPending ? <AnalysisLoader /> : null}
    </div>
  );
}
