import { NODE_TYPES, WEIGHT_VALUES } from '../constants/nodeTypes';
import { getHeuristic } from '../utils/heuristics';
import { getNodesInShortestPathOrder } from './dijkstra';

export function aStar(grid, startNode, endNode, heuristicType = 'manhattan') {
  const visitedNodesInOrder = [];
  
  startNode.distance = 0; // g(n)
  startNode.heuristicDistance = getHeuristic(startNode, endNode, heuristicType); // h(n)
  startNode.totalDistance = startNode.distance + startNode.heuristicDistance; // f(n)

  const openSet = [startNode];

  while (openSet.length > 0) {
    // Pick node with lowest f(n) totalDistance (break ties with lowest h(n))
    openSet.sort((nodeA, nodeB) => {
      if (nodeA.totalDistance === nodeB.totalDistance) {
        return nodeA.heuristicDistance - nodeB.heuristicDistance;
      }
      return nodeA.totalDistance - nodeB.totalDistance;
    });

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
      if (neighbor.isVisited || neighbor.type === NODE_TYPES.WALL) continue;

      const stepWeight = WEIGHT_VALUES[neighbor.type] || 1;
      const tentativeG = currentNode.distance + stepWeight;

      if (tentativeG < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeG;
        neighbor.heuristicDistance = getHeuristic(neighbor, endNode, heuristicType);
        neighbor.totalDistance = neighbor.distance + neighbor.heuristicDistance;

        if (!openSet.includes(neighbor)) {
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
