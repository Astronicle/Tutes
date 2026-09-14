"use client";

import { useState } from "react";

type CurveKey = "const" | "log" | "linear" | "linearithmic" | "quadratic" | "exp";

const CURVES: { key: CurveKey; label: string; fn: (n: number) => number; blurb: string }[] = [
  { key: "const", label: "O(1)", fn: () => 1, blurb: "Constant: same work no matter the input size." },
  { key: "log", label: "O(log n)", fn: (n) => Math.log2(n + 1), blurb: "Logarithmic: halve the problem every step — binary search." },
  { key: "linear", label: "O(n)", fn: (n) => n, blurb: "Linear: touch each element once — BFS, DP table fill." },
  { key: "linearithmic", label: "O(n log n)", fn: (n) => n * Math.log2(n + 1), blurb: "Linearithmic: divide in halves, linear merge — merge sort." },
  { key: "quadratic", label: "O(n²)", fn: (n) => n * n, blurb: "Quadratic: compare everything with everything — bubble sort." },
  { key: "exp", label: "O(2ⁿ)", fn: (n) => Math.pow(2, n), blurb: "Exponential: every element doubles the work — naive backtracking." },
];

const TIME_TO_CURVE: Record<string, CurveKey> = {
  "O(1)": "const",
  "O(log n)": "log",
  "O(n)": "linear",
  "O(V + E)": "linear",
  "O(n log n)": "linearithmic",
  "O(n²)": "quadratic",
  "O(m·n)": "quadratic",
  "O(n·W)": "quadratic",
  "O(2ⁿ)": "exp",
};

const X_MAX = 20;
const W = 300;
const H = 120;

function pts(fn: (n: number) => number, maxLog: number): string {
  const out: string[] = [];
  for (let n = 1; n <= X_MAX; n++) {
    const x = (n / X_MAX) * W;
    const y = H - (Math.log10(1 + fn(n)) / maxLog) * (H - 8) - 4;
    out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return out.join(" ");
}

function fmtOps(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return `${Math.round(v)}`;
}

export default function ComplexityPanel({ time, space }: { time: string; space: string }) {
  const algoCurve = TIME_TO_CURVE[time] ?? "linear";
  const [sel, setSel] = useState<CurveKey>(algoCurve);
  const maxLog = Math.log10(1 + Math.pow(2, X_MAX));
  const active = CURVES.find((c) => c.key === sel) ?? CURVES[2];
  const atN = 16;

  return (
    <div className="t-panel flex h-full flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="t-label">Complexity // growth</span>
        <span className="font-mono text-[10px] text-[#555b64]">LOG SCALE</span>
      </div>

      <div className="flex gap-6 font-mono">
        <div>
          <div className="text-[9px] tracking-[0.18em] text-[#555b64]">TIME</div>
          <div className="text-xl font-bold text-white">{time}</div>
        </div>
        <div>
          <div className="text-[9px] tracking-[0.18em] text-[#555b64]">SPACE</div>
          <div className="text-xl font-bold text-white">{space}</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 14}`} className="mt-3 w-full" role="img" aria-label="Complexity growth chart">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={H * f} x2={W} y2={H * f} stroke="#1a1e23" strokeWidth={1} />
        ))}
        {CURVES.map((c) => {
          const isSel = c.key === sel;
          const isAlgo = c.key === algoCurve;
          return (
            <polyline
              key={c.key}
              points={pts(c.fn, maxLog)}
              fill="none"
              stroke={isSel ? "#2f5bff" : isAlgo ? "#22c55e" : "#2a2f36"}
              strokeWidth={isSel ? 2.5 : 1.5}
              opacity={isSel || isAlgo ? 1 : 0.55}
              onMouseEnter={() => setSel(c.key)}
              style={{ cursor: "pointer" }}
            >
              <title>{c.label}</title>
            </polyline>
          );
        })}
        <text x={2} y={H + 12} fontSize={8} fill="#555b64" fontFamily="monospace">n=1</text>
        <text x={W - 28} y={H + 12} fontSize={8} fill="#555b64" fontFamily="monospace">n={X_MAX}</text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-1">
        {CURVES.map((c) => (
          <button
            key={c.key}
            onMouseEnter={() => setSel(c.key)}
            onFocus={() => setSel(c.key)}
            onClick={() => setSel(c.key)}
            aria-label={`Show ${c.label}`}
            className={`border px-1.5 py-0.5 font-mono text-[10px] ${
              c.key === sel
                ? "border-[#2f5bff] bg-[#2f5bff]/15 text-white"
                : c.key === algoCurve
                  ? "border-[#22c55e]/60 text-[#22c55e]"
                  : "border-[#22262c] text-[#555b64] hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-2 font-mono text-[11px] leading-5 text-[#8a8f98]">
        <span className="text-white">{active.label}</span> @ n={atN} ≈ {fmtOps(active.fn(atN))} ops. {active.blurb}
        {sel !== algoCurve && (
          <span className="text-[#22c55e]"> Green = this algorithm ({time}).</span>
        )}
      </p>
    </div>
  );
}
