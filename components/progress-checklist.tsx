"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader, SurfaceCard } from "@/components/dashboard-primitives";

const defaultItems = [
  "Complete high-impact networking outreach this week",
  "Publish one market-facing proof of expertise",
  "Close one strategic skill gap milestone",
  "Review role-market fit and compensation positioning",
];

export function ProgressChecklist() {
  const [checked, setChecked] = useState<boolean[]>(
    defaultItems.map(() => false)
  );
  const completedCount = checked.filter(Boolean).length;
  const completionPct = Math.round((completedCount / defaultItems.length) * 100);

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
    >
      <SurfaceCard className="rounded-[20px] p-7 md:p-8">
        <SectionHeader
          label="Tactical Execution"
          subtitle="Track weekly execution against your strategic plan."
          title="Progress Tracking"
        />
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--db-border)_85%,transparent)]">
            <div
              className="h-full rounded-full bg-[var(--db-accent)] transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="min-w-fit text-xs font-medium text-[var(--db-muted)]">
            {completionPct}% complete
          </p>
        </div>

        <div className="mt-6 divide-y divide-[var(--db-border)] rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface-subtle)]/70">
          {defaultItems.map((item, idx) => (
            <label className="group flex items-center gap-3 px-4 py-4 md:px-5" key={item}>
              <button
                aria-label={`Toggle item ${idx + 1}`}
                className={`relative h-6 w-11 rounded-full border transition-all duration-200 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
                  checked[idx]
                    ? "border-[color-mix(in_oklab,var(--db-accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--db-accent)_20%,transparent)]"
                    : "border-[var(--db-border)] bg-[var(--db-surface)]/90"
                }`}
                onClick={(event) => {
                  event.preventDefault();
                  setChecked((prev) =>
                    prev.map((value, currentIdx) =>
                      currentIdx === idx ? !value : value
                    )
                  );
                }}
                type="button"
              >
                <motion.span
                  animate={{ x: checked[idx] ? 18 : 0 }}
                  className={`absolute left-0.5 top-0.5 h-[18px] w-[18px] rounded-full ${
                    checked[idx]
                      ? "bg-[var(--db-accent)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--db-accent)_16%,transparent)]"
                      : "bg-[var(--db-text)]"
                  }`}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                />
              </button>
              <span
                className={`text-sm leading-7 transition-colors ${
                  checked[idx] ? "text-[var(--db-text)]" : "text-[var(--db-muted)]"
                }`}
              >
                {item}
              </span>
              <span className="ml-auto text-xs text-[var(--db-muted)]">
                {checked[idx] ? "Complete" : "Pending"}
              </span>
            </label>
          ))}
        </div>
      </SurfaceCard>
    </motion.section>
  );
}
