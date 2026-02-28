"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: "hero", label: "Overview" },
  { id: "scores", label: "Scores" },
  { id: "ai-readiness", label: "AI Readiness" },
  { id: "skill-gaps", label: "Skill Gaps" },
  { id: "strategic-projects", label: "Roadmap" },
  { id: "execution", label: "Execution" },
];

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between rounded-[16px] border border-[var(--db-border)] bg-[var(--db-surface)]/95 px-4 py-3">
        <p className="text-sm font-medium text-[var(--db-text)]">Dashboard Navigation</p>
        <button
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-14 items-center justify-center rounded-full border border-[var(--db-border)] text-[var(--db-text)]"
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <span className="text-xs font-semibold">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 z-40"
            exit={{ opacity: 0, x: "100%" }}
            initial={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              aria-label="Close navigation menu overlay"
              className="absolute inset-0 bg-[#00000066]"
              onClick={() => setOpen(false)}
              type="button"
            />
            <div className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] border-l border-[var(--db-border)] bg-[var(--db-surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--db-muted)]">
                Sections
              </p>
              <nav className="mt-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    className="block rounded-xl border border-[var(--db-border)] px-3 py-2.5 text-sm text-[var(--db-text)]"
                    href={`#${item.id}`}
                    key={item.id}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
