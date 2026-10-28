"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { AlgorithmDef } from "@/lib/algorithms/types";
import { useExecution } from "@/lib/useExecution";
import CodePanel from "./CodePanel";
import CallStackViz from "./CallStackViz";
import Controls from "./Controls";
import Timeline from "./Timeline";
import { CallStack, VariableInspector, WhyPanel } from "./Panels";
import ComplexityPanel from "./ComplexityPanel";
import ArrayVisualizer from "../visualizations/ArrayVisualizer";
import TreeVisualizer from "../visualizations/TreeVisualizer";
import GraphVisualizer from "../visualizations/GraphVisualizer";
import DPGridVisualizer from "../visualizations/DPGridVisualizer";

function Viz({ algo, step }: { algo: AlgorithmDef; step: number }) {
  const s = algo.states[step];
  if (algo.viz === "backtrack") {
    return (
      <div className="space-y-4">
        <div>
          <div className="t-label mb-2">Input array</div>
          {s.array && <ArrayVisualizer cells={s.array} pointers={s.pointers} compact />}
        </div>
        <div className="border border-[#22262c] bg-[#0a0b0d] p-3 font-mono text-[12px]">
          <span className="text-[#555b64]">PATH </span>
          <span className="text-white">[{s.path.join(", ") || "∅"}]</span>
          {s.output && s.output.length > 0 && (
            <div className="mt-2 text-[#8a8f98]">
              ANSWER <span className="text-[#22c55e]">{s.output.join("  ")}</span>
            </div>
          )}
        </div>
        <div>
          <div className="t-label mb-2">Search tree</div>
          {s.tree && <TreeVisualizer nodes={s.tree} />}
        </div>
      </div>
    );
  }
  if (algo.viz === "graph" && s.graph) {
    return (
      <GraphVisualizer nodes={s.graph.nodes} edges={s.graph.edges} queue={s.graph.queue} queueLabel={s.graph.queueLabel} />
    );
  }
  if (algo.viz === "dp-grid" && s.grid) {
    return <DPGridVisualizer grid={s.grid} output={s.output} />;
  }
  return (
    <div>{s.array && <ArrayVisualizer cells={s.array} pointers={s.pointers} />}</div>
  );
}

function ChallengeBox({ algo }: { algo: AlgorithmDef }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [idx, setIdx] = useState(0);
  const ch = algo.challenges[idx];
  if (!ch) return null;
  return (
    <div className="t-panel p-4">
      <div className="flex items-center justify-between">
        <span className="t-label">Predict the next state — {idx + 1}/{algo.challenges.length}</span>
        {algo.challenges.length > 1 && (
          <button
            className="font-mono text-[10px] text-[#8a8f98] hover:text-white"
            onClick={() => {
              setIdx((i) => (i + 1) % algo.challenges.length);
              setPicked(null);
            }}
          >
            NEXT CHALLENGE →
          </button>
        )}
      </div>
      <p className="mt-2 text-sm font-semibold">{ch.q}</p>
      <p className="font-mono text-[11px] text-[#8a8f98]">{ch.context}</p>
      <div className="mt-3 grid gap-2">
        {ch.options.map((o, i) => {
          const done = picked !== null;
          const right = done && i === ch.answer;
          const wrong = done && i === picked && picked !== ch.answer;
          return (
            <button
              key={i}
              disabled={done}
              onClick={() => setPicked(i)}
              className={`border px-3 py-2 text-left font-mono text-[12px] transition-colors disabled:cursor-default ${
                right
                  ? "border-[#22c55e] bg-[#22c55e]/10 text-white"
                  : wrong
                    ? "border-[#f04452] bg-[#f04452]/10 text-white"
                    : "border-[#22262c] text-[#a7adb6] hover:border-[#2f5bff] hover:text-white"
              }`}
            >
              {String.fromCharCode(65 + i)} — {o} {right && <Check size={12} className="inline" />} {wrong && <X size={12} className="inline" />}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-3 border-t border-[#22262c] pt-2 font-mono text-[11px] leading-5 text-[#8a8f98]">
          <span className={picked === ch.answer ? "text-[#22c55e]" : "text-[#f04452]"}>
            {picked === ch.answer ? "CORRECT. " : "NOT QUITE. "}
          </span>
          {ch.explain}
        </p>
      )}
    </div>
  );
}

export default function Playground({ algo }: { algo: AlgorithmDef }) {
  const ex = useExecution(algo.states);
  const s = ex.state;
  const [tab, setTab] = useState<"visual" | "code" | "state">("visual");

  return (
    <div className="space-y-3">
      {/* desktop grid */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-5">
          <CodePanel code={algo.code} line={s.line} phase={s.phase} />
          <div className="mt-3 flex flex-1 flex-col">
            <CallStackViz stack={s.stack} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="t-panel min-h-[480px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="t-label">Visualization // {algo.viz}</span>
              <span className="font-mono text-[10px] text-[#22c55e]">● LIVE STATE {String(ex.step).padStart(2, "0")}</span>
            </div>
            <Viz algo={algo} step={ex.step} />
          </div>
        </div>
      </div>

      {/* mobile tabs */}
      <div className="lg:hidden">
        <div className="mb-2 flex gap-2">
          {(["visual", "code", "state"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 border py-2 font-mono text-[11px] tracking-[0.12em] ${
                tab === t ? "border-[#2f5bff] bg-[#2f5bff]/12 text-white" : "border-[#22262c] text-[#8a8f98]"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        {tab === "visual" && (
          <div className="t-panel p-4">
            <Viz algo={algo} step={ex.step} />
          </div>
        )}
        {tab === "code" && <CodePanel code={algo.code} line={s.line} phase={s.phase} />}
        {tab === "state" && (
          <div className="space-y-3">
            <VariableInspector state={s} />
            <CallStack stack={s.stack} />
          </div>
        )}
      </div>

      <Controls ex={ex} />
      <Timeline ex={ex} depth={s.depth} call={s.stack[s.stack.length - 1] ?? ""} />

      <div className="grid gap-3 md:grid-cols-3">
        <VariableInspector state={s} />
        <ComplexityPanel time={algo.time} space={algo.space} />
        <WhyPanel state={s} />
      </div>

      <ChallengeBox algo={algo} />
    </div>
  );
}
