import type { ExecState, GraphEdge, GraphNodeState } from "./types";

export const DFS_CODE = [
  "void dfs(Node u) {",
  "  visited.add(u);",
  "  for (Node v : u.neighbors())",
  "    if (!visited.contains(v))",
  "      dfs(v);",
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

const START = "A";

export function buildDfsStates(): ExecState[] {
  const states: ExecState[] = [];
  const visited = new Set<string>();
  const order: string[] = [];
  const stack: string[] = [];

  const statusOf = (id: string, current: string | null): GraphNodeState["status"] => {
    if (id === current) return "current";
    if (visited.has(id)) return stack.includes(id) ? "frontier" : "visited";
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
      current: current ?? "–",
      visited: visited.size ? `{${[...visited].join(", ")}}` : "{}",
      "call depth": String(stack.length),
    },
    stack: stack.map((id) => `dfs(${id})`),
    note,
    why,
    changed,
    path: [...order],
    index: 0,
    depth: stack.length,
    graph: {
      nodes: NODES.map((n) => ({ ...n, status: statusOf(n.id, current) })),
      edges: EDGES,
      queue: [...stack],
      queueLabel: "CALL STACK",
    },
    output: [...order],
  });

  states.push(
    snap(
      1,
      "INIT",
      null,
      `Start at ${START}. visited={} and the call stack is empty.`,
      "DFS follows one branch as far as possible, using recursion (a stack) to remember where it came from.",
    ),
  );

  function dfs(u: string) {
    visited.add(u);
    order.push(u);
    stack.push(u);
    states.push(
      snap(
        2,
        "VISIT",
        u,
        `Enter dfs(${u}) and mark ${u} visited. Visit order so far: ${order.join(" → ")}.`,
        `The first thing a DFS call does is claim its node, so no other branch will visit ${u} again.`,
        ["visited", "current"],
      ),
    );

    for (const v of ADJ[u] || []) {
      if (!visited.has(v)) {
        states.push(
          snap(
            4,
            "DESCEND",
            u,
            `${u}'s neighbor ${v} is unvisited → call dfs(${v}) before looking at the rest of ${u}'s neighbors.`,
            "This is the depth-first rule: take the first unvisited edge and go deeper immediately instead of queueing the neighbor for later.",
            ["current"],
          ),
        );
        dfs(v);
        states.push(
          snap(
            5,
            "RETURN",
            u,
            `dfs(${v}) returned. Continue scanning ${u}'s remaining neighbors.`,
            "When the deeper call finishes, control comes back to this frame and the loop continues where it left off.",
            ["current"],
          ),
        );
      } else {
        states.push(
          snap(
            3,
            "SKIP",
            u,
            `Neighbor ${v} is already visited → do not recurse into it.`,
            "Without this check, a cycle would send DFS into infinite recursion. The visited set makes every node cost one visit.",
          ),
        );
      }
    }

    stack.pop();
    const parent = stack.length ? stack[stack.length - 1] : null;
    states.push(
      snap(
        6,
        "BACKTRACK",
        parent,
        `${u} has no unvisited neighbors left → return from dfs(${u}).${parent ? ` Back in ${parent}.` : ""}`,
        "A dead end forces a backtrack. Recursion unwinds to the nearest frame that still has an unexplored neighbor.",
        ["current", "call depth"],
      ),
    );
  }

  dfs(START);

  states.push(
    snap(
      1,
      "COMPLETE",
      null,
      `All reachable nodes visited: ${order.join(" → ")}. Every node was entered once and every edge checked once → O(V + E).`,
      "DFS goes deep first, so its visit order is not level-by-level and the first route it finds is not necessarily the shortest. BFS gives shortest paths instead.",
    ),
  );

  return states;
}
