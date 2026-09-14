import type { DPGrid, ExecState } from "./types";

export const LCS_CODE = [
  "int lcs(X[1..m], Y[1..n]) {",
  "  for (i = 0..m) dp[i][0] = 0;",
  "  for (j = 0..n) dp[0][j] = 0;",
  "  for (i = 1..m)",
  "    for (j = 1..n)",
  "      if (X[i] == Y[j]) dp[i][j] = dp[i-1][j-1] + 1;",
  "      else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);",
  "  return traceback(dp);",
  "}",
];

const X = "ABCDGH";
const Y = "AEDFHR";

type Cell = "idle" | "done" | "active" | "dep" | "path";

export function buildLcsStates(): ExecState[] {
  const m = X.length;
  const n = Y.length;
  const val: (number | null)[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));
  const st: Cell[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill("idle"));
  const arrows: ("" | "↖" | "↑" | "←")[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(""));
  const found: string[] = [];

  const states: ExecState[] = [];
  const grid = (): DPGrid => ({
    rows: ["∅", ...X.split("")],
    cols: ["∅", ...Y.split("")],
    values: val.map((r) => r.map((v) => v)),
    states: st.map((r) => r.map((c) => c)),
    arrows: arrows.map((r) => r.map((a) => a)),
    resultLabel: "LCS",
  });

  const snap = (
    line: number,
    phase: string,
    i: number,
    j: number,
    match: string,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      i: String(i),
      j: String(j),
      "X[i]": i === 0 ? "–" : X[i - 1],
      "Y[j]": j === 0 ? "–" : Y[j - 1],
      match,
      "dp[m][n]": val[m][n] === null ? "…" : String(val[m][n]),
    },
    stack: ["lcs()"],
    note,
    why,
    changed,
    path: [],
    index: j,
    depth: 1,
    grid: grid(),
    output: [...found],
  });

  states.push(
    snap(1, "INIT", 0, 0, "–", `X=${X} (m=${m}), Y=${Y} (n=${n}). dp[i][j] will hold LCS length of prefixes X[:i], Y[:j].`, "Every cell depends only on cells above/left — so row-by-row fill order guarantees dependencies are ready.", ["i", "j"]),
  );

  for (let i = 0; i <= m; i++) {
    val[i][0] = 0;
    st[i][0] = "done";
  }
  for (let j = 0; j <= n; j++) {
    val[0][j] = 0;
    st[0][j] = "done";
  }
  states.push(
    snap(3, "BASE", 0, 0, "–", "First row and column are 0: an empty prefix shares nothing with anything.", "Base cases seed the table edges. Everything else derives from them.", ["dp[m][n]"]),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = X[i - 1] === Y[j - 1];
      // reset transient highlights
      for (let a = 0; a <= m; a++)
        for (let b = 0; b <= n; b++) if (st[a][b] === "active" || st[a][b] === "dep") st[a][b] = "done";
      if (match) {
        st[i][j] = "active";
        st[i - 1][j - 1] = "dep";
        val[i][j] = (val[i - 1][j - 1] as number) + 1;
        arrows[i][j] = "↖";
        states.push(
          snap(6, "MATCH", i, j, "✓", `X[${i}]=${X[i - 1]} == Y[${j}]=${Y[j - 1]} → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${val[i][j]}.`, "A matching pair extends the best alignment of the shorter prefixes by exactly one. The ↖ arrow records that decision.", ["X[i]", "Y[j]", "match"]),
        );
      } else {
        st[i][j] = "active";
        st[i - 1][j] = "dep";
        st[i][j - 1] = "dep";
        const up = val[i - 1][j] as number;
        const left = val[i][j - 1] as number;
        val[i][j] = Math.max(up, left);
        arrows[i][j] = up >= left ? "↑" : "←";
        states.push(
          snap(7, "SKIP", i, j, "✗", `X[${i}]=${X[i - 1]} ≠ Y[${j}]=${Y[j - 1]} → dp[${i}][${j}] = max(${up}, ${left}) = ${val[i][j]} (from ${arrows[i][j]}).`, "Mismatch: at least one char must be skipped. Inherit the better of dropping X[i] (↑) or Y[j] (←).", ["X[i]", "Y[j]", "match"]),
        );
      }
    }
  }

  // traceback walk
  let ti = m;
  let tj = n;
  // clear transient
  for (let a = 0; a <= m; a++)
    for (let b = 0; b <= n; b++) if (st[a][b] === "active" || st[a][b] === "dep") st[a][b] = "done";
  states.push(
    snap(8, "TRACE", ti, tj, "–", `Table complete: LCS length = dp[${m}][${n}] = ${val[m][n]}. Now follow the arrows back from the corner.`, "The value tells the length; the arrows tell the alignment. Traceback reconstructs one optimal subsequence.", ["dp[m][n]"]),
  );
  while (ti > 0 && tj > 0) {
    st[ti][tj] = "path";
    if (X[ti - 1] === Y[tj - 1]) {
      found.unshift(X[ti - 1]);
      states.push(
        snap(8, "TAKE", ti, tj, "✓", `Match at (${ti},${tj}): take '${X[ti - 1]}' → LCS so far [${found.join(" ")}]. Move ↖.`, "Diagonal steps on matches spell the subsequence in reverse.", ["match"]),
      );
      ti--;
      tj--;
    } else if ((val[ti - 1][tj] as number) >= (val[ti][tj - 1] as number)) {
      states.push(
        snap(8, "MOVE", ti, tj, "✗", `Mismatch at (${ti},${tj}): ↑ wins, skip X[${ti}]. Follow the arrow.`, "Traceback inverts the recurrence: go where the value came from.", []),
      );
      ti--;
    } else {
      states.push(
        snap(8, "MOVE", ti, tj, "✗", `Mismatch at (${ti},${tj}): ← wins, skip Y[${tj}]. Follow the arrow.`, "Traceback inverts the recurrence: go where the value came from.", []),
      );
      tj--;
    }
  }
  st[ti][tj] = "path";
  states.push(
    snap(8, "COMPLETE", 0, 0, "–", `LCS(${X}, ${Y}) = [${found.join(" ")}], length ${found.length}. ${m * n} cells, each O(1) → O(m·n) time and space.`, "The table holds every prefix answer; the green path holds the alignment. That is dynamic programming: solve small, reuse everywhere.", []),
  );
  return states;
}
