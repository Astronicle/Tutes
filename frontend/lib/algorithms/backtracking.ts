import type { ExecState, TreeNodeState } from "./types";

export const BACKTRACK_CODE = [
  "void solve(int index) {",
  "  if (index == n) {",
  "    answer.add(copy(path)); return;",
  "  }",
  "  // ── INCLUDE ──",
  "  path.add(nums[index]);",
  "  solve(index + 1);",
  "  // ── EXCLUDE ──",
  "  path.removeLast();",
  "  solve(index + 1);",
  "}",
];

const NUMS = [1, 2, 3];

export function buildBacktrackingStates(): ExecState[] {
  const states: ExecState[] = [];
  const tree: TreeNodeState[] = [];
  let nodeCounter = 0;

  const fmtPath = (p: number[]) => (p.length === 0 ? "[]" : `[${p.join(", ")}]`);

  function snapshot(o: {
    line: number;
    phase: string;
    index: number;
    path: number[];
    stack: string[];
    note: string;
    why: string;
    changed?: string[];
    output?: string[];
  }): ExecState {
    const treeCopy = tree.map((t) => ({ ...t }));
    // mark current node = deepest active
    return {
      step: states.length,
      line: o.line,
      phase: o.phase,
      vars: {
        index: String(o.index),
        path: fmtPath(o.path),
        depth: String(o.stack.length),
        n: String(NUMS.length),
        "answer.size": String(o.output?.length ?? snapshotAnswer.length),
      },
      stack: [...o.stack],
      note: o.note,
      why: o.why,
      changed: o.changed,
      path: [...o.path],
      index: o.index,
      depth: o.stack.length,
      tree: treeCopy,
      array: NUMS.map((v, i) => ({
        value: v,
        state:
          o.path.includes(v)
            ? ("path" as const)
            : i === o.index
              ? ("active" as const)
              : i < o.index
                ? ("excluded" as const)
                : ("idle" as const),
      })),
      pointers: { index: o.index < NUMS.length ? o.index : null },
      output: [...snapshotAnswer],
    };
  }

  const snapshotAnswer: string[] = [];
  const push = (s: ExecState) => {
    s.step = states.length;
    states.push(s);
  };

  function solve(index: number, path: number[], stack: string[]) {
    const id = `n${nodeCounter++}`;
    const parentId =
      tree.length === 0
        ? null
        : findCurrentLeafParent(path.slice(0, -1));
    tree.push({
      id,
      label: fmtPath(path),
      parentId,
      depth: stack.length,
      status: "current",
    });
    // deactivate previous currents except this
    tree.forEach((t) => {
      if (t.id !== id && t.status === "current") t.status = "active";
    });

    const callLabel = `solve(${index})`;
    const newStack = [...stack, callLabel];

    if (index === NUMS.length) {
      push(
        snapshot({
          line: 2,
          phase: "BASE CASE",
          index,
          path,
          stack: newStack,
          note: `index == n (${index}). This branch is complete — record ${fmtPath(path)}.`,
          why: "Every index has been decided (include or skip). A leaf of the search tree holds one complete subset.",
          changed: ["index"],
          output: snapshotAnswer,
        }),
      );
      snapshotAnswer.push(fmtPath(path));
      const node = tree.find((t) => t.id === id);
      if (node) node.status = "done";
      push(
        snapshot({
          line: 3,
          phase: "RECORD",
          index,
          path,
          stack: newStack,
          note: `answer.add(${fmtPath(path)}) → ${snapshotAnswer.length} subsets found. Returning.`,
          why: "The base case copies the current path into the answer list, then unwinds one frame.",
          changed: ["answer.size"],
          output: snapshotAnswer,
        }),
      );
      // mark return: pop visual current back to active
      if (node) node.status = "done";
      return;
    }

    push(
      snapshot({
        line: 1,
        phase: "ENTER",
        index,
        path,
        stack: newStack,
        note: `Enter ${callLabel} with path=${fmtPath(path)}. Decide nums[${index}] = ${NUMS[index]}.`,
        why: `Position ${index} is undecided. Backtracking tries both choices: take nums[${index}], then skip it.`,
        changed: ["index", "depth"],
        output: snapshotAnswer,
      }),
    );

    // INCLUDE
    const withVal = [...path, NUMS[index]];
    push(
      snapshot({
        line: 6,
        phase: "SELECT",
        index,
        path: withVal,
        stack: newStack,
        note: `path.add(${NUMS[index]}) → path=${fmtPath(withVal)}. Go deeper.`,
        why: `Choice 1 of 2: include ${NUMS[index]}. The recursion explores everything that contains this prefix first.`,
        changed: ["path"],
        output: snapshotAnswer,
      }),
    );
    // mark parent active while child runs
    const me = tree.find((t) => t.id === id);
    if (me) me.status = "active";

    push(
      snapshot({
        line: 7,
        phase: "RECURSE",
        index,
        path: withVal,
        stack: newStack,
        note: `solve(${index + 1}) — recurse with ${NUMS[index]} included.`,
        why: "A recursive call freezes this frame on the call stack and opens a deeper one.",
        changed: ["depth"],
        output: snapshotAnswer,
      }),
    );
    solve(index + 1, withVal, newStack);

    // BACKTRACK
    if (me) me.status = "current";
    tree.forEach((t) => {
      if (t.status === "current" && t.id !== id) t.status = t.label ? "active" : "active";
    });
    push(
      snapshot({
        line: 9,
        phase: "BACKTRACK",
        index,
        path,
        stack: newStack,
        note: `path.removeLast() → undo ${NUMS[index]}. Path returns to ${fmtPath(path)}.`,
        why: `The include-branch is fully explored. UNDO the last choice so the exclude-branch can reuse the same path variable.`,
        changed: ["path"],
        output: snapshotAnswer,
      }),
    );
    const backNode = tree.find((t) => t.id === id);
    if (backNode) backNode.status = "current";

    push(
      snapshot({
        line: 10,
        phase: "RECURSE",
        index,
        path,
        stack: newStack,
        note: `solve(${index + 1}) — recurse with ${NUMS[index]} skipped.`,
        why: `Choice 2 of 2: exclude ${NUMS[index]}. Same index+1, different prefix. This is what makes it 2ⁿ.`,
        changed: ["depth"],
        output: snapshotAnswer,
      }),
    );
    if (me) me.status = "active";
    solve(index + 1, path, newStack);
    if (me) me.status = "done";
  }

  function findCurrentLeafParent(prefix: number[]): string | null {
    // find deepest node whose label matches prefix
    const key = prefix.length === 0 ? "[]" : `[${prefix.join(", ")}]`;
    for (let i = tree.length - 1; i >= 0; i--) {
      if (tree[i].label === key) return tree[i].id;
    }
    return tree.length ? tree[tree.length - 1].id : null;
  }

  // initial state
  tree.push({ id: "n-root", label: "[]", parentId: null, depth: 0, status: "current" });
  nodeCounter = 1;
  push({
    step: 0,
    line: 1,
    phase: "INIT",
    vars: { index: "0", path: "[]", depth: "0", n: "3", "answer.size": "0" },
    stack: [],
    note: "Initial state. nums=[1,2,3], path=[], answer=[]. Press STEP → to enter solve(0).",
    why: "Backtracking starts with an empty path and decides each element one at a time: include it, or skip it.",
    path: [],
    index: 0,
    depth: 0,
    tree: tree.map((t) => ({ ...t })),
    array: NUMS.map((v, i) => ({ value: v, state: i === 0 ? ("active" as const) : ("idle" as const) })),
    pointers: { index: 0 },
    output: [],
  });
  tree.length = 0;
  nodeCounter = 0;

  solve(0, [], []);

  // final
  push({
    step: states.length,
    line: 11,
    phase: "COMPLETE",
    vars: { index: "–", path: "[]", depth: "0", n: "3", "answer.size": "8" },
    stack: [],
    note: "All 2³ = 8 subsets recorded. The tree is fully explored — every include/exclude pair was tried and undone.",
    why: "Each of the 3 positions branched twice, so the recursion tree has 15 calls and 8 leaves. Time O(2ⁿ), space O(n) for the path + stack.",
    path: [],
    index: 3,
    depth: 0,
    tree: tree.map((t) => ({ ...t, status: "done" as const })),
    array: NUMS.map((v) => ({ value: v, state: "idle" as const })),
    pointers: { index: null },
    output: [...snapshotAnswer],
  });

  return states;
}
