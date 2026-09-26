export function generatePrimsMaze(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const wallsToAnimate = [];
  const gridWalls = [];

  for (let r = 0; r < numRows; r++) {
    gridWalls[r] = [];
    for (let c = 0; c < numCols; c++) {
      gridWalls[r][c] = true;
    }
  }

  const startR = 1;
  const startC = 1;
  gridWalls[startR][startC] = false;

  const frontier = [];
  
  const addFrontier = (r, c) => {
    const directions = [[-2, 0], [2, 0], [0, 2], [0, -2]];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 1 && nr < numRows - 1 && nc >= 1 && nc < numCols - 1 && gridWalls[nr][nc]) {
        frontier.push([nr, nc, r, c]);
      }
    }
  };

  addFrontier(startR, startC);

  while (frontier.length > 0) {
    const randIdx = Math.floor(Math.random() * frontier.length);
    const [fr, fc, pr, pc] = frontier.splice(randIdx, 1)[0];

    if (gridWalls[fr][fc]) {
      gridWalls[fr][fc] = false;
      gridWalls[Math.floor((fr + pr) / 2)][Math.floor((fc + pc) / 2)] = false;
      addFrontier(fr, fc);
    }
  }

  gridWalls[startNode.row][startNode.col] = false;
  gridWalls[endNode.row][endNode.col] = false;

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
