import type { ExecState, GraphEdge, GraphNodeState } from "./types";

export const DIJKSTRA_CODE = [
  "void dijkstra(Node start) {",
  "  dist[start] = 0;",
  "  PQ pq = [(0, start)];",
  "  while (!pq.isEmpty()) {",
  "    (d, u) = pq.popMin();",
  "    if (d > dist[u]) continue; // stale entry",
  "    for (Edge e : u.edges()) {",
  "      if (dist[u] + e.w < dist[e.v]) {",
  "        dist[e.v] = dist[u] + e.w;",
  "        prev[e.v] = u;",
  "        pq.push((dist[e.v], e.v));",
  "      }",
  "    }",
  "  }",
  "}",
];

const NODES: GraphNodeState[] = [
  { id: "A", x: 15, y: 15, status: "idle" },
  { id: "B", x: 30, y: 40, status: "idle" },
  { id: "C", x: 70, y: 25, status: "idle" },
  { id: "D", x: 40, y: 65, status: "idle" },
  { id: "E", x: 65, y: 65, status: "idle" },
  { id: "F", x: 85, y: 80, status: "idle" },
];

const EDGES: GraphEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "E" },
  { from: "C", to: "F" },
  { from: "D", to: "E" },
  { from: "E", to: "F" },
];

type Weighted = { to: string; w: number };
const ADJ: Record<string, Weighted[]> = {
  A: [{ to: "B", w: 4 }, { to: "C", w: 2 }],
  B: [{ to: "D", w: 5 }, { to: "E", w: 10 }],
  C: [{ to: "E", w: 3 }, { to: "F", w: 8 }],
  D: [{ to: "E", w: 2 }],
  E: [{ to: "F", w: 1 }],
  F: [],
};

const START = "A";

export function buildDijkstraStates(): ExecState[] {
  const states: ExecState[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  // simple "priority queue": sorted list of (node, dist)
  const pq: string[] = [START];

  for (const id of NODES.map((n) => n.id)) {
    dist[id] = id === START ? 0 : Infinity;
    prev[id] = null;
  }

  const statusOf = (id: string, current: string | null): GraphNodeState["status"] => {
    if (id === current) return "current";
    if (visited.has(id)) return "visited";
    if (pq.includes(id)) return "frontier";
    return "idle";
  };

  const snap = (
    line: number,
    phase: string,
    current: string | null,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      dist: `{${NODES.map((n) => `${n.id}=${dist[n.id] === Infinity ? "∞" : dist[n.id]}`).join(", ")}}`,
      prev: `{${NODES.map((n) => `${n.id}←${prev[n.id] ?? "–"}`).join(", ")}}`,
      pq: pq.length ? `[${pq.join(", ")}]` : "[]",
      visited: visited.size ? `{${[...visited].sort().join(", ")}}` : "{}",
      current: current ?? "–",
    },
    stack: [`dijkstra(${START})`],
    note,
    why,
    changed,
    path: [...visited],
    index: 0,
    depth: 1,
    graph: {
      nodes: NODES.map((n) => ({ ...n, status: statusOf(n.id, current) })),
      edges: EDGES,
      queue: [...pq],
    },
    output: [...visited],
  });

  states.push(
    snap(2, "INIT", null, `Start ${START}. dist[${START}]=0, all others ∞. PQ=[${START}].`, "Distance to the start is zero; every other node is unreachable until relaxed.", ["dist", "pq"]),
  );

  while (pq.length) {
    // extract min-dist node from pq
    let bestIdx = 0;
    for (let k = 1; k < pq.length; k++) {
      if (dist[pq[k]] < dist[pq[bestIdx]]) bestIdx = k;
    }
    const u = pq.splice(bestIdx, 1)[0];
    if (visited.has(u)) {
      states.push(
        snap(5, "SKIP", u, `${u} already settled (stale PQ entry). Skip.`, "A node can enter the PQ multiple times; only the first extraction settles it.", []),
      );
      continue;
    }
    visited.add(u);
    states.push(
      snap(4, "EXTRACT", u, `Settle ${u} with final dist ${dist[u]}. Shortest path to ${u} is now fixed.`, "Dijkstra extracts the closest unsettled node — its distance is final because all edge weights are non-negative.", ["visited"]),
    );
    for (const e of ADJ[u] || []) {
      const nd = dist[u] + e.w;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        prev[e.to] = u;
        if (!pq.includes(e.to)) pq.push(e.to);
        states.push(
          snap(7, "RELAX", u, `Edge ${u}→${e.to} (w=${e.w}): dist[${e.to}] ∞→${nd} via ${u}. Enqueue ${e.to}.`, `Found a shorter path to ${e.to}; update its estimate and predecessor, then re-prioritize the PQ.`, ["dist", "prev"]),
        );
      } else {
        states.push(
          snap(7, "SKIP", u, `Edge ${u}→${e.to} (w=${e.w}): via ${u} would be ${nd}, not better than ${dist[e.to]}.`, "No improvement — the current best path to ${e.to} already wins.", []),
        );
      }
    }
  }

  const order = [...visited];
  states.push(
    snap(3, "COMPLETE", null, `All reachable nodes settled. Order: ${order.join(" → ")}. Final dist from ${START}: ${NODES.map((n) => `${n.id}=${dist[n.id]}`).join(", ")}.`, "Every settled node's distance is the weight of the shortest path from the start. prev[] rebuilds the paths.", []),
  );
  return states;
}
