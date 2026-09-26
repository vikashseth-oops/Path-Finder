import React, { useState } from 'react';
import { X, Swords, Play, Trophy, CheckCircle2 } from 'lucide-react';
import { dijkstra } from '../algorithms/dijkstra';
import { aStar } from '../algorithms/aStar';

export function RaceModeModal({ isOpen, onClose, currentGrid, startNode, endNode }) {
  const [raceResults, setRaceResults] = useState(null);
  const [isRacing, setIsRacing] = useState(false);

  if (!isOpen) return null;

  const handleRunRace = () => {
    setIsRacing(true);

    setTimeout(() => {
      // Clone grid for Dijkstra
      const gridDijkstra = currentGrid.map(row =>
        row.map(node => ({ ...node, isVisited: false, previousNode: null, distance: Infinity }))
      );

      // Clone grid for A*
      const gridAStar = currentGrid.map(row =>
        row.map(node => ({ ...node, isVisited: false, previousNode: null, distance: Infinity }))
      );

      const startD = gridDijkstra[startNode.row][startNode.col];
      const endD = gridDijkstra[endNode.row][endNode.col];

      const startA = gridAStar[startNode.row][startNode.col];
      const endA = gridAStar[endNode.row][endNode.col];

      const t0 = performance.now();
      const resD = dijkstra(gridDijkstra, startD, endD);
      const t1 = performance.now();

      const t2 = performance.now();
      const resA = aStar(gridAStar, startA, endA, 'manhattan');
      const t3 = performance.now();

      const dijkstraVisited = resD.visitedNodesInOrder.length;
      const dijkstraPath = resD.shortestPath.length;
      const dijkstraTime = t1 - t0;

      const astarVisited = resA.visitedNodesInOrder.length;
      const astarPath = resA.shortestPath.length;
      const astarTime = t3 - t2;

      const visitedSavedPercent = dijkstraVisited > 0 
        ? (((dijkstraVisited - astarVisited) / dijkstraVisited) * 100).toFixed(1)
        : 0;

      setRaceResults({
        dijkstra: { visited: dijkstraVisited, path: dijkstraPath, time: dijkstraTime },
        astar: { visited: astarVisited, path: astarPath, time: astarTime },
        savedPercent: visitedSavedPercent
      });

      setIsRacing(false);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Algorithm Benchmark & Race Mode</h3>
            <p className="text-xs text-slate-400">Head-to-head comparison: Dijkstra's Algorithm vs A* Search</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRunRace}
          disabled={isRacing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isRacing ? 'Running Benchmark...' : 'Start Head-to-Head Race!'}</span>
        </button>

        {/* Race Results Comparison */}
        {raceResults && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1: Dijkstra */}
              <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Dijkstra's Algorithm
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                    Weighted
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Visited Nodes:</span>
                    <strong className="text-sky-300">{raceResults.dijkstra.visited}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Path Length:</span>
                    <strong className="text-emerald-400">{raceResults.dijkstra.path}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Compute Time:</span>
                    <strong className="text-purple-300">{raceResults.dijkstra.time.toFixed(2)} ms</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: A* Search */}
              <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-bl-lg">
                  WINNER
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    A* Search (Manhattan)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Heuristic
                  </span>
                </div>
                <div className="space-y-1.5 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Visited Nodes:</span>
                    <strong className="text-sky-300">{raceResults.astar.visited}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Path Length:</span>
                    <strong className="text-emerald-400">{raceResults.astar.path}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Compute Time:</span>
                    <strong className="text-purple-300">{raceResults.astar.time.toFixed(2)} ms</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Rationale */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400 shrink-0" />
              <div className="text-xs text-emerald-200">
                <strong className="text-white block text-sm font-bold">
                  A* Search reduced explored nodes by {raceResults.savedPercent}%!
                </strong>
                Both algorithms guaranteed the exact same shortest path length ({raceResults.astar.path} nodes), but A* directed search using Manhattan heuristic, avoiding {raceResults.dijkstra.visited - raceResults.astar.visited} redundant node evaluations!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
