import React from 'react';
import { Activity, Clock, Navigation, Zap, Award, Info } from 'lucide-react';
import { ALGORITHM_INFO } from '../constants/algorithmsInfo';

export function StatsPanel({
  selectedAlgo,
  stats,
  fps,
  isFinished,
}) {
  const info = ALGORITHM_INFO[selectedAlgo];
  const efficiency = stats.visitedCount > 0 
    ? ((stats.pathLength / stats.visitedCount) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="w-full glass-panel border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 items-center">
        {/* Metric 1: Visited Nodes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Visited Nodes</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-extrabold text-sky-400 font-mono">
            {stats.visitedCount}
          </div>
        </div>

        {/* Metric 2: Path Length & Cost */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Shortest Path</span>
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-mono flex items-baseline gap-1.5">
            <span>{stats.pathLength}</span>
            {stats.pathCost > stats.pathLength && (
              <span className="text-xs font-normal text-amber-400">
                (Cost: {stats.pathCost})
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Execution Time */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Compute Time</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-purple-400 font-mono">
            {stats.executionTime.toFixed(1)} <span className="text-xs">ms</span>
          </div>
        </div>

        {/* Metric 4: Search Efficiency */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Search Efficiency</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-400 font-mono">
            {efficiency}%
          </div>
        </div>

        {/* Metric 5: FPS & Algorithm Badge */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Rendering Engine</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              <Zap className="w-3 h-3" />
              <span>{fps} FPS</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${info.badgeColor}`}>
              {info.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
