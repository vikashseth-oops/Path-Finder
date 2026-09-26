export const NODE_TYPES = {
  EMPTY: 'EMPTY',
  START: 'START',
  END: 'END',
  WAYPOINT: 'WAYPOINT',
  WALL: 'WALL',
  WEIGHT_MUD: 'WEIGHT_MUD',       // Weight: 5
  WEIGHT_FOREST: 'WEIGHT_FOREST', // Weight: 15
  WEIGHT_WATER: 'WEIGHT_WATER',   // Weight: 3
};

export const WEIGHT_VALUES = {
  [NODE_TYPES.EMPTY]: 1,
  [NODE_TYPES.START]: 1,
  [NODE_TYPES.END]: 1,
  [NODE_TYPES.WAYPOINT]: 1,
  [NODE_TYPES.WALL]: Infinity,
  [NODE_TYPES.WEIGHT_WATER]: 3,
  [NODE_TYPES.WEIGHT_MUD]: 5,
  [NODE_TYPES.WEIGHT_FOREST]: 15,
};

export const TOOL_MODES = {
  WALL: 'WALL',
  WEIGHT_MUD: 'WEIGHT_MUD',
  WEIGHT_FOREST: 'WEIGHT_FOREST',
  WEIGHT_WATER: 'WEIGHT_WATER',
  ERASER: 'ERASER',
  START: 'START',
  END: 'END',
  WAYPOINT: 'WAYPOINT',
};

export const ALGORITHMS = {
  DIJKSTRA: 'dijkstra',
  ASTAR: 'astar',
  BFS: 'bfs',
  DFS: 'dfs',
  GREEDY_BEST_FIRST: 'greedy',
  BIDIRECTIONAL_BFS: 'bidirectional',
};

export const HEURISTICS = {
  MANHATTAN: 'manhattan',
  EUCLIDEAN: 'euclidean',
  CHEBYSHEV: 'chebyshev',
};
