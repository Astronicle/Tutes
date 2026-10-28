import { BACKTRACK_CODE, buildBacktrackingStates } from "./backtracking";
import { BINARY_SEARCH_CODE, buildBinarySearchStates } from "./binary-search";
import { BUBBLE_SORT_CODE, buildBubbleSortStates } from "./bubble-sort";
import { BFS_CODE, buildBfsStates } from "./bfs";
import { CLIMB_CODE, buildClimbingStairsStates } from "./climbing-stairs";
import { MERGE_SORT_CODE, buildMergeSortStates } from "./merge-sort";
import { DFS_CODE, buildDfsStates } from "./dfs";
import { LCS_CODE, buildLcsStates } from "./lcs";
import { KNAPSACK_CODE, buildKnapsackStates } from "./knapsack";
import { QUICK_SORT_CODE, buildQuickSortStates } from "./quick-sort";
import { DIJKSTRA_CODE, buildDijkstraStates } from "./dijkstra";
import { COIN_CHANGE_CODE, buildCoinChangeStates } from "./coin-change";
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
      steps: ["At each index, choose to include the value", "Recurse with that choice", "Undo the choice (backtrack)", "Then try excluding the value"],
      problem: {
        summary:
          "Given an array of distinct numbers, generate every possible subset of those numbers, including the empty subset. A set with n elements has 2ⁿ subsets, so the output is exponential by nature. Backtracking builds one subset at a time: at each index it makes a binary decision (take this number or skip it), recurses, and undoes the decision before trying the other branch.",
        example: {
          input: "nums = [1, 2, 3]",
          output: "[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
          steps: [
            "Start with path = [] at index 0. Nothing has been decided yet.",
            "Include 1 → path = [1], then recurse to index 1.",
            "Include 2 → [1,2], include 3 → [1,2,3]. index == n, so record it.",
            "Undo 3 and skip it → [1,2] is recorded again; undo 2 → [1].",
            "At index 1, skip 2 and include 3 → [1,3] is recorded; then [1] is recorded.",
            "Unwind to index 0, undo 1, and repeat the whole pattern for the subsets that start without 1.",
          ],
        },
        why:
          "Each element is an independent yes/no choice, so the decision tree has exactly 2ⁿ leaves, one per subset. Recursion enumerates that tree. The path array is shared across calls, which is why the undo step is mandatory: without it, the 'exclude' branch would inherit the value added by the 'include' branch and produce wrong subsets.",
      },
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
      problem: {
        summary:
          "Given a sorted array and a target value, find the index where the target appears, or report that it is not present. A linear scan checks up to n positions one by one, but because the array is sorted, checking one middle value tells you whether the target is in the left half or the right half. Binary search repeatedly halves the candidate range until it either lands on the target or proves it is absent.",
        example: {
          input: "a = [2, 5, 8, 12, 16, 23, 38], target = 23",
          output: "5",
          steps: [
            "lo = 0, hi = 6 → mid = 3, a[3] = 12 < 23 → target must be right of mid, so lo = 4.",
            "lo = 4, hi = 6 → mid = 5, a[5] = 23 == target → return 5.",
            "Only two probes instead of up to seven.",
          ],
        },
        why:
          "Sorted order is the entire precondition. If a[mid] < target, every element at or left of mid is also too small, so the left half is impossible. If a[mid] > target, the right half is impossible. The searchable range shrinks by roughly half each probe, so at most ⌈log₂ n⌉ checks are needed.",
      },
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
      problem: {
        summary:
          "Sort an array from smallest to largest by repeatedly walking through it and swapping adjacent pairs that are out of order. Each full pass pushes the largest remaining unsorted value all the way to the end, so after pass i the last i positions are final and never touched again.",
        example: {
          input: "[7, 2, 5, 1, 4]",
          output: "[1, 2, 4, 5, 7]",
          steps: [
            "Pass 1: 7>2 swap → [2,7,5,1,4]; 7>5 swap → [2,5,7,1,4]; 7>1 swap → [2,5,1,7,4]; 7>4 swap → [2,5,1,4,7]. The 7 is locked at the end.",
            "Pass 2: 2≤5 stay; 5>1 swap → [2,1,5,4,7]; 5>4 swap → [2,1,4,5,7]. The 5 is locked.",
            "Pass 3: 2>1 swap → [1,2,4,5,7]. The 4 is locked.",
            "Pass 4: nothing swaps; the array is fully sorted.",
          ],
        },
        why:
          "Adjacent swaps fix exactly one inversion at a time, but they always carry the maximum of the unsorted prefix to its final right-hand position. Locking one end per pass leaves only the first n−i elements to examine, giving n + (n−1) + … ≈ n²/2 comparisons in the worst case.",
      },
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
      problem: {
        summary:
          "Given a graph and a start node, visit every reachable node in order of distance from the start: first the start itself, then all nodes one edge away, then all nodes two edges away, and so on. On an unweighted graph this also produces the shortest path by number of edges to each reachable node.",
        example: {
          input: "start = A; edges A→B, A→C, B→D, B→E, C→F, E→F",
          output: "Visit order: A → B → C → D → E → F (distances A=0, B/C=1, D/E/F=2)",
          steps: [
            "queue=[A], visited={A}. Dequeue A, discover B and C → queue=[B,C].",
            "Dequeue B, discover D and E → queue=[C,D,E].",
            "Dequeue C, discover F → queue=[D,E,F].",
            "Dequeue D: nothing new. Dequeue E: F already visited, skip.",
            "Dequeue F: nothing new. Queue empty, done.",
          ],
        },
        why:
          "A FIFO queue processes nodes exactly in discovery order. Everything discovered before node u is at least as close to the start, so u is only expanded once all closer nodes have been expanded — that is level-by-level order. A stack would take the newest node first and dive deep instead (DFS).",
      },
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
      problem: {
        summary:
          "Sort an array by dividing it into two halves, sorting each half recursively, then merging the two sorted halves into one sorted result. Splitting continues until a piece has zero or one element, which is trivially sorted by definition.",
        example: {
          input: "[5, 2, 4, 1]",
          output: "[1, 2, 4, 5]",
          steps: [
            "Split into [5,2] and [4,1]; split again into [5],[2],[4],[1].",
            "Merge [5] and [2] → [2,5]; merge [4] and [1] → [1,4].",
            "Merge [2,5] and [1,4]: take 1, 2, 4, 5 → [1,2,4,5].",
          ],
        },
        why:
          "Merging two already-sorted runs only ever compares their front elements, so merging k elements costs O(k). Halving creates about log₂ n levels, and every level merges all n elements once: O(n log n). Because the split is always balanced, the worst case is O(n log n) too — unlike quicksort.",
      },
      code: MERGE_SORT_CODE,
      states: buildMergeSortStates(),
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
      problem: {
        summary:
          "Given a graph and a start node, explore as far as possible along one branch before backing up to try another — like walking a maze by always taking the first unvisited corridor and retracing only when you hit a dead end. It finds every reachable node but does not guarantee the shortest path.",
        example: {
          input: "start = A; edges A→B, A→C, B→D, B→E, C→F, E→F",
          output: "Visit order: A → B → D → E → F → C",
          steps: [
            "Visit A; its first neighbor B is unvisited → descend to B.",
            "From B, first neighbor D is unvisited → descend to D; D is a dead end, backtrack to B.",
            "From B, next neighbor E → descend; from E, F → descend; F is a dead end, backtrack to E then B then A.",
            "From A, next neighbor C → descend; C's neighbor F is already visited, skip.",
            "All reachable nodes visited: A → B → D → E → F → C.",
          ],
        },
        why:
          "Recursion (or an explicit stack) expands the most recently discovered node next, so DFS follows a single path to its end before considering siblings — last-in-first-out versus BFS's first-in-first-out. Each node is visited once and each edge checked once: O(V + E).",
      },
      code: DFS_CODE,
      states: buildDfsStates(),
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
      problem: {
        summary:
          "You stand at the bottom of an n-step staircase. Each move climbs either 1 or 2 steps. Count how many distinct sequences of moves reach step n. The last move into step i was either 1 step from i−1 or 2 steps from i−2, so ways(i) = ways(i−1) + ways(i−2) — the Fibonacci recurrence.",
        example: {
          input: "n = 5",
          output: "8 ways",
          steps: [
            "dp[0] = 1 (standing still is one way), dp[1] = 1 (one single step).",
            "dp[2] = dp[1] + dp[0] = 1 + 1 = 2.",
            "dp[3] = dp[2] + dp[1] = 2 + 1 = 3.",
            "dp[4] = dp[3] + dp[2] = 3 + 2 = 5.",
            "dp[5] = dp[4] + dp[3] = 5 + 3 = 8.",
          ],
        },
        why:
          "Every path to step i ends with exactly one of two moves, and those two groups of paths do not overlap, so adding them counts every path once. Filling the table left→right means the two dependencies are always ready. Naive recursion recomputes climb(3) exponentially many times; the table computes each cell once — O(n).",
      },
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
      problem: {
        summary:
          "Given two strings X and Y, find the length of the longest string that appears as a subsequence in both — characters in the same relative order, but not necessarily adjacent. A subsequence skips characters freely: for example, 'ADH' is a subsequence of 'ABCDGH'.",
        example: {
          input: "X = \"ABCDGH\", Y = \"AEDFHR\"",
          output: "3 — one optimal subsequence is \"ADH\"",
          steps: [
            "Row/column for empty prefixes are 0.",
            "Compare X[1]=A with Y[1]=A: match → dp[1][1] = dp[0][0] + 1 = 1.",
            "Compare X[4]=D with Y[3]=D: match → dp[4][3] = dp[3][2] + 1 = 2.",
            "Compare X[6]=H with Y[5]=H: match → dp[6][5] = dp[5][4] + 1 = 3.",
            "Trace the ↖ arrows back: H ← D ← A → \"ADH\", length 3.",
          ],
        },
        why:
          "dp[i][j] is the LCS length of X[1..i] and Y[1..j]. If X[i] == Y[j], those two characters can end an optimal alignment, so dp[i][j] = dp[i−1][j−1] + 1. If they differ, at least one of them is not used, so dp[i][j] is the better of dropping X[i] (↑) or Y[j] (←). Each cell depends only on cells above, left, or diagonal — already filled in row-major order — so every cell is O(1), giving O(m·n).",
      },
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
      problem: {
        summary:
          "You have items, each with a weight and a value, and a bag with capacity W. Each item is either taken whole or left behind — no fractions, no duplicates. Choose the subset maximizing total value without exceeding W.",
        example: {
          input: "items = A(w2,v3), B(w3,v4), C(w4,v5); W = 5",
          output: "7 (take A + B: weight 5, value 7)",
          steps: [
            "Capacity 0 and row ∅ are 0.",
            "Item A fits everywhere ≥ 2 → values start at 3.",
            "Item B at capacity 5: skip keeps dp[A][5]=3; take gives 4 + dp[A][2]=7 → dp[B][5]=7 (A+B).",
            "Item C at capacity 5: take gives 5 + dp[B][1]=5, skip keeps 7 → stays 7.",
            "Traceback: value changed at B → pack B, then at A → pack A.",
          ],
        },
        why:
          "At item i and capacity w there are exactly two choices: skip item i and keep dp[i−1][w], or take it and gain val[i] plus the best packing of the remaining w−wt[i] using previous items only (dp[i−1][w−wt[i]]). Taking the max covers every subset; reading the 'take' value from the row above guarantees each item is used at most once.",
      },
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
    {
      id: "quick-sort",
      num: "10",
      title: "QUICK SORT",
      category: "SORTING",
      time: "O(n log n)",
      space: "O(log n)",
      difficulty: "INTERMEDIATE",
      tagline: "PIVOT → PARTITION → RECURSE",
      idea: "ONE PASS PLACES THE PIVOT; EVERYTHING ELSE FOLLOWS.",
      steps: ["Pick a pivot", "Partition: ≤ pivot left, > pivot right", "Pivot is now in its final spot", "Recurse on both sides"],
      problem: {
        summary:
          "Sort an array in place. Pick one element as the pivot, rearrange the array so everything ≤ pivot is on its left and everything > pivot is on its right, then recursively sort the two sides. After partitioning, the pivot sits in its final sorted position and never moves again.",
        example: {
          input: "[8, 3, 7, 1, 6]",
          output: "[1, 3, 6, 7, 8]",
          steps: [
            "Pivot = a[4] = 6. Scan: 8>6 stays; 3≤6 → swap into left zone → [3,8,7,1,6]; 7>6 stays; 1≤6 → swap → [3,1,7,8,6].",
            "Swap pivot into the boundary → [3,1,6,8,7]; 6 is final at index 2.",
            "Sort left [3,1] around pivot 1 → [1,3]; sort right [8,7] around pivot 7 → [7,8].",
            "Result: [1,3,6,7,8].",
          ],
        },
        why:
          "Partitioning costs O(n) and guarantees the pivot's final index: every element left is ≤ and every element right is >. Recursing on both sides therefore sorts the rest. Balanced pivots give log n levels of O(n) work = O(n log n) average. A degenerate pivot (always min/max, e.g. sorted input with last-element pivot) makes one side empty every time, giving n levels × O(n) = O(n²).",
      },
      code: QUICK_SORT_CODE,
      states: buildQuickSortStates(),
      viz: "array",
      challenges: [
        {
          q: "After partitioning [8,3,7,1,6] around pivot 6, where does 6 land?",
          context: "The first partition pass completes.",
          options: ["index 0", "index 1", "index 2", "index 4"],
          answer: 2,
          explain: "Values ≤ 6 (3, 1) go left, values > 6 (8, 7) go right, then 6 swaps into the boundary at index 2.",
        },
        {
          q: "Why is quicksort O(n log n) on average but O(n²) worst case?",
          context: "Pivot choice decides how balanced the split is.",
          options: ["It always splits in half", "A bad pivot (e.g. min/max) makes one side empty, giving n levels", "Swap cost dominates", "Recursion depth is fixed"],
          answer: 1,
          explain: "Balanced pivots → log n levels × O(n) work. Degenerate pivots → n levels × O(n) work = O(n²).",
        },
      ],
    },
    {
      id: "dijkstra",
      num: "11",
      title: "DIJKSTRA",
      category: "GRAPHS",
      time: "O((V+E) log V)",
      space: "O(V)",
      difficulty: "ADVANCED",
      tagline: "EXTRACT MIN → RELAX → SETTLE",
      idea: "ALWAYS EXPAND THE CLOSEST UNSETTLED NODE FIRST.",
      steps: ["Seed dist[start]=0, others ∞", "Extract the closest unsettled node", "Relax its outgoing edges", "Repeat until the queue empties"],
      problem: {
        summary:
          "Given a weighted graph with non-negative edge weights and a start node, find the shortest distance from the start to every reachable node, plus the path that achieves each distance. Dijkstra settles nodes greedily: always expand the closest unsettled node first, then use it to improve estimates of its neighbors.",
        example: {
          input: "start = A; edges A-B:4, A-C:2, B-D:5, B-E:10, C-E:3, C-F:8, D-E:2, E-F:1",
          output: "dist = {A:0, B:4, C:2, D:9, E:5, F:6}; visit order A → C → B → E → F → D",
          steps: [
            "dist[A]=0, others ∞. PQ=[A].",
            "Settle A(0): relax B→4, C→2.",
            "Settle C(2): relax E→5 (2+3), F→10 (2+8).",
            "Settle B(4): relax D→9 (4+5); E via B is 14, not better.",
            "Settle E(5): relax F→6 (5+1), improves 10→6.",
            "Settle F(6): nothing new. Settle D(9): done.",
          ],
        },
        why:
          "With non-negative weights, when the priority queue hands up the node with the smallest tentative distance, no future path can beat it — any detour adds only non-negative weight — so that distance is final and can be locked. Relaxing its edges then improves neighbors; stale PQ entries are skipped. Negative weights break this guarantee, which is why Dijkstra requires non-negative edges.",
      },
      code: DIJKSTRA_CODE,
      states: buildDijkstraStates(),
      viz: "graph",
      challenges: [
        {
          q: "Why can Dijkstra settle a node and never revisit it?",
          context: "A node is extracted with the minimum tentative distance.",
          options: ["All edge weights are non-negative", "The queue is sorted", "Visited marks block it", "The graph is small"],
          answer: 0,
          explain: "With non-negative weights, any later path to a settled node can only be longer, so its extracted distance is final.",
        },
        {
          q: "What happens if a node is already in the PQ and a shorter path to it is found?",
          context: "Relaxation improves dist[v].",
          options: ["Ignore it", "Update dist and re-push; the stale entry is skipped on extraction", "Remove the old entry first", "Restart the whole algorithm"],
          answer: 1,
          explain: "Push the improved entry; when the stale, larger entry is later popped, `d > dist[u]` causes it to be skipped.",
        },
      ],
    },
    {
      id: "coin-change",
      num: "12",
      title: "COIN CHANGE",
      category: "DYNAMIC PROGRAMMING",
      time: "O(n·target)",
      space: "O(n·target)",
      difficulty: "INTERMEDIATE",
      tagline: "SKIP → OR TAKE → REUSE",
      idea: "EVERY AMOUNT IS A MINIMUM OVER THE COIN TYPES.",
      steps: ["Seed dp[0][a]=∞, dp[i][0]=0", "If coin fits: min(skip, 1 + take)", "Else inherit from above", "Read dp[n][target]"],
      problem: {
        summary:
          "Given coin denominations and a target amount, find the fewest coins whose values add up to exactly the target. Each coin type may be used any number of times; if no combination reaches the target, report −1.",
        example: {
          input: "coins = [1, 3, 4], target = 6",
          output: "2 coins (3¢ + 3¢)",
          steps: [
            "With only 1¢, dp = amount: [0,1,2,3,4,5,6].",
            "Add 3¢: dp[3] = min(3, 1+dp[0]=1) = 1; dp[6] = min(6, 1+dp[3]=2) = 2.",
            "Add 4¢: dp[6] = min(2, 1+dp[2]=3) stays 2.",
            "Read dp[3][6] = 2.",
          ],
        },
        why:
          "dp[i][a] is the fewest coins using coin types 1..i to make amount a. Skipping coin i keeps the row-above answer. Taking coin i spends one coin and leaves amount a−coins[i] to be made with the same set of coin types — reading from the same row is what allows unlimited reuse. Taking min(skip, take) covers every combination, and ∞ base cases mark impossible amounts.",
      },
      code: COIN_CHANGE_CODE,
      states: buildCoinChangeStates(),
      viz: "dp-grid",
      challenges: [
        {
          q: "Coins [1,3,4], target 6. Why is the answer 2 and not 3?",
          context: "dp[3][6] holds the fewest coins.",
          options: ["1+1+4", "3+3", "1+1+1+3", "4+4"],
          answer: 1,
          explain: "3¢ + 3¢ = 6¢ in two coins. The table finds min over (skip 4¢ → dp[2][6]=2) vs (take 4¢ → 1+dp[3][2]=3), so it keeps 2.",
        },
        {
          q: "Why does 'take' read from the same row dp[i][a - coin] while 'skip' reads from dp[i-1][a]?",
          context: "Unbounded vs 0/1 choice.",
          options: ["Coins are reusable — same row", "The table is symmetric", "It saves memory", "The code requires it"],
          answer: 0,
          explain: "Taking a coin leaves the same coin types available for the remainder (same row). Skipping consumes nothing and moves to previous types (row above).",
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
