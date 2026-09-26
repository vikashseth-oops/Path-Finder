import { NODE_TYPES } from '../constants/nodeTypes';

export function generateRandomWeightTerrain(grid, startNode, endNode) {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const terrainNodes = [];

  const weightTypes = [NODE_TYPES.WEIGHT_WATER, NODE_TYPES.WEIGHT_MUD, NODE_TYPES.WEIGHT_FOREST];

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if ((r === startNode.row && c === startNode.col) || (r === endNode.row && c === endNode.col)) {
        continue;
      }
      
      const rand = Math.random();
      if (rand < 0.25) {
        // Place wall
        terrainNodes.push({ row: r, col: c, type: NODE_TYPES.WALL });
      } else if (rand < 0.40) {
        // Place Mud
        terrainNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_MUD });
      } else if (rand < 0.50) {
        // Place Forest
        terrainNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_FOREST });
      } else if (rand < 0.60) {
        // Place Water
        terrainNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_WATER });
      }
    }
  }

  return terrainNodes;
}
