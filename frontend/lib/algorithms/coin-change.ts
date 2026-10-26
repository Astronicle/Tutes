import type { DPGrid, ExecState } from "./types";

export const COIN_CHANGE_CODE = [
  "int coinChange(coins[1..n], target) {",
  "  for (i = 0..n) dp[i][0] = 0;",
  "  for (a = 1..target) dp[0][a] = ∞;",
  "  for (i = 1..n)",
  "    for (a = 1..target)",
  "      if (coins[i] <= a)",
  "        dp[i][a] = min(dp[i-1][a], 1 + dp[i][a - coins[i]]);",
  "      else",
  "        dp[i][a] = dp[i-1][a];",
  "  return dp[n][target] == ∞ ? -1 : dp[n][target];",
  "}",
];

const COINS = [0, 1, 3, 4]; // index 0 unused
const NAMES = ["∅", "1¢", "3¢", "4¢"];
const TARGET = 6;
const INF = Infinity;

type Cell = "idle" | "done" | "active" | "dep" | "path";

export function buildCoinChangeStates(): ExecState[] {
  const n = 3;
  const val: (number | null)[][] = Array.from({ length: n + 1 }, () => new Array(TARGET + 1).fill(null));
  const st: Cell[][] = Array.from({ length: n + 1 }, () => new Array(TARGET + 1).fill("idle"));
  const arrows: ("" | "↖" | "↑" | "←")[][] = Array.from({ length: n + 1 }, () => new Array(TARGET + 1).fill(""));
  const taken: number[] = [];
  const states: ExecState[] = [];

  const grid = (): DPGrid => ({
    rows: NAMES,
    cols: ["0", "1", "2", "3", "4", "5", "6"],
    values: val.map((r) => r.map((v) => (v === Infinity ? "∞" : v === null ? null : v))),
    states: st.map((r) => r.map((c) => c)),
    arrows: arrows.map((r) => r.map((a) => a)),
    resultLabel: "MIN COINS",
  });

  const snap = (
    line: number,
    phase: string,
    i: number,
    a: number,
    decision: string,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      i: i === 0 ? "–" : `${NAMES[i]}`,
      a: String(a),
      fits: i === 0 ? "–" : COINS[i] <= a ? "yes" : "no",
      decision,
      "dp[n][T]": val[n][TARGET] === null || val[n][TARGET] === Infinity ? "…" : String(val[n][TARGET]),
    },
    stack: ["coinChange()"],
    note,
    why,
    changed,
    path: [],
    index: a,
    depth: 1,
    grid: grid(),
    output: taken.map((c) => `${c}¢`),
  });

  // base cases
  for (let i = 0; i <= n; i++) val[i][0] = 0;
  for (let a = 1; a <= TARGET; a++) val[0][a] = Infinity;

  states.push(
    snap(1, "INIT", 0, 0, "–", `Coins [1,3,4], target ${TARGET}. dp[i][a] = fewest coins using first i coin types to make amount a.`, "Amount 0 needs 0 coins. With no coin types, every positive amount is impossible (∞).", ["i", "a"]),
  );
  states.push(
    snap(2, "BASE", 0, 0, "–", "Row ∅ and column 0 seeded. dp[i][0]=0 for all i; dp[0][a]=∞ for a>0.", "These edges are the subproblem anchors — every other cell derives from them.", ["dp[n][T]"]),
  );

  for (let i = 1; i <= n; i++) {
    for (let a = 1; a <= TARGET; a++) {
      for (let x = 0; x <= n; x++)
        for (let y = 0; y <= TARGET; y++) if (st[x][y] === "active" || st[x][y] === "dep") st[x][y] = "done";
      st[i][a] = "active";
      if (COINS[i] <= a) {
        const skip = val[i - 1][a] as number;
        const take = 1 + (val[i][a - COINS[i]] as number);
        st[i - 1][a] = "dep";
        st[i][a - COINS[i]] = "dep";
        const doTake = take < skip;
        val[i][a] = Math.min(skip, take);
        arrows[i][a] = doTake ? "←" : "↑";
        states.push(
          snap(6, doTake ? "TAKE" : "SKIP", i, a, doTake ? `take ${NAMES[i]}` : "skip", `${NAMES[i]} (${COINS[i]}¢) fits amount ${a}: skip=${skip} (↑) vs take=1+dp[${i}][${a - COINS[i]}]=${take} (←) → dp[${i}][${a}]=${val[i][a]}.`, doTake ? `Using ${NAMES[i]} plus the best way to make the remaining ${a - COINS[i]}¢ beats doing without it.` : `Skipping ${NAMES[i]} keeps the count lower; carry the value from the row above.`, ["i", "a", "decision"]),
        );
      } else {
        st[i - 1][a] = "dep";
        val[i][a] = val[i - 1][a];
        arrows[i][a] = "↑";
        states.push(
          snap(7, "TOO BIG", i, a, "skip", `${NAMES[i]} (${COINS[i]}¢) exceeds amount ${a} → dp[${i}][${a}] = dp[${i - 1}][${a}] = ${val[i][a]}.`, "The coin cannot contribute to this amount; inherit the best from previous coin types.", ["i", "a", "fits"]),
        );
      }
    }
  }

  for (let x = 0; x <= n; x++)
    for (let y = 0; y <= TARGET; y++) if (st[x][y] === "active" || st[x][y] === "dep") st[x][y] = "done";
  states.push(
    snap(8, "TRACE", n, TARGET, "–", `Table complete: fewest coins for ${TARGET}¢ = dp[${n}][${TARGET}] = ${val[n][TARGET] as number}. Walk back to recover the coins.`, "A finite value means the amount is reachable; ∞ means impossible. Follow ↑/← arrows to see which coins were used.", ["dp[n][T]"]),
  );

  let ci = n;
  let ca = TARGET;
  while (ci > 0) {
    st[ci][ca] = "path";
    if (val[ci][ca] !== val[ci - 1][ca]) {
      taken.unshift(COINS[ci]);
      states.push(
        snap(8, "TAKE", ci, ca, `take ${NAMES[ci]}`, `dp[${ci}][${ca}] changed from the row above → ${NAMES[ci]} (${COINS[ci]}¢) was used. Remaining ${ca} → ${ca - COINS[ci]}. Coins [${taken.join(", ")}¢].`, "The value dropped when this coin type became available, so it appears in the optimum. Subtract its value and stay on the same row.", ["decision"]),
      );
      ca -= COINS[ci];
    } else {
      states.push(
        snap(8, "SKIP", ci, ca, "skip", `dp[${ci}][${ca}] == dp[${ci - 1}][${ca}]: ${NAMES[ci]} adds nothing. Move ↑.`, "Equal across rows means this coin type was never needed for this amount.", ["decision"]),
      );
      ci--;
    }
  }
  states.push(
    snap(8, "COMPLETE", 0, 0, "–", `Optimum ${val[n][TARGET] as number} coins for ${TARGET}¢: [${taken.map((c) => `${c}¢`).join(", ")}]. n·target cells, each O(1) → O(n·target).`, "Unbounded coin change: the same coin type can be reused, which is why take reads from the same row (dp[i][a - coin]).", []),
  );
  return states;
}
