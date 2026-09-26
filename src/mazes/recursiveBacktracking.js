import { NODE_TYPES } from '../constants/nodeTypes';

export function generateRecursiveBacktrackingMaze(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  
  // 1. Fill entire grid with walls except start and end
  const wallsToAnimate = [];
  const gridWalls = [];

  for (let r = 0; r < numRows; r++) {
    gridWalls[r] = [];
    for (let c = 0; c < numCols; c++) {
      gridWalls[r][c] = true; // true = wall
    }
  }

  // Helper for checking bounds
  const inBounds = (r, c) => r >= 0 && r < numRows && c >= 0 && c < numCols;

  // Start backtracker from (1, 1) or startNode row/col rounded to odd cell
  let startR = Math.floor(startNode.row / 2) * 2 + 1;
  let startC = Math.floor(startNode.col / 2) * 2 + 1;

  if (startR >= numRows) startR = numRows - 2;
  if (startC >= numCols) startC = numCols - 2;
  if (startR < 1) startR = 1;
  if (startC < 1) startC = 1;

  gridWalls[startR][startC] = false; // passage

  const stack = [[startR, startC]];
  const directions = [
    [-2, 0], // North
    [2, 0],  // South
    [0, 2],  // East
    [0, -2]  // West
  ];

  while (stack.length > 0) {
    const [currR, currC] = stack[stack.length - 1];
    
    // Find unvisited neighbors 2 cells away
    const unvisitedNeighbors = [];

    for (const [dr, dc] of directions) {
      const nr = currR + dr;
      const nc = currC + dc;
      if (inBounds(nr, nc) && gridWalls[nr][nc] === true) {
        unvisitedNeighbors.push([nr, nc, dr, dc]);
      }
    }

    if (unvisitedNeighbors.length > 0) {
      // Pick random neighbor
      const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      const [nextR, nextC, dr, dc] = unvisitedNeighbors[randomIndex];

      // Remove wall between current and chosen neighbor
      gridWalls[currR + dr / 2][currC + dc / 2] = false;
      gridWalls[nextR][nextC] = false;

      stack.push([nextR, nextC]);
    } else {
      stack.pop();
    }
  }

  // Ensure Start and End nodes and their immediate surroundings are clear passages
  gridWalls[startNode.row][startNode.col] = false;
  gridWalls[endNode.row][endNode.col] = false;

  // Collect all coordinates that remain walls
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (gridWalls[r][c]) {
        if ((r === startNode.row && c === startNode.col) || (r === endNode.row && c === endNode.col)) {
          continue;
        }
        wallsToAnimate.push({ row: r, col: c });
      }
    }
  }

  return wallsToAnimate;
}
