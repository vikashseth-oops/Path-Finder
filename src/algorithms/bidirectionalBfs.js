import { NODE_TYPES } from '../constants/nodeTypes';

export function bidirectionalBfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  
  const queueStart = [startNode];
  const queueEnd = [endNode];

  startNode.isVisited = true;
  startNode.distance = 0;
  startNode.visitedFrom = 'START';

  endNode.isVisited = true;
  endNode.distance = 0;
  endNode.visitedFrom = 'END';

  let intersectionNode = null;

  while (queueStart.length > 0 && queueEnd.length > 0) {
    // Step forward from Start side
    if (queueStart.length > 0) {
      const currentStart = queueStart.shift();
      visitedNodesInOrder.push(currentStart);

      const neighbors = getNeighbors(currentStart, grid);
      for (const neighbor of neighbors) {
        if (neighbor.type === NODE_TYPES.WALL) continue;

        if (neighbor.visitedFrom === 'END') {
          neighbor.previousNode = currentStart;
          intersectionNode = neighbor;
          visitedNodesInOrder.push(neighbor);
          break;
        }

        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.visitedFrom = 'START';
          neighbor.previousNode = currentStart;
          queueStart.push(neighbor);
        }
      }
    }

    if (intersectionNode) break;

    // Step backward from End side
    if (queueEnd.length > 0) {
      const currentEnd = queueEnd.shift();
      visitedNodesInOrder.push(currentEnd);

      const neighbors = getNeighbors(currentEnd, grid);
      for (const neighbor of neighbors) {
        if (neighbor.type === NODE_TYPES.WALL) continue;

        if (neighbor.visitedFrom === 'START') {
          // Connect path!
          intersectionNode = currentEnd;
          visitedNodesInOrder.push(neighbor);
          break;
        }

        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.visitedFrom = 'END';
          neighbor.previousNodeReverse = currentEnd;
          queueEnd.push(neighbor);
        }
      }
    }

    if (intersectionNode) break;
  }

  if (intersectionNode) {
    const shortestPath = constructBidirectionalPath(intersectionNode);
    return { visitedNodesInOrder, shortestPath };
  }

  return { visitedNodesInOrder, shortestPath: [] };
}

function constructBidirectionalPath(meetingNode) {
  const path = [];
  
  // Trace back to start
  let curr = meetingNode;
  while (curr !== null) {
    path.unshift(curr);
    curr = curr.previousNode;
  }

  // Trace forward to end
  curr = meetingNode.previousNodeReverse;
  while (curr !== null) {
    path.push(curr);
    curr = curr.previousNodeReverse;
  }

  return path;
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
