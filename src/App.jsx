import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { ControlPanel } from './components/ControlPanel';
import { Grid } from './components/Grid';
import { StatsPanel } from './components/StatsPanel';
import { AIInsightsCard } from './components/AIInsightsCard';
import { AIPromptModal } from './components/AIPromptModal';
import { HelpModal } from './components/HelpModal';
import { RaceModeModal } from './components/RaceModeModal';

import { ALGORITHMS, HEURISTICS, NODE_TYPES, TOOL_MODES, WEIGHT_VALUES } from './constants/nodeTypes';
import { dijkstra } from './algorithms/dijkstra';
import { aStar } from './algorithms/aStar';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { greedyBestFirst } from './algorithms/greedyBestFirst';
import { bidirectionalBfs } from './algorithms/bidirectionalBfs';

import { generateRecursiveBacktrackingMaze } from './mazes/recursiveBacktracking';
import { generatePrimsMaze } from './mazes/prims';
import { generateRandomWeightTerrain } from './mazes/randomWeightTerrain';

import { parseAIPromptAndGenerateGrid, getAIAlgorithmAdvisor, generateAIInsights } from './utils/aiEngine';
import { soundFx } from './utils/audio';

export default function App() {
  // Grid Dimensions & State
  const [gridSize, setGridSize] = useState(50); // Resume Spec: 50x50 Grid
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ row: 25, col: 8 });
  const [endNode, setEndNode] = useState({ row: 25, col: 42 });

  // Control State
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS.ASTAR);
  const [selectedHeuristic, setSelectedHeuristic] = useState(HEURISTICS.MANHATTAN);
  const [selectedMazeAlgo, setSelectedMazeAlgo] = useState('recursiveBacktracking');
  const [selectedTool, setSelectedTool] = useState(TOOL_MODES.WALL);
  const [speed, setSpeed] = useState(5); // 5ms default Ultra Fast 60FPS

  // App Features
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isPathFound, setIsPathFound] = useState(false);

  // Interaction Drag State
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isRaceModalOpen, setIsRaceModalOpen] = useState(false);

  // Performance & Stats
  const [fps, setFps] = useState(60);
  const [stats, setStats] = useState({
    visitedCount: 0,
    pathLength: 0,
    pathCost: 0,
    executionTime: 0,
  });
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);

  // Animation Timers Ref
  const animationTimeoutsRef = useRef([]);

  // Initialize Grid Matrix
  const createInitialGrid = useCallback((size, startPos, endPos) => {
    const newGrid = [];
    for (let r = 0; r < size; r++) {
      const currentRow = [];
      for (let c = 0; c < size; c++) {
        let type = NODE_TYPES.EMPTY;
        if (r === startPos.row && c === startPos.col) type = NODE_TYPES.START;
        else if (r === endPos.row && c === endPos.col) type = NODE_TYPES.END;

        currentRow.push({
          row: r,
          col: c,
          type,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          heuristicDistance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
          previousNodeReverse: null,
          visitedFrom: null,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, []);

  // Update Grid when Size Changes
  useEffect(() => {
    const startPos = { row: Math.floor(gridSize / 2), col: Math.floor(gridSize * 0.15) };
    const endPos = { row: Math.floor(gridSize / 2), col: Math.floor(gridSize * 0.85) };
    setStartNode(startPos);
    setEndNode(endPos);
    setGrid(createInitialGrid(gridSize, startPos, endPos));
    setIsPathFound(false);
  }, [gridSize, createInitialGrid]);

  // FPS Counter Ref
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Clear Animation Timeouts
  const clearTimeouts = () => {
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current = [];
  };

  // Reset Visited States & Shortest Path (Keep Walls & Weights)
  const clearPathOnly = useCallback((currentGridMatrix = grid) => {
    clearTimeouts();
    setIsVisualizing(false);
    setIsPathFound(false);

    const newGrid = currentGridMatrix.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
        previousNodeReverse: null,
        visitedFrom: null,
      }))
    );
    setGrid(newGrid);
    return newGrid;
  }, [grid]);

  // Clear Entire Board (Remove Walls & Weights)
  const clearBoardCompletely = () => {
    clearTimeouts();
    setIsVisualizing(false);
    setIsPathFound(false);
    setAiExplanation(null);
    setAiInsights(null);
    setGrid(createInitialGrid(gridSize, startNode, endNode));
  };

  // Run Selected Algorithm Engine
  const runAlgorithmEngine = useCallback((gridMatrix, start, end, algo, heuristic) => {
    // Clone grid nodes for pure calculation
    const clonedGrid = gridMatrix.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
        previousNodeReverse: null,
        visitedFrom: null,
      }))
    );

    const startN = clonedGrid[start.row][start.col];
    const endN = clonedGrid[end.row][end.col];

    let result = { visitedNodesInOrder: [], shortestPath: [] };

    switch (algo) {
      case ALGORITHMS.ASTAR:
        result = aStar(clonedGrid, startN, endN, heuristic);
        break;
      case ALGORITHMS.DIJKSTRA:
        result = dijkstra(clonedGrid, startN, endN);
        break;
      case ALGORITHMS.BFS:
        result = bfs(clonedGrid, startN, endN);
        break;
      case ALGORITHMS.DFS:
        result = dfs(clonedGrid, startN, endN);
        break;
      case ALGORITHMS.GREEDY_BEST_FIRST:
        result = greedyBestFirst(clonedGrid, startN, endN, heuristic);
        break;
      case ALGORITHMS.BIDIRECTIONAL_BFS:
        result = bidirectionalBfs(clonedGrid, startN, endN);
        break;
      default:
        result = aStar(clonedGrid, startN, endN, heuristic);
        break;
    }

    return result;
  }, []);

  // Animate Visualization Engine (60 FPS requestAnimationFrame Queue)
  const animateVisualization = (visitedNodesInOrder, shortestPath, pathCost, execTime) => {
    setIsVisualizing(true);
    clearTimeouts();

    if (speed === 0) {
      // Instant Mode: Update immediately
      const newGrid = grid.map(row => row.map(node => ({ ...node })));

      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        const node = visitedNodesInOrder[i];
        if (node.type !== NODE_TYPES.START && node.type !== NODE_TYPES.END) {
          newGrid[node.row][node.col].isVisited = true;
        }
      }

      for (let i = 0; i < shortestPath.length; i++) {
        const node = shortestPath[i];
        if (node.type !== NODE_TYPES.START && node.type !== NODE_TYPES.END) {
          newGrid[node.row][node.col].isShortestPath = true;
        }
      }

      setGrid(newGrid);
      setIsVisualizing(false);
      setIsPathFound(true);
      setStats({
        visitedCount: visitedNodesInOrder.length,
        pathLength: shortestPath.length,
        pathCost,
        executionTime: execTime,
      });
      setAiInsights(generateAIInsights(selectedAlgo, visitedNodesInOrder.length, shortestPath.length, pathCost, execTime));

      if (shortestPath.length > 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        soundFx.playSuccessSound();
      }
      return;
    }

    // Step-by-Step Animation Queue
    const newGrid = clearPathOnly(grid);
    const totalVisited = visitedNodesInOrder.length;

    visitedNodesInOrder.forEach((node, i) => {
      const timeout = setTimeout(() => {
        if (node.type !== NODE_TYPES.START && node.type !== NODE_TYPES.END) {
          setGrid((prevGrid) => {
            const nextGrid = prevGrid.map(row => [...row]);
            nextGrid[node.row][node.col] = {
              ...nextGrid[node.row][node.col],
              isVisited: true,
            };
            return nextGrid;
          });
          if (soundEnabled && i % 4 === 0) {
            soundFx.playStepSound(i / totalVisited);
          }
        }
      }, i * speed);
      animationTimeoutsRef.current.push(timeout);
    });

    // Animate Shortest Path after visited nodes complete
    const totalVisitTime = visitedNodesInOrder.length * speed;

    shortestPath.forEach((node, i) => {
      const timeout = setTimeout(() => {
        if (node.type !== NODE_TYPES.START && node.type !== NODE_TYPES.END) {
          setGrid((prevGrid) => {
            const nextGrid = prevGrid.map(row => [...row]);
            nextGrid[node.row][node.col] = {
              ...nextGrid[node.row][node.col],
              isShortestPath: true,
            };
            return nextGrid;
          });
        }
        if (i === shortestPath.length - 1) {
          setIsVisualizing(false);
          setIsPathFound(true);
          setStats({
            visitedCount: visitedNodesInOrder.length,
            pathLength: shortestPath.length,
            pathCost,
            executionTime: execTime,
          });
          setAiInsights(generateAIInsights(selectedAlgo, visitedNodesInOrder.length, shortestPath.length, pathCost, execTime));
          
          if (shortestPath.length > 0) {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
            soundFx.playSuccessSound();
          }
        }
      }, totalVisitTime + i * (speed * 2));
      animationTimeoutsRef.current.push(timeout);
    });
  };

  // Primary Action: Visualize Path
  const handleVisualize = () => {
    if (isVisualizing) return;
    const cleanGrid = clearPathOnly(grid);

    const startTime = performance.now();
    const { visitedNodesInOrder, shortestPath } = runAlgorithmEngine(
      cleanGrid,
      startNode,
      endNode,
      selectedAlgo,
      selectedHeuristic
    );
    const endTime = performance.now();

    let totalWeightCost = 0;
    shortestPath.forEach(node => {
      totalWeightCost += WEIGHT_VALUES[node.type] || 1;
    });

    animateVisualization(visitedNodesInOrder, shortestPath, totalWeightCost, endTime - startTime);
  };

  // Real-Time Path Recalculation on Drag / Wall Edit (if path already calculated)
  const triggerRealtimeRecalculation = (currentGridMatrix, currentStart, currentEnd) => {
    if (!isPathFound || isVisualizing) return;

    const cleanGrid = currentGridMatrix.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
      }))
    );

    const startTime = performance.now();
    const { visitedNodesInOrder, shortestPath } = runAlgorithmEngine(
      cleanGrid,
      currentStart,
      currentEnd,
      selectedAlgo,
      selectedHeuristic
    );
    const endTime = performance.now();

    let totalWeightCost = 0;
    shortestPath.forEach(node => {
      totalWeightCost += WEIGHT_VALUES[node.type] || 1;
    });

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const n = visitedNodesInOrder[i];
      if (n.type !== NODE_TYPES.START && n.type !== NODE_TYPES.END) {
        cleanGrid[n.row][n.col].isVisited = true;
      }
    }

    for (let i = 0; i < shortestPath.length; i++) {
      const n = shortestPath[i];
      if (n.type !== NODE_TYPES.START && n.type !== NODE_TYPES.END) {
        cleanGrid[n.row][n.col].isShortestPath = true;
      }
    }

    setGrid(cleanGrid);
    setStats({
      visitedCount: visitedNodesInOrder.length,
      pathLength: shortestPath.length,
      pathCost: totalWeightCost,
      executionTime: endTime - startTime,
    });
  };

  // Generate Maze Algorithm (Recursive Backtracking, Prim's, Random)
  const handleGenerateMaze = (mazeAlgoType) => {
    if (isVisualizing) return;
    const cleanGrid = createInitialGrid(gridSize, startNode, endNode);
    setGrid(cleanGrid);
    clearPathOnly(cleanGrid);

    let wallsToAnimate = [];

    if (mazeAlgoType === 'recursiveBacktracking') {
      wallsToAnimate = generateRecursiveBacktrackingMaze(cleanGrid, startNode, endNode);
      setAiExplanation("🌀 Generated Maze using Recursive Backtracking stack logic (Resume Feature).");
    } else if (mazeAlgoType === 'prims') {
      wallsToAnimate = generatePrimsMaze(cleanGrid, startNode, endNode);
      setAiExplanation("🌲 Generated Organic Maze using Randomized Prim's algorithm.");
    } else if (mazeAlgoType === 'randomWeight') {
      const terrain = generateRandomWeightTerrain(cleanGrid, startNode, endNode);
      setGrid((prevGrid) => {
        const nextGrid = prevGrid.map(row => [...row]);
        terrain.forEach(node => {
          nextGrid[node.row][node.col].type = node.type;
        });
        return nextGrid;
      });
      setAiExplanation("🏞️ Generated Random Weighted Terrain with Mud (5x), Forest (15x), and Water (3x) hazards.");
      return;
    }

    // Animate Wall Placement
    setIsVisualizing(true);
    wallsToAnimate.forEach((wall, i) => {
      const timeout = setTimeout(() => {
        setGrid((prevGrid) => {
          const nextGrid = prevGrid.map(row => [...row]);
          if (
            (wall.row !== startNode.row || wall.col !== startNode.col) &&
            (wall.row !== endNode.row || wall.col !== endNode.col)
          ) {
            nextGrid[wall.row][wall.col] = {
              ...nextGrid[wall.row][wall.col],
              type: NODE_TYPES.WALL,
            };
          }
          return nextGrid;
        });

        if (i === wallsToAnimate.length - 1) {
          setIsVisualizing(false);
        }
      }, i * 3);
      animationTimeoutsRef.current.push(timeout);
    });
  };

  // AI Prompt-to-Maze Generation
  const handleGenerateAITerrain = (promptText) => {
    if (isVisualizing) return;
    const cleanGrid = createInitialGrid(gridSize, startNode, endNode);

    const { wallNodes, weightNodes, explanation } = parseAIPromptAndGenerateGrid(
      promptText,
      gridSize,
      gridSize,
      startNode,
      endNode
    );

    const nextGrid = cleanGrid.map(row => [...row]);
    wallNodes.forEach(w => { nextGrid[w.row][w.col].type = NODE_TYPES.WALL; });
    weightNodes.forEach(w => { nextGrid[w.row][w.col].type = w.type; });

    setGrid(nextGrid);
    setAiExplanation(explanation);
    setIsPathFound(false);
  };

  // Mouse & Touch Pointer Interactions
  const handleNodeToggle = (row, col) => {
    if (isVisualizing) return;
    const node = grid[row][col];

    if (node.type === NODE_TYPES.START) {
      setDraggedNodeType(NODE_TYPES.START);
      return;
    }
    if (node.type === NODE_TYPES.END) {
      setDraggedNodeType(NODE_TYPES.END);
      return;
    }

    const nextGrid = grid.map(r => [...r]);

    if (selectedTool === TOOL_MODES.WALL) {
      nextGrid[row][col].type = node.type === NODE_TYPES.WALL ? NODE_TYPES.EMPTY : NODE_TYPES.WALL;
    } else if (selectedTool === TOOL_MODES.ERASER) {
      nextGrid[row][col].type = NODE_TYPES.EMPTY;
    } else {
      // Weight placement (MUD, FOREST, WATER)
      nextGrid[row][col].type = node.type === selectedTool ? NODE_TYPES.EMPTY : selectedTool;
    }

    setGrid(nextGrid);
    if (isPathFound) {
      triggerRealtimeRecalculation(nextGrid, startNode, endNode);
    }
  };

  const handleMouseDown = (row, col) => {
    setIsMousePressed(true);
    handleNodeToggle(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!isMousePressed || isVisualizing) return;

    if (draggedNodeType === NODE_TYPES.START) {
      if (row === endNode.row && col === endNode.col) return;
      const nextGrid = grid.map(r => [...r]);
      nextGrid[startNode.row][startNode.col].type = NODE_TYPES.EMPTY;
      nextGrid[row][col].type = NODE_TYPES.START;
      setStartNode({ row, col });
      setGrid(nextGrid);
      if (isPathFound) triggerRealtimeRecalculation(nextGrid, { row, col }, endNode);
    } else if (draggedNodeType === NODE_TYPES.END) {
      if (row === startNode.row && col === startNode.col) return;
      const nextGrid = grid.map(r => [...r]);
      nextGrid[endNode.row][endNode.col].type = NODE_TYPES.EMPTY;
      nextGrid[row][col].type = NODE_TYPES.END;
      setEndNode({ row, col });
      setGrid(nextGrid);
      if (isPathFound) triggerRealtimeRecalculation(nextGrid, startNode, { row, col });
    } else {
      handleNodeToggle(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    setDraggedNodeType(null);
  };

  const handleTouchStart = (e, row, col) => {
    handleMouseDown(row, col);
  };

  const handleTouchMove = (e) => {
    if (!isMousePressed) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.id && element.id.startsWith('node-')) {
      const parts = element.id.split('-');
      const r = parseInt(parts[1], 10);
      const c = parseInt(parts[2], 10);
      if (!isNaN(r) && !isNaN(c)) {
        handleMouseEnter(r, c);
      }
    }
  };

  // AI Advisor State
  const advisorInfo = getAIAlgorithmAdvisor(grid, startNode, endNode);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenRace={() => setIsRaceModalOpen(true)}
      />

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Control Panel Bar */}
        <ControlPanel
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          selectedHeuristic={selectedHeuristic}
          setSelectedHeuristic={setSelectedHeuristic}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          gridSize={gridSize}
          setGridSize={setGridSize}
          speed={speed}
          setSpeed={setSpeed}
          onVisualize={handleVisualize}
          onClearPath={() => clearPathOnly()}
          onClearBoard={clearBoardCompletely}
          onGenerateMaze={handleGenerateMaze}
          selectedMazeAlgo={selectedMazeAlgo}
          setSelectedMazeAlgo={setSelectedMazeAlgo}
          isVisualizing={isVisualizing}
        />

        {/* Real-time Stats & Metrics Panel */}
        <StatsPanel
          selectedAlgo={selectedAlgo}
          stats={stats}
          fps={fps}
          isFinished={isPathFound}
        />

        {/* Central Visualizer Canvas / Grid Engine */}
        <div className="w-full flex justify-center">
          <Grid
            grid={grid}
            gridSize={gridSize}
            showHeatmap={showHeatmap}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          />
        </div>

        {/* AI Insights & Strategic Recommendation Card */}
        <AIInsightsCard
          advisor={advisorInfo}
          insights={aiInsights}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          aiExplanation={aiExplanation}
        />
      </main>

      {/* Modals */}
      <AIPromptModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleGenerateAITerrain}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <RaceModeModal
        isOpen={isRaceModalOpen}
        onClose={() => setIsRaceModalOpen(false)}
        currentGrid={grid}
        startNode={startNode}
        endNode={endNode}
      />
    </div>
  );
}
