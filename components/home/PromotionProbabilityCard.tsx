"use client";

import { motion } from "framer-motion";

export function PromotionProbabilityCard() {
  return (
    <motion.div
      animate={{ y: [0, 6, 0] }}
      className="pointer-events-none w-[280px] transform-gpu rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm will-change-transform"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.74 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Promotion Probability
      </p>
      <div className="mt-3 flex items-end gap-2">
        <p className="bg-gradient-to-r from-[#8B5CF6] to-[#4F8CFF] bg-clip-text text-4xl font-semibold text-transparent">
          62%
        </p>
        <span className="mb-2 text-xs text-emerald-300">
          +4.1
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#8B5CF6]/70 to-[#4F8CFF]/70" />
    </motion.div>
  );
}
