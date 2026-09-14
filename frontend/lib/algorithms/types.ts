export type VizKind = "backtrack" | "array" | "graph" | "dp-grid";

export type TreeStatus = "pending" | "active" | "current" | "done" | "backtracked";

export interface TreeNodeState {
  id: string;
  label: string;
  parentId: string | null;
  depth: number;
  status: TreeStatus;
}

export interface ArrayCellState {
  value: number | string;
  state: "idle" | "active" | "compare" | "sorted" | "excluded" | "path";
}

export interface GraphNodeState {
  id: string;
  x: number; // 0..100
  y: number; // 0..100
  status: "idle" | "frontier" | "current" | "visited";
}

export interface GraphEdge {
  from: string;
  to: string;
}

export type DPGridCell = "idle" | "done" | "active" | "dep" | "path";

export interface DPGrid {
  /** row headers, e.g. ["∅","A","B",...] — length = rows */
  rows: string[];
  /** col headers — length = cols */
  cols: string[];
  /** cell values, rows × cols; null = not yet computed */
  values: (number | string | null)[][];
  states: DPGridCell[][];
  /** recurrence decision per computed cell: where the value came from */
  arrows: ("" | "↖" | "↑" | "←")[][];
  /** label for the traceback readout, e.g. "LCS" or "TAKEN" */
  resultLabel: string;
}

export interface ExecState {
  step: number;
  line: number;
  /** short phase tag shown as microcopy, e.g. SELECT / RECURSE / BACKTRACK */
  phase: string;
  vars: Record<string, string>;
  stack: string[];
  note: string;
  why: string;
  /** changed variable names to pulse */
  changed?: string[];
  path: (number | string)[];
  index: number;
  depth: number;
  tree?: TreeNodeState[];
  array?: ArrayCellState[];
  pointers?: Record<string, number | null>;
  graph?: { nodes: GraphNodeState[]; edges: GraphEdge[]; queue: string[] };
  grid?: DPGrid;
  output?: string[];
}

export interface AlgorithmDef {
  id: string;
  num: string;
  title: string;
  category: string;
  time: string;
  space: string;
  difficulty: "FOUNDATION" | "INTERMEDIATE" | "ADVANCED";
  tagline: string;
  idea: string;
  steps: string[];
  code: string[];
  states: ExecState[];
  viz: VizKind;
  challenges: Challenge[];
}

export interface Challenge {
  q: string;
  context: string;
  options: string[];
  answer: number;
  explain: string;
}
