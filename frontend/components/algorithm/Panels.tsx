"use client";

import { motion } from "motion/react";
import type { ExecState } from "@/lib/algorithms/types";

export function VariableInspector({ state }: { state: ExecState }) {
  return (
    <div className="t-panel p-4">
      <div className="t-label mb-3">Variables</div>
      <dl className="space-y-1.5 font-mono text-[12px]">
        {Object.entries(state.vars).map(([k, v]) => {
          const hot = state.changed?.includes(k);
          return (
            <motion.div
              key={k}
              animate={hot ? { backgroundColor: "rgba(47,91,255,0.18)" } : { backgroundColor: "rgba(0,0,0,0)" }}
              className="flex items-center justify-between gap-3 px-1 py-0.5"
            >
              <dt className="text-[#8a8f98]">{k}</dt>
              <dd className={`truncate ${hot ? "text-white" : "text-[#edebe6]"}`}>{v}</dd>
            </motion.div>
          );
        })}
      </dl>
    </div>
  );
}

export function CallStack({ stack }: { stack: string[] }) {
  return (
    <div className="t-panel p-4">
      <div className="t-label mb-3">Call stack</div>
      {stack.length === 0 ? (
        <div className="font-mono text-[12px] text-[#555b64]">— empty —</div>
      ) : (
        <div className="space-y-1">
          {stack.map((c, i) => (
            <div
              key={i}
              className={`border px-2 py-1 font-mono text-[12px] ${
                i === stack.length - 1
                  ? "border-[#2f5bff] bg-[#2f5bff]/12 text-white"
                  : "border-[#22262c] text-[#8a8f98]"
              }`}
              style={{ marginLeft: i * 10 }}
            >
              {c} {i === stack.length - 1 && <span className="text-[#2f5bff]">← CURRENT</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function WhyPanel({ state }: { state: ExecState }) {
  return (
    <div className="border border-[#2f5bff]/40 bg-[#2f5bff]/8 p-4">
      <div className="font-mono text-[10px] tracking-[0.18em] text-[#2f5bff]">WHY ARE WE HERE?</div>
      <p className="mt-2 text-sm leading-6 text-[#edebe6]">{state.note}</p>
      <p className="mt-2 border-t border-[#2f5bff]/25 pt-2 font-mono text-[11px] leading-5 text-[#8a8f98]">
        <span className="text-white">WHY? </span>
        {state.why}
      </p>
    </div>
  );
}
