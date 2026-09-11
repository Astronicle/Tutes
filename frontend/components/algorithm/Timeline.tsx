"use client";

import type { Execution } from "@/lib/useExecution";

export default function Timeline({ ex, depth, call }: { ex: Execution; depth: number; call: string }) {
  return (
    <div className="t-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="t-label">Execution timeline</span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-white">
          STEP {String(ex.step).padStart(2, "0")} / {ex.total - 1} · DEPTH {String(depth).padStart(2, "0")}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={ex.total - 1}
        value={ex.step}
        onChange={(e) => ex.go(Number(e.target.value))}
        className="mt-3 w-full accent-[#2f5bff]"
        aria-label="Scrub execution timeline"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-[#555b64]">
        <span>STATE 00</span>
        <span className="text-[#8a8f98]">CALL {call || "—"}</span>
        <span>STATE {ex.total - 1}</span>
      </div>
    </div>
  );
}
