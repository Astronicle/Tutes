"use client";

import { motion } from "motion/react";

interface N {
  id: string;
  x: number;
  y: number;
  status: "idle" | "frontier" | "current" | "visited";
}
interface E {
  from: string;
  to: string;
}

const fillFor = (s: N["status"]) => {
  switch (s) {
    case "current":
      return { fill: "#2f5bff", stroke: "#2f5bff" };
    case "frontier":
      return { fill: "#14171b", stroke: "#eab308" };
    case "visited":
      return { fill: "#12261a", stroke: "#22c55e" };
    default:
      return { fill: "#0f1114", stroke: "#2a2f36" };
  }
};

export default function GraphVisualizer({
  nodes,
  edges,
  queue,
}: {
  nodes: N[];
  edges: E[];
  queue: string[];
}) {
  const P = (n: N) => ({ x: (n.x / 100) * 600 + 20, y: (n.y / 100) * 260 + 20 });
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div>
      <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Graph traversal">
        {edges.map((e, i) => {
          const a = P(byId[e.from]);
          const b = P(byId[e.to]);
          const hot = byId[e.from]?.status === "current" || byId[e.to]?.status === "current";
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot ? "#2f5bff" : "#2a2f36"} strokeWidth={hot ? 2 : 1.5} />
          );
        })}
        {nodes.map((n) => {
          const p = P(n);
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
              />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fill="#edebe6" fontFamily="monospace" fontWeight={700}>
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 border border-[#22262c] bg-[#0a0b0d] p-2 font-mono text-[11px] text-[#8a8f98]">
        QUEUE <span className="text-white">[{queue.join(", ") || "∅"}]</span>
      </div>
    </div>
  );
}
