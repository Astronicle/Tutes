import type { ExecState } from "./types";

export const MERGE_SORT_CODE = [
  "void sort(int lo, int hi) {",
  "  if (lo >= hi) return;",
  "  int mid = (lo + hi) / 2;",
  "  sort(lo, mid);",
  "  sort(mid + 1, hi);",
  "  merge(lo, mid, hi);",
  "}",
  "void merge(int lo, int mid, int hi) {",
  "  int[] tmp = new int[hi - lo + 1];",
  "  int i = lo, j = mid + 1, k = 0;",
  "  while (i <= mid && j <= hi)",
  "    if (a[i] <= a[j]) tmp[k++] = a[i++];",
  "    else tmp[k++] = a[j++];",
  "  while (i <= mid) tmp[k++] = a[i++];",
  "  while (j <= hi) tmp[k++] = a[j++];",
  "  copy tmp back into a[lo..hi];",
  "}",
];

const INIT = [5, 2, 4, 1];

export function buildMergeSortStates(): ExecState[] {
  const a = [...INIT];
  const n = a.length;
  const done: boolean[] = new Array(n).fill(false);
  const states: ExecState[] = [];

  const snap = (
    line: number,
    phase: string,
    lo: number,
    hi: number,
    mid: number | null,
    left: number | null,
    right: number | null,
    mergedTo: number | null,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      lo: String(lo),
      hi: String(hi),
      mid: mid === null ? "–" : String(mid),
      left: left === null ? "–" : `${left} (${a[left]})`,
      right: right === null ? "–" : `${right} (${a[right]})`,
      range: `[${a.slice(Math.max(lo, 0), hi + 1).join(", ")}]`,
    },
    stack: [],
    note,
    why,
    changed,
    path: [],
    index: left ?? lo,
    depth: 1,
    array: a.map((v, idx) => ({
      value: v,
      state:
        mergedTo !== null && idx >= lo && idx <= mergedTo
          ? ("sorted" as const)
          : idx === left || idx === right
            ? ("compare" as const)
            : idx >= lo && idx <= hi
              ? ("active" as const)
              : done[idx]
                ? ("sorted" as const)
                : ("idle" as const),
    })),
    pointers: { lo, hi, mid, left, right },
    output: [],
  });

  states.push({
    step: 0,
    line: 1,
    phase: "INIT",
    vars: {
      lo: "0",
      hi: String(n - 1),
      mid: "–",
      left: "–",
      right: "–",
      range: `[${a.join(", ")}]`,
    },
    stack: [],
    note: `Input [${INIT.join(", ")}]. Merge sort splits the array in half until each piece has one element, then merges the pieces back in order.`,
    why: "A one-element array is already sorted. Merging two sorted arrays is cheap: repeatedly copy the smaller front element.",
    path: [],
    index: 0,
    depth: 0,
    array: INIT.map((v) => ({ value: v, state: "idle" as const })),
    pointers: { lo: 0, hi: n - 1, mid: null, left: null, right: null },
    output: [],
  });

  function markDone(lo: number, hi: number) {
    for (let k = lo; k <= hi; k++) done[k] = true;
  }

  function sort(lo: number, hi: number, stack: string[]) {
    const call = `sort(${lo},${hi})`;
    const newStack = [...stack, call];

    if (lo >= hi) {
      markDone(lo, hi);
      const s = snap(
        2,
        "BASE",
        lo,
        hi,
        null,
        null,
        null,
        hi,
        `${call}: a range of ${hi - lo + 1} element${hi - lo === 0 ? "" : "s"} [${a.slice(lo, hi + 1).join(", ")}] is already sorted. Return.`,
        "With zero or one element there is nothing to compare, so this is where the recursion stops.",
        ["lo", "hi"],
      );
      s.stack = newStack;
      s.depth = newStack.length;
      states.push(s);
      return;
    }

    const mid = Math.floor((lo + hi) / 2);
    const split = snap(
      3,
      "SPLIT",
      lo,
      hi,
      mid,
      null,
      null,
      null,
      `${call}: split [${lo}..${hi}] at mid=${mid} into [${lo}..${mid}] and [${mid + 1}..${hi}].`,
      "Sorting two half-size ranges is a smaller version of the same problem. Recursion keeps halving until the base case.",
      ["lo", "hi", "mid"],
    );
    split.stack = newStack;
    split.depth = newStack.length;
    states.push(split);

    sort(lo, mid, newStack);
    sort(mid + 1, hi, newStack);

    merge(lo, mid, hi, newStack);
  }

  function merge(lo: number, mid: number, hi: number, stack: string[]) {
    const leftRun = a.slice(lo, mid + 1);
    const rightRun = a.slice(mid + 1, hi + 1);

    const start = snap(
      8,
      "MERGE",
      lo,
      hi,
      mid,
      lo,
      mid + 1,
      lo - 1,
      `Merge sorted halves [${leftRun.join(", ")}] and [${rightRun.join(", ")}]. Compare their fronts and write the smaller one next.`,
      "Both halves are already sorted, so the smallest remaining value must be at one of the two fronts. That lets us build the merged run with a single left-to-right pass.",
      ["lo", "hi", "mid"],
    );
    start.stack = stack;
    start.depth = stack.length;
    states.push(start);

    let i = lo;
    let j = mid + 1;
    let k = lo;

    while (i <= mid && j <= hi) {
      const compare = snap(
        11,
        "COMPARE",
        lo,
        hi,
        mid,
        i,
        j,
        k - 1,
        `Compare a[${i}]=${a[i]} with a[${j}]=${a[j]}.`,
        "Take the smaller front value so the merged output stays sorted. Ties keep the left value first, which makes the sort stable.",
        ["left", "right"],
      );
      compare.stack = stack;
      compare.depth = stack.length;
      states.push(compare);

      if (a[i] <= a[j]) {
        a[k] = a[i];
        i++;
      } else {
        a[k] = a[j];
        j++;
      }
      k++;

      const write = snap(
        12,
        "WRITE",
        lo,
        hi,
        mid,
        i <= mid ? i : null,
        j <= hi ? j : null,
        k - 1,
        `Wrote ${a[k - 1]} at index ${k - 1}. Merged so far: [${a.slice(lo, k).join(", ")}].`,
        "The written value can never move again inside this merge: every value still waiting is at least as large.",
        ["left", "right"],
      );
      write.stack = stack;
      write.depth = stack.length;
      states.push(write);
    }

    while (i <= mid) {
      a[k] = a[i];
      i++;
      k++;
      const copy = snap(
        14,
        "COPY LEFT",
        lo,
        hi,
        mid,
        i <= mid ? i : null,
        null,
        k - 1,
        `Right half is empty. Copy the remaining left value ${a[k - 1]} to index ${k - 1}.`,
        "No comparison is needed: everything left in the sorted left run is already larger than what has been written, so it goes next.",
        ["left"],
      );
      copy.stack = stack;
      copy.depth = stack.length;
      states.push(copy);
    }

    while (j <= hi) {
      a[k] = a[j];
      j++;
      k++;
      const copy = snap(
        15,
        "COPY RIGHT",
        lo,
        hi,
        mid,
        null,
        j <= hi ? j : null,
        k - 1,
        `Left half is empty. Copy the remaining right value ${a[k - 1]} to index ${k - 1}.`,
        "Everything left in the sorted right run is already larger than what has been written, so it goes next without a comparison.",
        ["right"],
      );
      copy.stack = stack;
      copy.depth = stack.length;
      states.push(copy);
    }

    markDone(lo, hi);
    const finish = snap(
      16,
      "MERGED",
      lo,
      hi,
      mid,
      null,
      null,
      hi,
      `Merged [${lo}..${hi}] → [${a.slice(lo, hi + 1).join(", ")}]. This run is now sorted and ready to be merged higher up.`,
      "The two smaller sorted runs were combined into one larger sorted run. The base cases plus this step sort the whole array.",
      ["lo", "hi"],
    );
    finish.stack = stack;
    finish.depth = stack.length;
    states.push(finish);
  }

  sort(0, n - 1, []);

  states.push({
    step: states.length,
    line: 1,
    phase: "COMPLETE",
    vars: {
      lo: "–",
      hi: "–",
      mid: "–",
      left: "–",
      right: "–",
      range: `[${a.join(", ")}]`,
    },
    stack: [],
    note: `Sorted → [${a.join(", ")}]. Depth log₂ n, and each level merges n items: O(n log n) time, O(n) extra space for tmp.`,
    why: "Halving always produces balanced splits, so there are about log₂ n levels. Every level touches each element once during merging, giving n log n comparisons even in the worst case.",
    path: [],
    index: n - 1,
    depth: 0,
    array: a.map((v) => ({ value: v, state: "sorted" as const })),
    pointers: { lo: null, hi: null, mid: null, left: null, right: null },
    output: [],
  });

  return states;
}
