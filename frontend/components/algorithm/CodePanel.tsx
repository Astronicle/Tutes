"use client";

import { motion } from "motion/react";

export default function CodePanel({
  code,
  line,
  phase,
}: {
  code: string[];
  line: number;
  phase: string;
}) {
  return (
    <div className="t-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#22262c] px-4 py-2">
        <span className="t-label">Source // solve</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-[#2f5bff]">▶ LINE {line} · {phase}</span>
      </div>
      <pre className="overflow-x-auto p-0 font-mono text-[12.5px] leading-6" aria-label="Algorithm source code">
        {code.map((l, i) => {
          const n = i + 1;
          const active = n === line;
          return (
            <motion.div
              key={n}
              animate={{ backgroundColor: active ? "rgba(47,91,255,0.16)" : "rgba(0,0,0,0)" }}
              className={`flex gap-3 px-4 ${active ? "border-l-2 border-[#2f5bff]" : "border-l-2 border-transparent"}`}
            >
              <span className={`w-6 shrink-0 select-none text-right ${active ? "text-white" : "text-[#555b64]"}`}>
                {active ? "▶" : String(n).padStart(2, "0")}
              </span>
              <code className={active ? "text-white" : "text-[#a7adb6]"}>{l || " "}</code>
            </motion.div>
          );
        })}
      </pre>
    </div>
  );
}
