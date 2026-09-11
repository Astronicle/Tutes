"use client";

import { motion } from "motion/react";
import type { ArrayCellState } from "@/lib/algorithms/types";

const colorFor = (s: ArrayCellState["state"]) => {
  switch (s) {
    case "active":
      return "border-[#2f5bff] bg-[#2f5bff]/15 text-white";
    case "compare":
      return "border-[#eab308] bg-[#eab308]/10 text-white";
    case "sorted":
      return "border-[#22c55e]/60 bg-[#22c55e]/10 text-white";
    case "excluded":
      return "border-[#1a1e23] bg-transparent text-[#555b64]";
    case "path":
      return "border-[#2f5bff] bg-[#2f5bff] text-white";
    default:
      return "border-[#22262c] bg-[#14171b] text-[#edebe6]";
  }
};

export default function ArrayVisualizer({
  cells,
  pointers,
  compact = false,
}: {
  cells: ArrayCellState[];
  pointers?: Record<string, number | null>;
  compact?: boolean;
}) {
  const size = compact ? "h-11 w-11 text-sm" : "h-14 w-14 text-base";
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cells.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
              className={`flex ${size} items-center justify-center border font-mono font-semibold ${colorFor(c.state)}`}
              aria-label={`index ${i} value ${c.value} ${c.state}`}
            >
              {c.value}
            </motion.div>
            <div className="font-mono text-[9px] text-[#555b64]">{i}</div>
          </div>
        ))}
      </div>
      {pointers && (
        <div className="mt-3 flex gap-4 font-mono text-[10px] tracking-[0.12em] text-[#8a8f98]">
          {Object.entries(pointers).map(([k, v]) => (
            <span key={k}>
              {k.toUpperCase()} <span className="text-white">{v === null || v === undefined ? "–" : v}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
