import { NODE_TYPES } from '../constants/nodeTypes';
import { getHeuristic } from '../utils/heuristics';
import { getNodesInShortestPathOrder } from './dijkstra';

export function greedyBestFirst(grid, startNode, endNode, heuristicType = 'manhattan') {
  const visitedNodesInOrder = [];
  
  startNode.heuristicDistance = getHeuristic(startNode, endNode, heuristicType);
  startNode.distance = 0;

  const openSet = [startNode];

  while (openSet.length > 0) {
    // Sort strictly by heuristic distance h(n)
    openSet.sort((nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance);
    const currentNode = openSet.shift();

    if (currentNode.type === NODE_TYPES.WALL) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      const shortestPath = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, shortestPath };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && neighbor.type !== NODE_TYPES.WALL) {
        if (!openSet.includes(neighbor) && neighbor.previousNode === null) {
          neighbor.previousNode = currentNode;
          neighbor.distance = currentNode.distance + 1;
          neighbor.heuristicDistance = getHeuristic(neighbor, endNode, heuristicType);
          openSet.push(neighbor);
        }
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] };
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}
