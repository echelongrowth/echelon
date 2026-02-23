"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-positioning";

type ExecutionTaskRow = Database["public"]["Tables"]["resume_execution_tasks"]["Row"];

function impactTone(level: "High" | "Medium" | "Low"): string {
  if (level === "High") return "border-rose-300/30 bg-rose-500/10 text-rose-200";
  if (level === "Medium")
    return "border-amber-300/30 bg-amber-500/10 text-amber-200";
  return "border-slate-400/35 bg-slate-500/10 text-slate-200";
}

export function ProgressTracking({
  analysisId,
  priorities,
}: {
  analysisId: string;
  priorities: ResumeAnalysis["tactical_execution_priorities"];
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [tasks, setTasks] = useState<ExecutionTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingTaskIds, setSavingTaskIds] = useState<Set<string>>(new Set());

  const prioritiesById = useMemo(() => {
    const map = new Map<string, ResumeAnalysis["tactical_execution_priorities"][number]>();
    priorities.forEach((item) => map.set(item.id, item));
    return map;
  }, [priorities]);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("resume_execution_tasks")
        .select("id,analysis_id,user_id,task_id,completed,created_at")
        .eq("analysis_id", analysisId)
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (queryError) {
        setError("Unable to load tactical execution tasks.");
        setLoading(false);
        return;
      }

      setTasks(data ?? []);
      setLoading(false);
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, [analysisId, supabase]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const completionPct =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  async function toggleTask(task: ExecutionTaskRow) {
    setSavingTaskIds((current) => new Set(current).add(task.id));
    setError(null);

    const { error: updateError } = await supabase
      .from("resume_execution_tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id)
      .eq("analysis_id", analysisId);

    if (updateError) {
      setError("Unable to update execution task.");
      setSavingTaskIds((current) => {
        const next = new Set(current);
        next.delete(task.id);
        return next;
      });
      return;
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, completed: !item.completed } : item
      )
    );

    setSavingTaskIds((current) => {
      const next = new Set(current);
      next.delete(task.id);
      return next;
    });
  }

  if (loading) {
    return (
      <section className="l1-surface rounded-xl p-8">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-slate-500/70" />
          <p className="label-micro">Tactical Execution Intelligence</p>
        </div>
        <p className="mt-3 text-sm text-slate-300">Loading execution priorities...</p>
      </section>
    );
  }

  return (
    <section className="l1-surface rounded-xl p-8">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-slate-500/70" />
        <p className="label-micro">Tactical Execution Intelligence</p>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-semibold text-slate-100">Progress Tracking</h3>
        <p className="rounded-md border border-slate-600/50 bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-300">
          {completionPct}% complete
        </p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
        <div
          className="h-full rounded-full bg-slate-500/85 transition-all duration-200 ease-in-out"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {tasks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          No tactical execution priorities available for this analysis.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.map((task) => {
            const detail = prioritiesById.get(task.task_id);
            const title = detail?.title ?? "Strategic task";
            const objective = detail?.strategic_objective ?? "Objective unavailable.";
            const impact = detail?.impact_level ?? "Low";
            const saving = savingTaskIds.has(task.id);

            return (
              <article
                className="rounded-lg border border-slate-700/55 bg-slate-900/55 p-4 transition-all duration-150 ease-out hover:bg-slate-800/70"
                key={task.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{objective}</p>
                    <span
                      className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${impactTone(
                        impact
                      )}`}
                    >
                      {impact} Impact
                    </span>
                  </div>
                  <button
                    className={`relative mt-0.5 h-6 w-11 rounded-full border transition-all duration-200 ease-in-out ${
                      task.completed
                        ? "border-indigo-300/55 bg-indigo-300/25"
                        : "border-slate-600/80 bg-slate-800/90"
                    } ${saving ? "opacity-70" : ""}`}
                    disabled={saving}
                    onClick={() => void toggleTask(task)}
                    type="button"
                  >
                    <span
                      className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all duration-200 ease-in-out ${
                        task.completed ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
