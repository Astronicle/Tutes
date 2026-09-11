"use client";

import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import type { Execution } from "@/lib/useExecution";

export default function Controls({ ex }: { ex: Execution }) {
  const btn =
    "flex h-10 items-center justify-center gap-2 border border-[#22262c] bg-[#14171b] px-4 font-mono text-[11px] tracking-[0.12em] text-white transition-colors hover:border-[#2f5bff] disabled:opacity-40";
  return (
    <div className="t-panel flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button className={btn} onClick={ex.reset} aria-label="Reset execution">
          <RotateCcw size={14} /> RESET
        </button>
        <button className={btn} onClick={ex.prev} disabled={ex.step === 0} aria-label="Previous step">
          <StepBack size={14} /> PREV
        </button>
        <button
          className="flex h-10 items-center justify-center gap-2 bg-[#2f5bff] px-6 font-mono text-[11px] tracking-[0.12em] text-white hover:bg-[#2448cc]"
          onClick={ex.toggle}
          aria-label={ex.playing ? "Pause" : "Play"}
        >
          {ex.playing ? <Pause size={14} /> : <Play size={14} />}
          {ex.playing ? "PAUSE" : "PLAY"}
        </button>
        <button
          className={btn}
          onClick={ex.next}
          disabled={ex.step >= ex.total - 1}
          aria-label="Next step"
        >
          NEXT <StepForward size={14} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="t-label mr-1">Speed</span>
        {ex.speeds.map((s, i) => (
          <button
            key={s}
            onClick={() => ex.setSpeedIdx(i)}
            aria-label={`Speed ${s}x`}
            className={`h-8 border px-2 font-mono text-[11px] ${
              i === ex.speedIdx
                ? "border-[#2f5bff] bg-[#2f5bff]/15 text-white"
                : "border-[#22262c] text-[#8a8f98] hover:text-white"
            }`}
          >
            {s}×
          </button>
        ))}
        <span className="ml-2 hidden font-mono text-[10px] text-[#555b64] lg:inline">
          ← → · SPACE · R
        </span>
      </div>
    </div>
  );
}
