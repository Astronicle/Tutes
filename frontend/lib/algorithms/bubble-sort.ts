import type { ExecState } from "./types";

export const BUBBLE_SORT_CODE = [
  "void sort(int[] a) {",
  "  for (int i = 0; i < n - 1; i++) {",
  "    for (int j = 0; j < n - 1 - i; j++) {",
  "      if (a[j] > a[j + 1]) swap(a, j, j + 1);",
  "    }",
  "    // largest of unsorted is now at the end",
  "  }",
  "}",
];

export function buildBubbleSortStates(): ExecState[] {
  const init = [7, 2, 5, 1, 4];
  const a = [...init];
  const n = a.length;
  const states: ExecState[] = [];

  const snap = (
    line: number,
    phase: string,
    j: number | null,
    sortedFrom: number,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: { i: String(outer), j: j === null ? "–" : String(j), pass: `${outer + 1}/${n - 1}` },
    stack: [`sort()`, `pass(i=${outer})`],
    note,
    why,
    changed,
    path: [],
    index: j ?? 0,
    depth: 2,
    array: a.map((v, i) => ({
      value: v,
      state:
        j !== null && (i === j || i === j + 1)
          ? ("compare" as const)
          : i >= sortedFrom
            ? ("sorted" as const)
            : ("idle" as const),
    })),
    pointers: { j },
    output: [],
  });

  let outer = 0;
  states.push({
    step: 0,
    line: 1,
    phase: "INIT",
    vars: { i: "0", j: "–", pass: `1/${n - 1}` },
    stack: ["sort()"],
    note: `Input [${init.join(", ")}]. Bubble sort sinks the largest unsorted value to the end each pass.`,
    why: "Adjacent comparisons bubble large values rightward. After pass i, the last i elements are final.",
    path: [],
    index: 0,
    depth: 1,
    array: a.map((v) => ({ value: v, state: "idle" as const })),
    pointers: { j: null },
    output: [],
  });

  for (outer = 0; outer < n - 1; outer++) {
    const sortedFrom = n - 1 - outer;
    for (let j = 0; j < n - 1 - outer; j++) {
      if (a[j] > a[j + 1]) {
        states.push(snap(4, "COMPARE", j, sortedFrom, `a[${j}]=${a[j]} > a[${j + 1}]=${a[j + 1]} → swap.`, "An inversion: the pair is out of order, so exchange them.", ["j"]));
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        states.push(snap(4, "SWAP", j, sortedFrom, `Swapped → [${a.join(", ")}].`, "The larger value moves one slot right. Small moves, repeated, sort the array.", ["j"]));
      } else {
        states.push(snap(4, "COMPARE", j, sortedFrom, `a[${j}]=${a[j]} ≤ a[${j + 1}]=${a[j + 1]} → keep.`, "Already ordered — no swap needed, advance j.", ["j"]));
      }
    }
    states.push(snap(6, "PASS DONE", null, n - outer - 1, `End of pass ${outer + 1}. a[${n - 1 - outer}] is locked.`, "The largest unsorted element has bubbled to its final position.", ["i"]));
  }
  states.push(snap(1, "COMPLETE", null, 0, `Sorted → [${a.join(", ")}] in ${states.length} steps. O(n²) worst case.`, "n−1 passes, each shorter than the last. Simple but quadratic.", []));
  return states;
}
