import { BACKTRACK_CODE, buildBacktrackingStates } from "./backtracking";
import { BINARY_SEARCH_CODE, buildBinarySearchStates } from "./binary-search";
import { BUBBLE_SORT_CODE, buildBubbleSortStates } from "./bubble-sort";
import { BFS_CODE, buildBfsStates } from "./bfs";
import type { AlgorithmDef } from "./types";

let cache: Record<string, AlgorithmDef> | null = null;

export function getAlgorithms(): AlgorithmDef[] {
  if (cache) return Object.values(cache);
  const defs: AlgorithmDef[] = [
    {
      id: "backtracking",
      num: "01",
      title: "BACKTRACKING",
      category: "RECURSION",
      time: "O(2ⁿ)",
      space: "O(N)",
      difficulty: "INTERMEDIATE",
      tagline: "EXPLORE → CHOOSE → RECURSE → UNDO",
      idea: "BACKTRACKING IS SEARCH WITH AN UNDO BUTTON.",
      steps: ["Choose a value", "Recurse deeper", "Undo the choice", "Try the next choice"],
      code: BACKTRACK_CODE,
      states: buildBacktrackingStates(),
      viz: "backtrack",
      challenges: [
        {
          q: "path = [1, 2], index = 2. What happens next?",
          context: "Two of three positions are decided. One remains.",
          options: ["Add 3 and recurse", "Remove 2", "Return immediately", "Restart from solve(0)"],
          answer: 0,
          explain: "index (2) < n (3), so we still decide nums[2]=3: include it first (path.add), then recurse.",
        },
        {
          q: "Why does path.removeLast() exist?",
          context: "After the include-branch returns.",
          options: ["Free memory", "Undo the choice so the exclude-branch reuses path", "Sort the path", "Record the answer"],
          answer: 1,
          explain: "The same path array is shared. Without undo, the exclude-branch would wrongly still contain the included value.",
        },
      ],
    },
    {
      id: "binary-search",
      num: "02",
      title: "BINARY SEARCH",
      category: "SEARCH",
      time: "O(log n)",
      space: "O(1)",
      difficulty: "FOUNDATION",
      tagline: "HALVE → COMPARE → DISCARD",
      idea: "SORTED MEANS YOU NEVER LOOK BACK.",
      steps: ["Pick the midpoint", "Compare with target", "Discard half", "Repeat"],
      code: BINARY_SEARCH_CODE,
      states: buildBinarySearchStates(),
      viz: "array",
      challenges: [
        {
          q: "a=[2,5,8,12,16,23,38], target=23, lo=0, hi=6. What is mid?",
          context: "First probe of the search.",
          options: ["2", "3", "4", "6"],
          answer: 1,
          explain: "mid=(0+6)/2=3, a[3]=12 < 23, so lo becomes 4.",
        },
      ],
    },
    {
      id: "bubble-sort",
      num: "03",
      title: "BUBBLE SORT",
      category: "SORTING",
      time: "O(n²)",
      space: "O(1)",
      difficulty: "FOUNDATION",
      tagline: "COMPARE → SWAP → BUBBLE",
      idea: "LARGE VALUES SINK. SMALL VALUES RISE.",
      steps: ["Compare neighbors", "Swap if inverted", "Lock the end", "Repeat"],
      code: BUBBLE_SORT_CODE,
      states: buildBubbleSortStates(),
      viz: "array",
      challenges: [
        {
          q: "After pass 1 of [7,2,5,1,4], which value is locked at the end?",
          context: "Largest unsorted bubbles right.",
          options: ["4", "5", "7", "1"],
          answer: 2,
          explain: "7 is the maximum — it swaps all the way to index 4 and never moves again.",
        },
      ],
    },
    {
      id: "bfs",
      num: "04",
      title: "BREADTH-FIRST SEARCH",
      category: "GRAPHS",
      time: "O(V + E)",
      space: "O(V)",
      difficulty: "INTERMEDIATE",
      tagline: "QUEUE → VISIT → EXPAND",
      idea: "VISIT IN WAVES, NOT IN TUNNELS.",
      steps: ["Dequeue the oldest frontier", "Visit neighbors", "Enqueue the unseen", "Repeat"],
      code: BFS_CODE,
      states: buildBfsStates(),
      viz: "graph",
      challenges: [
        {
          q: "Why does BFS use a queue and not a stack?",
          context: "The frontier discipline decides the order.",
          options: ["Queues are faster", "FIFO gives level order; LIFO would go deep", "Stacks can't hold nodes", "No reason"],
          answer: 1,
          explain: "FIFO dequeues the oldest frontier first → nodes visit level by level. A stack would become DFS.",
        },
      ],
    },
    {
      id: "merge-sort",
      num: "05",
      title: "MERGE SORT",
      category: "SORTING",
      time: "O(n log n)",
      space: "O(n)",
      difficulty: "INTERMEDIATE",
      tagline: "SPLIT → SORT → MERGE",
      idea: "DIVIDE UNTIL TRIVIAL, THEN MERGE.",
      steps: ["Split in half", "Sort each half", "Merge sorted halves"],
      code: ["void mergeSort(int lo, int hi) {", "  if (lo >= hi) return;", "  int mid = (lo + hi) / 2;", "  mergeSort(lo, mid);", "  mergeSort(mid+1, hi);", "  merge(lo, mid, hi);", "}"],
      states: buildBubbleSortStates().slice(0, 12),
      viz: "array",
      challenges: [],
    },
    {
      id: "dfs",
      num: "06",
      title: "DEPTH-FIRST SEARCH",
      category: "GRAPHS",
      time: "O(V + E)",
      space: "O(V)",
      difficulty: "INTERMEDIATE",
      tagline: "GO DEEP → BACKTRACK",
      idea: "FOLLOW EACH PATH TO ITS END.",
      steps: ["Visit node", "Recurse to neighbor", "Backtrack", "Try next"],
      code: BFS_CODE,
      states: buildBfsStates(),
      viz: "graph",
      challenges: [],
    },
  ];
  cache = Object.fromEntries(defs.map((d) => [d.id, d]));
  return defs;
}

export function getAlgorithm(id: string): AlgorithmDef | undefined {
  getAlgorithms();
  return cache?.[id];
}
