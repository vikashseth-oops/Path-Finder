export const ALGORITHM_INFO = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    category: "Weighted",
    guaranteedShortest: true,
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V)",
    description: "Father of pathfinding algorithms. Explores nodes in order of total cost from start. Guaranteed to find the shortest path in weighted graphs.",
    idealFor: "Weighted grids with mud, forest, or variable traffic costs.",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  astar: {
    name: "A* Search Algorithm",
    category: "Heuristic Weighted",
    guaranteedShortest: true,
    timeComplexity: "O(E)",
    spaceComplexity: "O(V)",
    description: "Smart pathfinder using f(n) = g(n) + h(n) (cost-so-far + estimated-distance-to-target). Dramatically reduces visited nodes.",
    idealFor: "Real-time navigation, robotics, gaming AI, and fast shortest path computation.",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    category: "Unweighted",
    guaranteedShortest: true,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Explores nodes level-by-level outwards in concentric circles. Guaranteed shortest path on unweighted grids.",
    idealFor: "Simple mazes with uniform step costs.",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    category: "Unweighted / Exploring",
    guaranteedShortest: false,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    description: "Explores as deep as possible down each branch before backtracking. Does NOT guarantee shortest path.",
    idealFor: "Maze solving, topological sorting, exploring all reachable paths.",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  greedy: {
    name: "Greedy Best-First Search",
    category: "Heuristic Only",
    guaranteedShortest: false,
    timeComplexity: "O(V log V)",
    spaceComplexity: "O(V)",
    description: "Rushes directly towards the goal using heuristic h(n) estimation. Fast speed but can get stuck in dead ends.",
    idealFor: "Ultra-fast approximate pathfinding in open or low-obstacle environments.",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30"
  },
  bidirectional: {
    name: "Bidirectional BFS",
    category: "Dual Search",
    guaranteedShortest: true,
    timeComplexity: "O(b^(d/2))",
    spaceComplexity: "O(b^(d/2))",
    description: "Runs two simultaneous breadth-first searches from Start and Goal until they meet in the middle. Drastically cuts search area.",
    idealFor: "Symmetric graph searches with large distance spans.",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
  }
};

export const HEURISTIC_INFO = {
  manhattan: {
    name: "Manhattan Distance",
    formula: "|x1 - x2| + |y1 - y2|",
    description: "Calculates total grid distance moving strictly along 4 cardinal directions (North, South, East, West)."
  },
  euclidean: {
    name: "Euclidean Distance",
    formula: "sqrt((x1 - x2)² + (y1 - y2)²)",
    description: "Straight-line bird's-eye distance between points."
  },
  chebyshev: {
    name: "Chebyshev Distance",
    formula: "max(|x1 - x2|, |y1 - y2|)",
    description: "Maximum coordinate distance, effective for grid paths with equal cost 8-directional movement."
  }
};
