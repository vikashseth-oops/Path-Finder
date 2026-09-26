import React from 'react';
import { Rocket, Target, Star, Mountain, Droplets } from 'lucide-react';
import { NODE_TYPES } from '../constants/nodeTypes';

export const Node = React.memo(function Node({
  row,
  col,
  type,
  isVisited,
  isShortestPath,
  heuristicValue,
  showHeatmap,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onTouchStart,
  onTouchMove,
}) {
  const isStart = type === NODE_TYPES.START;
  const isEnd = type === NODE_TYPES.END;
  const isWaypoint = type === NODE_TYPES.WAYPOINT;
  const isWall = type === NODE_TYPES.WALL;
  const isMud = type === NODE_TYPES.WEIGHT_MUD;
  const isForest = type === NODE_TYPES.WEIGHT_FOREST;
  const isWater = type === NODE_TYPES.WEIGHT_WATER;

  // Compute CSS classes based on state
  let extraClass = 'bg-slate-900/80 border-slate-800/80';

  if (isStart) {
    extraClass = 'bg-emerald-500 shadow-md shadow-emerald-500/50 scale-105 z-10 border-emerald-400';
  } else if (isEnd) {
    extraClass = 'bg-rose-500 shadow-md shadow-rose-500/50 scale-105 z-10 border-rose-400';
  } else if (isWaypoint) {
    extraClass = 'bg-amber-500 shadow-md shadow-amber-500/50 scale-105 z-10 border-amber-400';
  } else if (isWall) {
    extraClass = 'bg-slate-800 border-slate-700 animate-wall shadow-inner';
  } else if (isShortestPath) {
    extraClass = 'animate-shortest-path z-10';
  } else if (isVisited) {
    extraClass = 'animate-visited';
  } else if (isMud) {
    extraClass = 'bg-amber-900/70 border-amber-800/80 text-amber-300';
  } else if (isForest) {
    extraClass = 'bg-emerald-950/90 border-emerald-800/80 text-emerald-300';
  } else if (isWater) {
    extraClass = 'bg-cyan-950/80 border-cyan-800/80 text-cyan-300';
  }

  // Optional AI Heatmap Overlay color
  let heatmapBg = '';
  if (showHeatmap && !isStart && !isEnd && !isWall && heuristicValue !== undefined) {
    const intensity = Math.min(1, heuristicValue / 60);
    const alpha = (1 - intensity) * 0.4;
    heatmapBg = `rgba(99, 102, 241, ${alpha})`;
  }

  return (
    <div
      id={`node-${row}-${col}`}
      style={{ backgroundColor: heatmapBg || undefined }}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      onTouchStart={(e) => onTouchStart(e, row, col)}
      onTouchMove={(e) => onTouchMove(e)}
      className={`relative w-full aspect-square border border-[0.5px] rounded-[3px] transition-colors duration-75 flex items-center justify-center text-[10px] select-none cursor-pointer hover:border-indigo-400/60 ${extraClass}`}
    >
      {isStart && <Rocket className="w-3.5 h-3.5 text-white animate-bounce-short" />}
      {isEnd && <Target className="w-3.5 h-3.5 text-white animate-pulse" />}
      {isWaypoint && <Star className="w-3.5 h-3.5 text-white fill-current" />}
      {isForest && !isVisited && !isShortestPath && <Mountain className="w-2.5 h-2.5 opacity-70" />}
      {isWater && !isVisited && !isShortestPath && <Droplets className="w-2.5 h-2.5 opacity-70" />}
      {isMud && !isVisited && !isShortestPath && <span className="font-mono text-[9px] font-bold opacity-60">5x</span>}
    </div>
  );
});
