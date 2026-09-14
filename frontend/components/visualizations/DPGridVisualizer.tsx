"use client";

import { motion } from "motion/react";
import type { DPGrid } from "@/lib/algorithms/types";

const cellClass = (s: DPGrid["states"][number][number]) => {
  switch (s) {
    case "active":
      return "border-[#2f5bff] bg-[#2f5bff]/15 text-white";
    case "dep":
      return "border-[#eab308]/70 bg-[#eab308]/10 text-white";
    case "path":
      return "border-[#22c55e] bg-[#22c55e]/12 text-white";
    case "done":
      return "border-[#22262c] bg-[#14171b] text-[#edebe6]";
    default:
      return "border-[#2a2f36] bg-[#0f1114] text-[#7a818b]";
  }
};

export default function DPGridVisualizer({
  grid,
  output,
}: {
  grid: DPGrid;
  output?: string[];
}) {
  return (
    <div>
      <div className="t-label mb-2">
        DP table // {grid.rows.length} × {grid.cols.length}
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse" aria-label="Dynamic programming table">
          <thead>
            <tr>
              <th className="h-10 w-10 border border-[#1a1e23] bg-[#0a0b0d] font-mono text-[10px] text-[#555b64]">
                {grid.resultLabel}
              </th>
              {grid.cols.map((c, j) => (
                <th
                  key={j}
                  className="h-10 w-12 border border-[#1a1e23] bg-[#0a0b0d] font-mono text-[12px] font-bold text-[#8a8f98]"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.values.map((row, i) => (
              <tr key={i}>
                <th className="h-12 w-10 border border-[#1a1e23] bg-[#0a0b0d] font-mono text-[12px] font-bold text-[#8a8f98]">
                  {grid.rows[i]}
                </th>
                {row.map((v, j) => {
                  const st = grid.states[i][j];
                  const arrow = grid.arrows[i][j];
                  return (
                    <td
                      key={j}
                      className={`relative h-12 w-12 border text-center font-mono text-[13px] font-semibold ${cellClass(st)}`}
                      aria-label={`row ${grid.rows[i]} column ${grid.cols[j]} value ${v ?? "empty"} ${st}`}
                    >
                      <motion.span
                        className="inline-block"
                        animate={st === "active" ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={
                          st === "active"
                            ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
                            : { type: "spring", stiffness: 500, damping: 35 }
                        }
                      >
                        {v ?? "·"}
                      </motion.span>
                      {arrow && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] leading-none text-[#555b64]">
                          {arrow}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.12em] text-[#8a8f98]">
        <span><i className="mr-1 inline-block h-2 w-2 bg-[#2f5bff]" />COMPUTING</span>
        <span><i className="mr-1 inline-block h-2 w-2 border border-[#eab308]" />READS FROM</span>
        <span><i className="mr-1 inline-block h-2 w-2 border border-[#22c55e]" />TRACEBACK</span>
        <span className="text-[#555b64]">↖ ↑ ← = RECURRENCE SOURCE</span>
      </div>
      {output && output.length > 0 && (
        <div className="mt-3 border border-[#22262c] bg-[#0a0b0d] p-3 font-mono text-[12px]">
          <span className="text-[#555b64]">{grid.resultLabel} </span>
          <span className="text-[#22c55e]">{output.join(" ")}</span>
        </div>
      )}
    </div>
  );
}
