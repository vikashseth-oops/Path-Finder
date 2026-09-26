export const getHeuristic = (nodeA, nodeB, heuristicType = 'manhattan') => {
  const dx = Math.abs(nodeA.col - nodeB.col);
  const dy = Math.abs(nodeA.row - nodeB.row);

  switch (heuristicType) {
    case 'euclidean':
      return Math.sqrt(dx * dx + dy * dy);
    case 'chebyshev':
      return Math.max(dx, dy);
    case 'manhattan':
    default:
      return dx + dy;
  }
};
