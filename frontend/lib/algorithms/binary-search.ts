import type { ExecState } from "./types";

export const BINARY_SEARCH_CODE = [
  "int search(int[] a, int target) {",
  "  int lo = 0, hi = a.length - 1;",
  "  while (lo <= hi) {",
  "    int mid = (lo + hi) / 2;",
  "    if (a[mid] == target) return mid;",
  "    if (a[mid] < target) lo = mid + 1;",
  "    else hi = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];

export function buildBinarySearchStates(): ExecState[] {
  const a = [2, 5, 8, 12, 16, 23, 38];
  const target = 23;
  const states: ExecState[] = [];
  let lo = 0;
  let hi = a.length - 1;

  const snap = (
    line: number,
    phase: string,
    mid: number | null,
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
      "a[mid]": mid === null ? "–" : String(a[mid]),
      target: String(target),
    },
    stack: [`search(lo=${lo}, hi=${hi})`],
    note,
    why,
    changed,
    path: [],
    index: mid ?? lo,
    depth: 1,
    array: a.map((v, i) => ({
      value: v,
      state:
        mid !== null && i === mid
          ? ("active" as const)
          : i < lo || i > hi
            ? ("excluded" as const)
            : ("idle" as const),
    })),
    pointers: { lo, hi, mid },
    output: [],
  });

  states.push(
    snap(2, "INIT", null, `lo=0, hi=${hi}. Search range is the whole array for target ${target}.`, "Binary search needs a sorted array. It halves the range every step.", ["lo", "hi"]),
  );
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    states.push(
      snap(4, "MIDPOINT", mid, `mid = (${lo}+${hi})/2 = ${mid}. Inspect a[${mid}] = ${a[mid]}.`, "The midpoint discards half the remaining elements no matter the outcome.", ["mid"]),
    );
    if (a[mid] === target) {
      states.push(
        snap(5, "FOUND", mid, `a[${mid}] == ${target}. Return ${mid}. Done in ${states.length} probes.`, "Exact hit — binary search terminates early on equality.", ["a[mid]"]),
      );
      break;
    } else if (a[mid] < target) {
      states.push(
        snap(6, "GO RIGHT", mid, `a[${mid}] = ${a[mid]} < ${target}. Discard left half → lo = ${mid + 1}.`, "The target must be right of mid because the array is sorted.", ["lo"]),
      );
      lo = mid + 1;
    } else {
      states.push(
        snap(7, "GO LEFT", mid, `a[${mid}] = ${a[mid]} > ${target}. Discard right half → hi = ${mid - 1}.`, "The target must be left of mid because the array is sorted.", ["hi"]),
      );
      hi = mid - 1;
    }
  }
  return states;
}
