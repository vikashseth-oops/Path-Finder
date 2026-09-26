import { NODE_TYPES } from '../constants/nodeTypes';
import { getNodesInShortestPathOrder } from './dijkstra';

export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode];
  startNode.distance = 0;

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode.type === NODE_TYPES.WALL) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      const shortestPath = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, shortestPath };
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && neighbor.type !== NODE_TYPES.WALL) {
        neighbor.previousNode = currentNode;
        neighbor.distance = currentNode.distance + 1;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] };
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);

  return neighbors;
}
