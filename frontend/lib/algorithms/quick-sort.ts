import type { ExecState } from "./types";

export const QUICK_SORT_CODE = [
  "void sort(int[] a, int lo, int hi) {",
  "  if (lo >= hi) return;",
  "  int p = partition(a, lo, hi);",
  "  sort(a, lo, p - 1);",
  "  sort(a, p + 1, hi);",
  "}",
  "int partition(int[] a, int lo, int hi) {",
  "  int pivot = a[hi];",
  "  int i = lo;",
  "  for (int j = lo; j < hi; j++) {",
  "    if (a[j] <= pivot) swap(a, i++ , j);",
  "  }",
  "  swap(a, i, hi);",
  "  return i;",
  "}",
];

const INIT = [8, 3, 7, 1, 6];

export function buildQuickSortStates(): ExecState[] {
  const states: ExecState[] = [];
  const a = [...INIT];
  const n = a.length;

  const snap = (
    line: number,
    phase: string,
    lo: number | null,
    hi: number | null,
    i: number | null,
    j: number | null,
    pivotIdx: number | null,
    sortedFrom: number,
    note: string,
    why: string,
    changed?: string[],
  ): ExecState => ({
    step: states.length,
    line,
    phase,
    vars: {
      lo: lo === null ? "–" : String(lo),
      hi: hi === null ? "–" : String(hi),
      i: i === null ? "–" : String(i),
      j: j === null ? "–" : String(j),
      pivot: pivotIdx === null ? "–" : String(a[pivotIdx]),
      pass: `${states.length}`,
    },
    stack: [`sort(${lo ?? "?"},${hi ?? "?"})`],
    note,
    why,
    changed,
    path: [],
    index: j ?? 0,
    depth: 2,
    array: a.map((v, idx) => ({
      value: v,
      state:
        idx >= sortedFrom
          ? ("sorted" as const)
          : j !== null && (idx === j || idx === (i ?? -1))
            ? ("compare" as const)
            : idx === pivotIdx
              ? ("active" as const)
              : ("idle" as const),
    })),
    pointers: { lo: lo ?? null, hi: hi ?? null, i: i ?? null, j: j ?? null },
    output: [],
  });

  states.push(
    snap(1, "INIT", 0, n - 1, null, null, n - 1, 0, `Input [${INIT.join(", ")}]. Quicksort picks a pivot, partitions around it, then recurses on both sides.`, "Divide and conquer: one pass places the pivot in its final sorted spot; everything left is smaller, everything right is larger.", ["lo", "hi"]),
  );

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      states.push(
        snap(2, "BASE", lo, hi, null, null, null, hi + 1, `sort(${lo},${hi}) is empty or a single element — already sorted.`, "A range of size 0 or 1 needs no work; it is a leaf of the recursion tree.", ["lo", "hi"]),
      );
      return;
    }
    states.push(
      snap(1, "ENTER", lo, hi, null, null, hi, hi, `Enter sort(${lo},${hi}). Pivot = a[${hi}] = ${a[hi]}.`, "Each recursive call narrows the range until it is trivial.", ["lo", "hi"]),
    );
    const p = partition(lo, hi);
    states.push(
      snap(3, "PIVOT PLACED", lo, hi, null, null, p, p + 1, `Pivot ${a[p]} now sits at index ${p} — its final sorted position. Left side < pivot, right side > pivot.`, "Partitioning guarantees the pivot never moves again; only the two subranges still need sorting.", ["i"]),
    );
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  function partition(lo: number, hi: number): number {
    const pivot = a[hi];
    let i = lo;
    states.push(
      snap(7, "PARTITION", lo, hi, i, lo, hi, lo, `partition(${lo},${hi}): pivot=${pivot} at a[${hi}]. i=${lo} marks the boundary of values ≤ pivot.`, "i tracks where the next small value should go. Everything left of i is ≤ pivot.", ["i"]),
    );
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        states.push(
          snap(8, "COMPARE", lo, hi, i, j, hi, lo, `a[${j}]=${a[j]} ≤ ${pivot} → swap with a[${i}], advance i.`, "Found a value no larger than the pivot: move it into the ≤-zone at index i.", ["i", "j"]),
        );
        [a[i], a[j]] = [a[j], a[i]];
        i++;
        states.push(
          snap(8, "SWAP", lo, hi, i, j, hi, lo, `Swapped → [${a.join(", ")}]. i now ${i}.`, "The small value joins the left side; the larger value shifts right.", ["i"]),
        );
      } else {
        states.push(
          snap(8, "COMPARE", lo, hi, i, j, hi, lo, `a[${j}]=${a[j]} > ${pivot} → leave it.`, "Too big for the left side; it stays in the >-zone for now.", ["j"]),
        );
      }
    }
    states.push(
      snap(10, "SWAP", lo, hi, i, null, hi, lo, `swap(a[${i}], a[${hi}]) → pivot ${pivot} lands at index ${i}.`, "Move the pivot out of the corner into its final spot between the two zones.", ["i"]),
    );
    [a[i], a[hi]] = [a[hi], a[i]];
    return i;
  }

  sort(0, n - 1);
  states.push(
    snap(1, "COMPLETE", null, null, null, null, null, n, `Sorted → [${a.join(", ")}]. O(n log n) average, O(n²) worst case (already-sorted input with fixed pivot).`, "Each level partitions O(n) elements; depth is O(log n) on average. In-place, so O(log n) stack space.", []),
  );
  return states;
}
