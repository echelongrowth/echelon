"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { ResumeAnalysis } from "@/types/resume-positioning";

type ExecutionTaskRow = Database["public"]["Tables"]["resume_execution_tasks"]["Row"];

function impactTone(level: "High" | "Medium" | "Low"): string {
  if (level === "High") return "border-[#a73a3555] bg-[#a73a351a] text-[#ff9a95]";
  if (level === "Medium")
    return "border-[#c89a4755] bg-[#c89a471a] text-[#ffd28b]";
  return "border-[var(--db-border)] bg-[var(--db-surface-subtle)] text-[var(--db-muted)]";
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
      <section className="apple-surface rounded-[20px] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-[var(--db-accent)]/70" />
          <p className="apple-label">Tactical Execution Intelligence</p>
        </div>
        <p className="mt-3 text-sm text-[var(--db-muted)]">Loading execution priorities...</p>
      </section>
    );
  }

  return (
    <section className="apple-surface rounded-[20px] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-[var(--db-accent)]/70" />
        <p className="apple-label">Tactical Execution Intelligence</p>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-2xl font-semibold text-[var(--db-text)]">Progress Tracking</h3>
        <p className="rounded-md border border-[var(--db-border)] bg-[var(--db-surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--db-muted)]">
          {completionPct}% complete
        </p>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--db-surface-subtle)]">
        <div
          className="h-full rounded-full bg-[var(--db-accent)] transition-all duration-200 ease-in-out"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#a73a3550] bg-[#a73a3515] px-4 py-3 text-sm text-[#ff9a95]">
          {error}
        </p>
      ) : null}

      {tasks.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--db-muted)]">
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
                className="rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)] p-4 transition-all duration-150 ease-out hover:bg-[var(--db-surface)]"
                key={task.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--db-text)]">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--db-muted)]">{objective}</p>
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
                        ? "border-[color-mix(in_oklab,var(--db-accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--db-accent)_20%,transparent)]"
                        : "border-[var(--db-border)] bg-[var(--db-surface)]"
                    } ${saving ? "opacity-70" : ""}`}
                    disabled={saving}
                    onClick={() => void toggleTask(task)}
                    type="button"
                  >
                    <span
                      className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-[var(--db-text)] transition-all duration-200 ease-in-out ${
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
