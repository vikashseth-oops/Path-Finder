import { NODE_TYPES } from '../constants/nodeTypes';

export function parseAIPromptAndGenerateGrid(prompt, numRows, numCols, currentStart, currentEnd) {
  const lowerPrompt = prompt.toLowerCase();
  const wallNodes = [];
  const weightNodes = [];

  let explanation = "AI generated a custom terrain based on your prompt requirements.";

  if (lowerPrompt.includes('spiral') || lowerPrompt.includes('dungeon')) {
    explanation = "🌀 AI built a concentric spiral maze structure forcing pathfinding around outer perimeters with central weight traps.";
    const midR = Math.floor(numRows / 2);
    const midC = Math.floor(numCols / 2);
    for (let ring = 2; ring < Math.min(midR, midC) - 2; ring += 2) {
      for (let r = ring; r < numRows - ring; r++) {
        wallNodes.push({ row: r, col: ring });
        wallNodes.push({ row: r, col: numCols - 1 - ring });
      }
      for (let c = ring; c < numCols - ring; c++) {
        wallNodes.push({ row: ring, col: c });
        wallNodes.push({ row: numRows - 1 - ring, col: c });
      }
    }
  } else if (lowerPrompt.includes('bottleneck') || lowerPrompt.includes('fortress') || lowerPrompt.includes('gate')) {
    explanation = "🏰 AI constructed dual fortified wall barriers with narrow single-node choke points to test algorithm bottleneck navigation.";
    const midC1 = Math.floor(numCols * 0.35);
    const midC2 = Math.floor(numCols * 0.65);
    const gap1 = Math.floor(numRows * 0.2);
    const gap2 = Math.floor(numRows * 0.8);

    for (let r = 0; r < numRows; r++) {
      if (Math.abs(r - gap1) > 1) wallNodes.push({ row: r, col: midC1 });
      if (Math.abs(r - gap2) > 1) wallNodes.push({ row: r, col: midC2 });
    }
  } else if (lowerPrompt.includes('traffic') || lowerPrompt.includes('urban') || lowerPrompt.includes('city')) {
    explanation = "🌆 AI simulated an urban road grid with heavy mud/forest traffic jams (cost weights 5x-15x) along main arteries.";
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (r % 4 === 0 || c % 4 === 0) {
          if (Math.random() < 0.3) {
            weightNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_FOREST });
          } else if (Math.random() < 0.5) {
            weightNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_MUD });
          }
        } else {
          if (Math.random() < 0.2) wallNodes.push({ row: r, col: c });
        }
      }
    }
  } else if (lowerPrompt.includes('swamp') || lowerPrompt.includes('mud') || lowerPrompt.includes('river')) {
    explanation = "🌊 AI generated a serpentine river water channel surrounded by dense mud swamps requiring weighted shortest-path optimization.";
    const midR = Math.floor(numRows / 2);
    for (let c = 0; c < numCols; c++) {
      const wave = Math.floor(midR + Math.sin(c * 0.3) * (numRows / 4));
      weightNodes.push({ row: wave, col: c, type: NODE_TYPES.WEIGHT_WATER });
      if (wave + 1 < numRows) weightNodes.push({ row: wave + 1, col: c, type: NODE_TYPES.WEIGHT_MUD });
      if (wave - 1 >= 0) weightNodes.push({ row: wave - 1, col: c, type: NODE_TYPES.WEIGHT_FOREST });
    }
  } else {
    explanation = "🧠 AI generated a balanced procedural terrain with wall clusters and weighted terrain hazards.";
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const rand = Math.random();
        if (rand < 0.2) wallNodes.push({ row: r, col: c });
        else if (rand < 0.3) weightNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_MUD });
        else if (rand < 0.35) weightNodes.push({ row: r, col: c, type: NODE_TYPES.WEIGHT_FOREST });
      }
    }
  }

  // Filter out start and end nodes
  const filteredWalls = wallNodes.filter(
    n => !(n.row === currentStart.row && n.col === currentStart.col) &&
         !(n.row === currentEnd.row && n.col === currentEnd.col)
  );
  const filteredWeights = weightNodes.filter(
    n => !(n.row === currentStart.row && n.col === currentStart.col) &&
         !(n.row === currentEnd.row && n.col === currentEnd.col)
  );

  return { wallNodes: filteredWalls, weightNodes: filteredWeights, explanation };
}

export function getAIAlgorithmAdvisor(grid, startNode, endNode) {
  if (!grid || !grid.length || !grid[0] || !startNode || !endNode) {
    return {
      recommendedAlgo: 'astar',
      heuristic: 'manhattan',
      title: 'A* Search (Manhattan Heuristic)',
      confidence: '96%',
      reason: 'Optimal balance of speed and guaranteed shortest path.'
    };
  }

  let wallCount = 0;
  let weightCount = 0;
  const numRows = grid.length;
  const numCols = grid[0].length;
  const totalCells = numRows * numCols;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (grid[r][c].type === NODE_TYPES.WALL) wallCount++;
      else if (grid[r][c].type.startsWith('WEIGHT_')) weightCount++;
    }
  }

  const wallDensity = (wallCount / totalCells) * 100;
  const weightDensity = (weightCount / totalCells) * 100;
  const dx = Math.abs(startNode.col - endNode.col);
  const dy = Math.abs(startNode.row - endNode.row);
  const distance = dx + dy;

  if (weightDensity > 10) {
    return {
      recommendedAlgo: 'astar',
      heuristic: 'manhattan',
      title: 'A* Search (Manhattan Heuristic)',
      confidence: '98%',
      reason: `Grid contains high weighted terrain density (${weightDensity.toFixed(1)}%). A* accounts for terrain weights while guiding path towards goal using Manhattan heuristic.`
    };
  } else if (wallDensity > 30) {
    return {
      recommendedAlgo: 'astar',
      heuristic: 'euclidean',
      title: 'A* Search (Euclidean Heuristic)',
      confidence: '95%',
      reason: `Dense maze obstacle layout (${wallDensity.toFixed(1)}% walls). A* avoids exploring dead ends far faster than Dijkstra or BFS.`
    };
  } else if (distance > 40) {
    return {
      recommendedAlgo: 'bidirectional',
      heuristic: 'manhattan',
      title: 'Bidirectional BFS',
      confidence: '92%',
      reason: `Long distance span (${distance} steps). Bidirectional search expands from both ends simultaneously, reducing explored search area by up to 50%.`
    };
  } else {
    return {
      recommendedAlgo: 'astar',
      heuristic: 'manhattan',
      title: 'A* Search (Manhattan Heuristic)',
      confidence: '96%',
      reason: 'Optimal balance of speed and guaranteed shortest path for this grid layout.'
    };
  }
}

export function generateAIInsights(algoName, visitedCount, pathLength, pathWeight, executionTimeMs) {
  const efficiencyRatio = pathLength > 0 ? ((pathLength / visitedCount) * 100).toFixed(1) : 0;
  
  let takeaway = "";
  if (efficiencyRatio > 50) {
    takeaway = "⚡ High Search Precision! The algorithm stayed extremely close to the ideal path with minimal wasted node exploration.";
  } else if (efficiencyRatio > 25) {
    takeaway = "📊 Balanced Exploration. Explored moderate surrounding nodes to navigate around obstacles efficiently.";
  } else {
    takeaway = "🔍 Wide Area Search. Explored a broad region of the grid to guarantee absolute path optimality.";
  }

  return {
    visitedCount,
    pathLength,
    pathWeight,
    executionTimeMs,
    efficiencyRatio: `${efficiencyRatio}%`,
    takeaway
  };
}
