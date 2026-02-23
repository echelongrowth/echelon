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
      className="pointer-events-none w-[320px] transform-gpu rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-md will-change-transform"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.72 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        90-Day Strategic Roadmap
      </p>
      <div className="mt-4 space-y-3">
        {milestones.map((item) => (
          <div
            className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2"
            key={item.label}
          >
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{item.label}</span>
              <span>{item.week}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF]"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
