import { NODE_TYPES, WEIGHT_VALUES } from '../constants/nodeTypes';

export function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length > 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, skip it
    if (closestNode.type === NODE_TYPES.WALL) continue;

    // If closest node distance is Infinity, we are trapped
    if (closestNode.distance === Infinity) return { visitedNodesInOrder, shortestPath: [] };

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
      const shortestPath = getNodesInShortestPathOrder(endNode);
      return { visitedNodesInOrder, shortestPath };
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return { visitedNodesInOrder, shortestPath: [] };
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const weightCost = WEIGHT_VALUES[neighbor.type] || 1;
    const newDistance = node.distance + weightCost;
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.previousNode = node;
    }
  }
}

export function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  const numRows = grid.length;
  const numCols = grid[0].length;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
