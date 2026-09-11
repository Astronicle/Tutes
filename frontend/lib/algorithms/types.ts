export type VizKind = "backtrack" | "array" | "graph";

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
