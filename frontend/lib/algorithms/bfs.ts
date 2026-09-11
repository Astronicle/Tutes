import type { ExecState, GraphNodeState, GraphEdge } from "./types";

export const BFS_CODE = [
  "void bfs(Node start) {",
  "  Queue q = [start]; visited = {start};",
  "  while (!q.isEmpty()) {",
  "    Node u = q.dequeue();",
  "    for (Node v : u.neighbors())",
  "      if (!visited.contains(v)) {",
  "        visited.add(v); q.enqueue(v);",
  "      }",
  "  }",
  "}",
];

const NODES: GraphNodeState[] = [
  { id: "A", x: 50, y: 12, status: "idle" },
  { id: "B", x: 22, y: 38, status: "idle" },
  { id: "C", x: 78, y: 38, status: "idle" },
  { id: "D", x: 14, y: 72, status: "idle" },
  { id: "E", x: 46, y: 72, status: "idle" },
  { id: "F", x: 82, y: 72, status: "idle" },
];

const EDGES: GraphEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "F" },
  { from: "E", to: "F" },
];

const ADJ: Record<string, string[]> = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};

export function buildBfsStates(): ExecState[] {
  const states: ExecState[] = [];
  const visited = new Set<string>();
  const queue: string[] = [];

  const statusOf = (id: string, current: string | null): GraphNodeState["status"] => {
    if (id === current) return "current";
    if (visited.has(id)) return queue.includes(id) ? "frontier" : "visited";
    if (queue.includes(id)) return "frontier";
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
      queue: queue.length ? `[${queue.join(", ")}]` : "[]",
      visited: visited.size ? `{${[...visited].join(", ")}}` : "{}",
      current: current ?? "–",
    },
    stack: ["bfs(A)"],
    note,
    why,
    changed,
    path: [...visited],
    index: 0,
    depth: 1,
    tree: undefined,
    pointers: {},
    graph: {
      nodes: NODES.map((n) => ({ ...n, status: statusOf(n.id, current) })),
      edges: EDGES,
      queue: [...queue],
    },
    output: [...visited],
  });

  queue.push("A");
  visited.add("A");
  states.push(snap(2, "INIT", null, "start=A. queue=[A], visited={A}.", "BFS seeds the queue with the start node. The queue is the frontier.", ["queue"]));

  while (queue.length) {
    const u = queue.shift()!;
    states.push(snap(4, "DEQUEUE", u, `Dequeue ${u}. Explore its neighbors: ${(ADJ[u] || []).join(", ") || "—"}.`, "The queue makes it breadth-first: oldest frontier node first.", ["queue"]));
    for (const v of ADJ[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        states.push(snap(7, "DISCOVER", v, `First time seeing ${v} via ${u}. visited+={${v}}, enqueue ${v}.`, `Edge ${u}→${v} is a tree edge. ${v} joins the frontier exactly once.`, ["visited"]));
      } else {
        states.push(snap(6, "SKIP", v, `${v} already visited — ignore edge ${u}→${v}.`, "BFS never re-enqueues. That is what keeps it O(V+E).", []));
      }
    }
  }
  states.push(snap(3, "COMPLETE", null, `Queue empty. Visit order: ${[...visited].join(" → ")}.`, "Every reachable node was dequeued once, level by level. That order is the BFS guarantee.", []));
  return states;
}
