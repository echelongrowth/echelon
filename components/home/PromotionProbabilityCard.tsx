"use client";

import { motion } from "framer-motion";

export function PromotionProbabilityCard() {
  return (
    <motion.div
      animate={{ y: [0, 6, 0] }}
      className="w-full max-w-[280px] rounded-[20px] border border-[var(--app-border)] bg-[#ffffff05] p-5 backdrop-blur-sm"
      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      style={{ opacity: 0.86 }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)]">
        Promotion Probability
      </p>
      <div className="mt-3 flex items-end gap-2">
        <p className="bg-gradient-to-r from-[#3f6fe8] to-[#5b8cff] bg-clip-text text-4xl font-semibold text-transparent">
          62%
        </p>
        <span className="mb-2 text-xs text-[#7de1b0]">
          +4.1
        </span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-[#3f6fe8]/70 to-[#5b8cff]/70" />
    </motion.div>
  );
}
