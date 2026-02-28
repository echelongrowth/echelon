"use client";

import { motion } from "framer-motion";

const milestones = [
  { label: "Positioning Baseline", week: "Week 1", progress: 92 },
  { label: "Visibility Sprint", week: "Week 5", progress: 64 },
  { label: "Compensation Leverage", week: "Week 10", progress: 31 },
];

export function FloatingRoadmapCard() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      className="w-full max-w-[320px] rounded-[20px] border border-[var(--app-border)] bg-[#ffffff05] p-5 backdrop-blur-md"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.86 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
        90-Day Strategic Roadmap
      </p>
      <div className="mt-4 space-y-3">
        {milestones.map((item) => (
          <div
            className="rounded-xl border border-[var(--app-border)] bg-[#ffffff03] px-3 py-2"
            key={item.label}
          >
            <div className="flex items-center justify-between text-xs text-[var(--app-muted)]">
              <span>{item.label}</span>
              <span>{item.week}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#ffffff0a]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
