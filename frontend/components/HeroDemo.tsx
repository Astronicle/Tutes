"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useExecution } from "@/lib/useExecution";
import { buildBinarySearchStates, BINARY_SEARCH_CODE } from "@/lib/algorithms/binary-search";
import { useMemo } from "react";
import CodePanel from "./algorithm/CodePanel";
import ArrayVisualizer from "./visualizations/ArrayVisualizer";

export default function HeroDemo() {
  const states = useMemo(() => buildBinarySearchStates(), []);
  const ex = useExecution(states);
  const s = ex.state;

  return (
    <div className="border border-[#22262c] bg-[#0f1114]">
      <div className="flex items-center justify-between border-b border-[#22262c] px-4 py-2">
        <span className="t-label">Live // binary search</span>
        <span className="font-mono text-[10px] text-[#22c55e]">● INTERACTIVE — CLICK STEP</span>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-[#22262c] md:border-b-0 md:border-r">
          <CodePanel code={BINARY_SEARCH_CODE} line={s.line} phase={s.phase} />
        </div>
        <div className="flex flex-col justify-between p-4">
          {s.array && <ArrayVisualizer cells={s.array} pointers={s.pointers} compact />}
          <p className="mt-3 font-mono text-[11px] leading-5 text-[#8a8f98]">{s.note}</p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={ex.prev}
              className="border border-[#22262c] px-3 py-2 font-mono text-[11px] text-white hover:border-[#2f5bff]"
              aria-label="Previous step"
            >
              ←
            </button>
            <button
              onClick={ex.next}
              className="flex-1 bg-[#2f5bff] px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-white hover:bg-[#2448cc]"
              aria-label="Next step"
            >
              STEP → {ex.step}/{ex.total - 1}
            </button>
            <Link
              href="/algorithms/binary-search"
              className="flex items-center gap-1 border border-[#22262c] px-3 py-2 font-mono text-[11px] text-white hover:border-[#2f5bff]"
            >
              OPEN <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
