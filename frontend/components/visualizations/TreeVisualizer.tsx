"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { TreeNodeState } from "@/lib/algorithms/types";

const fillFor = (s: TreeNodeState["status"]) => {
  switch (s) {
    case "current":
      return { fill: "#2f5bff", stroke: "#2f5bff", text: "#fff" };
    case "active":
      return { fill: "#14171b", stroke: "#8a8f98", text: "#edebe6" };
    case "done":
      return { fill: "#12261a", stroke: "#22c55e", text: "#bbf7d0" };
    case "backtracked":
      return { fill: "#2a1215", stroke: "#f04452", text: "#fecdd3" };
    default:
      return { fill: "#0f1114", stroke: "#22262c", text: "#555b64" };
  }
};

export default function TreeVisualizer({ nodes }: { nodes: TreeNodeState[] }) {
  const { pos, W, H } = useMemo(() => {
    const byDepth: Record<number, TreeNodeState[]> = {};
    nodes.forEach((n) => {
      (byDepth[n.depth] ||= []).push(n);
    });
    const W = 640;
    const H = Math.max(220, Object.keys(byDepth).length * 52 + 40);
    const pos: Record<string, { x: number; y: number }> = {};
    Object.entries(byDepth).forEach(([d, arr]) => {
      arr.forEach((n, i) => {
        pos[n.id] = {
          x: ((i + 1) / (arr.length + 1)) * W,
          y: Number(d) * 52 + 36,
        };
      });
    });
    return { pos, W, H };
  }, [nodes]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[520px]" role="img" aria-label="Recursion tree">
        {nodes.map((n) => {
          if (!n.parentId || !pos[n.parentId] || !pos[n.id]) return null;
          const p = pos[n.parentId];
          const c = pos[n.id];
          const done = byId[n.id]?.status === "done";
          return (
            <line
              key={`${n.parentId}-${n.id}`}
              x1={p.x}
              y1={p.y}
              x2={c.x}
              y2={c.y}
              stroke={done ? "#22c55e55" : "#2a2f36"}
              strokeWidth={1.5}
            />
          );
        })}
        {nodes.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const c = fillFor(n.status);
          return (
            <g key={n.id}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={n.status === "current" ? 20 : 16}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={1.5}
                initial={false}
                animate={{ r: n.status === "current" ? 20 : 16 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
              <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize={8.5} fill={c.text} fontFamily="monospace">
                {n.label.length > 9 ? n.label.slice(0, 9) + "…" : n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-4 font-mono text-[9px] tracking-[0.12em] text-[#8a8f98]">
        <span><i className="mr-1 inline-block h-2 w-2 bg-[#2f5bff]" />CURRENT</span>
        <span><i className="mr-1 inline-block h-2 w-2 border border-[#8a8f98]" />ACTIVE</span>
        <span><i className="mr-1 inline-block h-2 w-2 border border-[#22c55e]" />DONE</span>
      </div>
    </div>
  );
}
