import type { DPGrid, ExecState } from "./types";

export const KNAPSACK_CODE = [
  "int knapsack(wt[1..n], val[1..n], W) {",
  "  for (i = 0..n) dp[i][0] = 0;",
  "  for (w = 0..W) dp[0][w] = 0;",
  "  for (i = 1..n)",
  "    for (w = 1..W)",
  "      if (wt[i] <= w) dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]]);",
  "      else dp[i][w] = dp[i-1][w];",
  "  return traceback(dp);",
  "}",
];

// 1-indexed; index 0 unused
const WT = [0, 2, 3, 4];
const VAL = [0, 3, 4, 5];
const NAMES = ["∅", "A", "B", "C"];
const W = 5;

type Cell = "idle" | "done" | "active" | "dep" | "path";

export function buildKnapsackStates(): ExecState[] {
  const n = 3;
  const val: (number | null)[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(null));
  const st: Cell[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill("idle"));
  const arrows: ("" | "↖" | "↑" | "←")[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(""));
  const taken: string[] = [];
  const states: ExecState[] = [];

  const grid = (): DPGrid => ({
    rows: NAMES.map((nm, i) => (i === 0 ? "∅" : `${nm}·${WT[i]}`)),
    cols: ["0", "1", "2", "3", "4", "5"],
    values: val.map((r) => r.map((v) => v)),
    states: st.map((r) => r.map((c) => c)),
    arrows: arrows.map((r) => r.map((a) => a)),
    resultLabel: "MAX",
  });

  const snap = (
    line: number,
    phase: string,
    i: number,
    w: number,
    decision: string,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      i: i === 0 ? "–" : `${NAMES[i]} (w=${WT[i]}, v=${VAL[i]})`,
      w: String(w),
      fits: i === 0 ? "–" : WT[i] <= w ? "yes" : "no",
      decision,
      "dp[n][W]": val[n][W] === null ? "…" : String(val[n][W]),
    },
    stack: ["knapsack()"],
    note,
    why,
    changed,
    path: [],
    index: w,
    depth: 1,
    grid: grid(),
    output: [...taken],
  });

  const items = NAMES.slice(1).map((nm, k) => `${nm}(w${WT[k + 1]},v${VAL[k + 1]})`).join(" ");
  states.push(
    snap(1, "INIT", 0, 0, "–", `Items ${items}, capacity W=${W}. dp[i][w] = best value using first i items with capacity w.`, "Knapsack is choice + capacity: each item is taken at most once, and every capacity 0..W gets its own column.", ["i", "w"]),
  );

  for (let i = 0; i <= n; i++) {
    val[i][0] = 0;
    st[i][0] = "done";
  }
  for (let w = 0; w <= W; w++) {
    val[0][w] = 0;
    st[0][w] = "done";
  }
  states.push(
    snap(3, "BASE", 0, 0, "–", "Column 0 and row ∅ are 0: no capacity or no items means no value.", "Edges seeded. The inner table now decides take-vs-skip for every (item, capacity) pair.", ["dp[n][W]"]),
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      for (let a = 0; a <= n; a++)
        for (let b = 0; b <= W; b++) if (st[a][b] === "active" || st[a][b] === "dep") st[a][b] = "done";
      st[i][w] = "active";
      if (WT[i] <= w) {
        const skip = val[i - 1][w] as number;
        const take = VAL[i] + (val[i - 1][w - WT[i]] as number);
        st[i - 1][w] = "dep";
        st[i - 1][w - WT[i]] = "dep";
        val[i][w] = Math.max(skip, take);
        const doTake = take > skip;
        arrows[i][w] = doTake ? "↖" : "↑";
        states.push(
          snap(6, doTake ? "TAKE" : "SKIP", i, w, doTake ? `take ${NAMES[i]}` : "skip", `${NAMES[i]} fits (wt ${WT[i]} ≤ ${w}): skip=${skip} (↑) vs take=${VAL[i]}+${val[i - 1][w - WT[i]]}=${take} (↖) → dp[${i}][${w}]=${val[i][w]}.`, doTake ? `Taking ${NAMES[i]} pays more: its value plus the best fill of the remaining ${w - WT[i]} capacity beats skipping it.` : `Skipping wins: ${NAMES[i]}'s value doesn't compensate for the capacity it eats. Carry the value from above.`, ["i", "w", "decision"]),
        );
      } else {
        st[i - 1][w] = "dep";
        val[i][w] = val[i - 1][w];
        arrows[i][w] = "↑";
        states.push(
          snap(7, "TOO HEAVY", i, w, "skip", `${NAMES[i]} (wt ${WT[i]}) doesn't fit in capacity ${w} → dp[${i}][${w}] = dp[${i - 1}][${w}] = ${val[i][w]}.`, "No choice exists when the item overflows the knapsack: the cell inherits from above.", ["i", "w", "fits"]),
        );
      }
    }
  }

  for (let a = 0; a <= n; a++)
    for (let b = 0; b <= W; b++) if (st[a][b] === "active" || st[a][b] === "dep") st[a][b] = "done";
  states.push(
    snap(8, "TRACE", n, W, "–", `Table complete: max value = dp[${n}][${W}] = ${val[n][W]}. Walk back up to see which items earn it.`, "Values flow upward through ↑/↖ arrows. Traceback follows them from the bottom-right corner.", ["dp[n][W]"]),
  );

  let ci = n;
  let cw = W;
  while (ci > 0) {
    st[ci][cw] = "path";
    if (val[ci][cw] !== val[ci - 1][cw]) {
      taken.unshift(`${NAMES[ci]}(v${VAL[ci]})`);
      states.push(
        snap(8, "PACK", ci, cw, `take ${NAMES[ci]}`, `dp[${ci}][${cw}] ≠ dp[${ci - 1}][${cw}]: ${NAMES[ci]} was taken. Pack it, capacity ${cw} → ${cw - WT[ci]}. Taken [${taken.join(" ")}].`, `The value changed between rows, so item ${NAMES[ci]} contributes. Remove its weight and keep tracing.`, ["decision"]),
      );
      cw -= WT[ci];
      ci--;
    } else {
      states.push(
        snap(8, "LEAVE", ci, cw, "skip", `dp[${ci}][${cw}] == dp[${ci - 1}][${cw}]: ${NAMES[ci]} adds nothing. Leave it, move ↑.`, "Equal values across rows mean the item was skipped — the optimum never used it.", ["decision"]),
      );
      ci--;
    }
  }
  states.push(
    snap(8, "COMPLETE", 0, 0, "–", `Optimum ${val[n][W]} from [${taken.join(" ")}]. ${n * W} cells, each O(1) → O(n·W) time and space.`, "Pseudo-polynomial: fast in n and W, exponential only if W itself is astronomically large. The green path is the packing.", []),
  );
  return states;
}
