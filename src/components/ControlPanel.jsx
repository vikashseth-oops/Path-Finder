import React from 'react';
import { Play, RotateCcw, Trash2, Shield, Mountain, Droplets, Eraser, Move, Compass, Sliders, Layers } from 'lucide-react';
import { ALGORITHMS, HEURISTICS, TOOL_MODES } from '../constants/nodeTypes';
import { ALGORITHM_INFO } from '../constants/algorithmsInfo';

export function ControlPanel({
  selectedAlgo,
  setSelectedAlgo,
  selectedHeuristic,
  setSelectedHeuristic,
  selectedTool,
  setSelectedTool,
  gridSize,
  setGridSize,
  speed,
  setSpeed,
  onVisualize,
  onClearPath,
  onClearBoard,
  onGenerateMaze,
  selectedMazeAlgo,
  setSelectedMazeAlgo,
  isVisualizing,
}) {
  const currentAlgoInfo = ALGORITHM_INFO[selectedAlgo];
  const isHeuristicAlgo = selectedAlgo === ALGORITHMS.ASTAR || selectedAlgo === ALGORITHMS.GREEDY_BEST_FIRST;

  return (
    <div className="w-full glass-panel border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl">
      <div className="flex flex-col gap-4">
        {/* Row 1: Algorithm & Maze Selector + Primary Action */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Algorithm Selector */}
          <div className="md:col-span-4 flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              Algorithm
            </label>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value)}
              disabled={isVisualizing}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value={ALGORITHMS.ASTAR}>A* Search Algorithm (Guaranteed Shortest)</option>
              <option value={ALGORITHMS.DIJKSTRA}>Dijkstra's Algorithm (Weighted)</option>
              <option value={ALGORITHMS.BFS}>Breadth-First Search (BFS)</option>
              <option value={ALGORITHMS.BIDIRECTIONAL_BFS}>Bidirectional BFS (Fast Dual)</option>
              <option value={ALGORITHMS.GREEDY_BEST_FIRST}>Greedy Best-First Search</option>
              <option value={ALGORITHMS.DFS}>Depth-First Search (DFS)</option>
            </select>
          </div>

          {/* Heuristic Selector (Dynamic if A* or Greedy) */}
          {isHeuristicAlgo && (
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Heuristic Formula
              </label>
              <select
                value={selectedHeuristic}
                onChange={(e) => setSelectedHeuristic(e.target.value)}
                disabled={isVisualizing}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value={HEURISTICS.MANHATTAN}>Manhattan Distance (|dx| + |dy|)</option>
                <option value={HEURISTICS.EUCLIDEAN}>Euclidean Distance (Straight Line)</option>
                <option value={HEURISTICS.CHEBYSHEV}>Chebyshev Distance (Max Coord)</option>
              </select>
            </div>
          )}

          {/* Maze Algorithm Generator */}
          <div className={`${isHeuristicAlgo ? 'md:col-span-3' : 'md:col-span-4'} flex flex-col gap-1`}>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Maze & Terrain Generator
            </label>
            <div className="flex gap-2">
              <select
                value={selectedMazeAlgo}
                onChange={(e) => setSelectedMazeAlgo(e.target.value)}
                disabled={isVisualizing}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="recursiveBacktracking">Recursive Backtracking (Custom Resume Spec)</option>
                <option value="prims">Randomized Prim's Algorithm</option>
                <option value="randomWeight">Random Weighted Terrain (Mud/Forest/Water)</option>
              </select>
              <button
                onClick={() => onGenerateMaze(selectedMazeAlgo)}
                disabled={isVisualizing}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className={`${isHeuristicAlgo ? 'md:col-span-2' : 'md:col-span-4'} flex items-end mt-2 md:mt-0`}>
            <button
              onClick={onVisualize}
              disabled={isVisualizing}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Visualize {selectedAlgo.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Drawing Palette & Grid Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          {/* Drawing Tools Palette */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">Paint Tool:</span>
            
            <button
              onClick={() => setSelectedTool(TOOL_MODES.WALL)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                selectedTool === TOOL_MODES.WALL
                  ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-slate-400"></span>
              <span>Wall (🧱)</span>
            </button>

            <button
              onClick={() => setSelectedTool(TOOL_MODES.WEIGHT_MUD)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                selectedTool === TOOL_MODES.WEIGHT_MUD
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-amber-300'
              }`}
            >
              <span className="w-3 h-3 rounded-xs bg-amber-600"></span>
              <span>Mud (5x)</span>
            </button>

            <button
              onClick={() => setSelectedTool(TOOL_MODES.WEIGHT_FOREST)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                selectedTool === TOOL_MODES.WEIGHT_FOREST
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-emerald-300'
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Forest (15x)</span>
            </button>

            <button
              onClick={() => setSelectedTool(TOOL_MODES.WEIGHT_WATER)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                selectedTool === TOOL_MODES.WEIGHT_WATER
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-cyan-300'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Water (3x)</span>
            </button>

            <button
              onClick={() => setSelectedTool(TOOL_MODES.ERASER)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                selectedTool === TOOL_MODES.ERASER
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-rose-300'
              }`}
            >
              <Eraser className="w-3.5 h-3.5 text-rose-400" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Grid Size & Animation Speed Controls */}
          <div className="flex items-center gap-3 flex-wrap ml-auto">
            {/* Grid Dimension Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-semibold">Grid:</span>
              <select
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                disabled={isVisualizing}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 font-medium"
              >
                <option value={20}>20 x 20 (Compact)</option>
                <option value={30}>30 x 30 (Medium)</option>
                <option value={40}>40 x 40 (Large)</option>
                <option value={50}>50 x 50 (Resume Spec 60FPS)</option>
                <option value={60}>60 x 60 (Ultra HD)</option>
              </select>
            </div>

            {/* Speed Slider */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-semibold">Speed:</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isVisualizing}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 font-medium"
              >
                <option value={0}>⚡ Instant (0 ms)</option>
                <option value={5}>🚀 Ultra Fast (5 ms)</option>
                <option value={15}>🔥 Fast (15 ms)</option>
                <option value={30}>🐢 Normal (30 ms)</option>
              </select>
            </div>

            {/* Clear Actions */}
            <button
              onClick={onClearPath}
              disabled={isVisualizing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer border border-slate-700 disabled:opacity-50"
              title="Clear visited paths and shortest path"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Clear Path</span>
            </button>

            <button
              onClick={onClearBoard}
              disabled={isVisualizing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-all cursor-pointer border border-rose-800/50 disabled:opacity-50"
              title="Clear entire grid including walls"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Board</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
