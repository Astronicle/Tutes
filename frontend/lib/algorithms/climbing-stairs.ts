import type { ExecState } from "./types";

export const CLIMB_CODE = [
  "int climb(int n) {",
  "  dp[0] = 1; dp[1] = 1;",
  "  for (int i = 2; i <= n; i++) {",
  "    dp[i] = dp[i - 1] + dp[i - 2];",
  "  }",
  "  return dp[n];",
  "}",
];

const N = 5;

export function buildClimbingStairsStates(): ExecState[] {
  const dp: (number | null)[] = new Array(N + 1).fill(null);
  const states: ExecState[] = [];

  const snap = (
    line: number,
    phase: string,
    active: number | null,
    deps: number[],
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      n: String(N),
      i: active === null ? "–" : String(active),
      "dp[i-1]": deps.length > 0 && dp[deps[0]] !== null ? String(dp[deps[0]]) : "–",
      "dp[i-2]": deps.length > 1 && dp[deps[1]] !== null ? String(dp[deps[1]]) : "–",
      "dp[n]": dp[N] === null ? "–" : String(dp[N]),
    },
    stack: ["climb(5)"],
    note,
    why,
    changed,
    path: [],
    index: active ?? 0,
    depth: 1,
    array: dp.map((v, idx) => ({
      value: v === null ? "·" : v,
      state:
        idx === active
          ? ("active" as const)
          : deps.includes(idx)
            ? ("compare" as const)
            : v !== null
              ? ("sorted" as const)
              : ("idle" as const),
    })),
    pointers: { i: active },
    output: [],
  });

  states.push(
    snap(1, "INIT", null, [], `n=${N}. Ways to climb stairs = ways(i-1) + ways(i-2): step 1 or 2 from anywhere.`, "Overlapping subproblems: climb(3) is needed by both climb(4) and climb(5). Memoize instead of recomputing.", ["n"]),
  );

  dp[0] = 1;
  dp[1] = 1;
  states.push(
    snap(2, "BASE", 1, [0], "Base cases: dp[0]=1 (ground), dp[1]=1 (one step). Everything builds on these.", "Zero decisions left means exactly one way: stand still. One stair means one way.", ["dp[i-1]", "dp[i-2]"]),
  );

  for (let i = 2; i <= N; i++) {
    states.push(
      snap(
        4, "READ", i, [i - 1, i - 2],
        `Compute dp[${i}]: read dp[${i - 1}]=${dp[i - 1]} and dp[${i - 2}]=${dp[i - 2]}. Both are already solved (green).`,
        "The recurrence only looks backward. Because we fill left→right, dependencies are always ready — that ordering is the whole trick.",
        ["i", "dp[i-1]", "dp[i-2]"],
      ),
    );
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    states.push(
      snap(
        4, "WRITE", i, [],
        `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Stored — never recomputed.`,
        "Memoization turns the exponential recursion tree into n table writes. Each subproblem solved exactly once: O(n).",
        ["dp[n]"],
      ),
    );
  }

  states.push(
    snap(6, "COMPLETE", null, [], `return dp[${N}] = ${dp[N]}. ${N + 1} cells filled, each in O(1) → O(n) time, O(n) space.`, "Naive recursion re-solves the same subproblems 2ⁿ times. The table remembers, so the work collapses to linear.", []),
  );
  return states;
}
