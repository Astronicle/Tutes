import { BACKTRACK_CODE, buildBacktrackingStates } from "./backtracking";
import { BINARY_SEARCH_CODE, buildBinarySearchStates } from "./binary-search";
import { BUBBLE_SORT_CODE, buildBubbleSortStates } from "./bubble-sort";
import { BFS_CODE, buildBfsStates } from "./bfs";
import { CLIMB_CODE, buildClimbingStairsStates } from "./climbing-stairs";
import { LCS_CODE, buildLcsStates } from "./lcs";
import { KNAPSACK_CODE, buildKnapsackStates } from "./knapsack";
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
    {
      id: "climbing-stairs",
      num: "07",
      title: "CLIMBING STAIRS",
      category: "DYNAMIC PROGRAMMING",
      time: "O(n)",
      space: "O(n)",
      difficulty: "FOUNDATION",
      tagline: "DEFINE → ORDER → MEMOIZE",
      idea: "REMEMBER EVERY STEP SO YOU NEVER CLIMB TWICE.",
      steps: ["Define dp[i] = ways to reach step i", "Order subproblems left → right", "Read solved cells, write the next", "Return dp[n]"],
      code: CLIMB_CODE,
      states: buildClimbingStairsStates(),
      viz: "array",
      challenges: [
        {
          q: "dp = [1, 1, 2, 3, ?, ?], n = 5. What is dp[4]?",
          context: "dp[i] = dp[i-1] + dp[i-2].",
          options: ["3", "4", "5", "6"],
          answer: 2,
          explain: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5. Then dp[5] = 5 + 3 = 8.",
        },
        {
          q: "Why is tabulation O(n) while naive recursion is O(2ⁿ)?",
          context: "Same recurrence, different execution.",
          options: ["The loop is faster than calls", "Each subproblem is solved once and read from the table", "Addition is cheaper in a loop", "Recursion can't be memoized"],
          answer: 1,
          explain: "Naive recursion re-solves climb(3) exponentially many times. The table solves each of the n+1 cells once and reuses them.",
        },
      ],
    },
    {
      id: "lcs",
      num: "08",
      title: "LONGEST COMMON SUBSEQUENCE",
      category: "DYNAMIC PROGRAMMING",
      time: "O(m·n)",
      space: "O(m·n)",
      difficulty: "INTERMEDIATE",
      tagline: "MATCH → EXTEND · MISMATCH → INHERIT",
      idea: "ALIGN TWO STRINGS BY SOLVING EVERY PREFIX PAIR.",
      steps: ["Define dp[i][j] over prefix pairs", "Match extends the diagonal by one", "Mismatch inherits the better neighbor", "Trace arrows back for the alignment"],
      code: LCS_CODE,
      states: buildLcsStates(),
      viz: "dp-grid",
      challenges: [
        {
          q: "X[i] ≠ Y[j], dp[i-1][j] = 2, dp[i][j-1] = 2. What is dp[i][j], and which arrow?",
          context: "Mismatch with a tie.",
          options: ["2 via ↑", "2 via ←", "3 via ↖", "1 via ↑"],
          answer: 0,
          explain: "max(2, 2) = 2, tie broken upward (↑). Either neighbor is valid — both encode an optimal alignment.",
        },
        {
          q: "Why must the table fill row-by-row (or column-by-column)?",
          context: "Dependency order.",
          options: ["Rows render faster", "Each cell reads only up/left/diagonal cells, which are already solved", "The code says so", "To save memory"],
          answer: 1,
          explain: "dp[i][j] needs dp[i-1][j-1], dp[i-1][j], dp[i][j-1]. Any order that solves those first works; row-major is the simplest.",
        },
      ],
    },
    {
      id: "knapsack",
      num: "09",
      title: "0/1 KNAPSACK",
      category: "DYNAMIC PROGRAMMING",
      time: "O(n·W)",
      space: "O(n·W)",
      difficulty: "ADVANCED",
      tagline: "TAKE → OR SKIP · EVERY CAPACITY",
      idea: "EVERY ITEM IS A YES-OR-NO QUESTION AT EVERY CAPACITY.",
      steps: ["Define dp[i][w] over items × capacity", "Too heavy → inherit from above", "Fits → max(skip, take + remainder)", "Trace back to find the packing"],
      code: KNAPSACK_CODE,
      states: buildKnapsackStates(),
      viz: "dp-grid",
      challenges: [
        {
          q: "Item B (w3, v4), capacity 5: skip=3, take=4+3=7. What is dp[B][5]?",
          context: "Take vs skip at one cell.",
          options: ["3", "4", "7", "10"],
          answer: 2,
          explain: "max(3, 4 + dp[A][2]=3) = 7. Taking B plus the best fill of the remaining capacity 2 wins.",
        },
        {
          q: "During traceback, dp[i][w] == dp[i-1][w]. What does it mean?",
          context: "Reading the packed items.",
          options: ["Item i was taken", "Item i was skipped", "The table is wrong", "Capacity is exhausted"],
          answer: 1,
          explain: "An unchanged value across rows means item i contributed nothing — the optimum skipped it. Move up.",
        },
      ],
    },
  ];
  cache = Object.fromEntries(defs.map((d) => [d.id, d]));
  return defs;
}

export function getAlgorithm(id: string): AlgorithmDef | undefined {
  getAlgorithms();
  return cache?.[id];
}
