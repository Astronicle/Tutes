"use client";

import { motion, AnimatePresence } from "motion/react";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 35 };

/**
 * Animated live call-stack visualization for the desktop playground column.
 * Newest/current frame renders on top; older frames widen below it.
 * Push animates in from above, pop flashes red and slides down before exit,
 * and surviving frames reflow via `layout`.
 */
export default function CallStackViz({ stack }: { stack: string[] }) {
  const total = stack.length;
  // Display newest-first so index 0 in this array is the top of the stack.
  const rows = stack.map((label, i) => ({ label, depth: i, key: `${label}@${i}` })).reverse();

  return (
    <div className="t-panel flex min-h-[280px] flex-1 flex-col bg-[#0a0b0d] p-4" aria-label="Live call stack">
      <div className="mb-3 flex items-center justify-between">
        <span className="t-label">Call stack // live</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[#22c55e]">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#22c55e]"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          {total === 0 ? "IDLE" : `DEPTH ${String(total).padStart(2, "0")}`}
        </span>
      </div>

      {total === 0 ? (
        <div className="flex flex-1 items-center justify-center border border-dashed border-[#22262c] p-6 text-center font-mono text-[12px] leading-5 text-[#555b64]">
          — empty —
          <br />
          STEP → to push solve(0)
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1.5">
          <AnimatePresence mode="popLayout">
            {rows.map(({ label, depth, key }) => {
              const isTop = depth === total - 1;
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ y: -28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{
                    y: 28,
                    opacity: 0,
                    backgroundColor: "rgba(240,68,82,0.14)",
                    borderColor: "#f04452",
                  }}
                  transition={SPRING}
                  className={`flex items-center gap-2 border px-2 py-1.5 font-mono text-[12px] ${
                    isTop
                      ? "border-[#2f5bff] bg-[#2f5bff]/12 text-white"
                      : "border-[#22262c] bg-[#14171b] text-[#8a8f98]"
                  }`}
                  style={{ marginLeft: depth * 14 }}
                  aria-label={`stack frame ${label} depth ${depth}${isTop ? ", current" : ""}`}
                >
                  <span
                    className={`shrink-0 border px-1 text-[10px] leading-4 ${
                      isTop ? "border-[#2f5bff] text-[#2f5bff]" : "border-[#22262c] text-[#555b64]"
                    }`}
                    aria-hidden
                  >
                    {String(depth).padStart(2, "0")}
                  </span>
                  <span className="truncate">{label}</span>
                  {isTop && (
                    <span className="ml-auto shrink-0 text-[10px] tracking-[0.1em] text-[#2f5bff]">
                      ← CURRENT
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="mt-auto pt-2 font-mono text-[9px] tracking-[0.15em] text-[#555b64]">
            TOP = MOST RECENT CALL · POP = BACKTRACK
          </div>
        </div>
      )}
    </div>
  );
}
