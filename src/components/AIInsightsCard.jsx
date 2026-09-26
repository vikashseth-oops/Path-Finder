import React from 'react';
import { Bot, Lightbulb, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export function AIInsightsCard({
  advisor,
  insights,
  showHeatmap,
  setShowHeatmap,
  aiExplanation,
}) {
  return (
    <div className="w-full glass-panel border border-indigo-500/20 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Pathfinding Advisor & Insights
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </h3>
              <p className="text-xs text-slate-400">Smart analysis of grid layout and algorithm performance</p>
            </div>
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showHeatmap
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {showHeatmap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHeatmap ? 'Heatmap: Active' : 'Show Heuristic Heatmap'}</span>
          </button>
        </div>

        {/* AI Prompt Rationale if available */}
        {aiExplanation && (
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>{aiExplanation}</span>
          </div>
        )}

        {/* AI Recommendation & Rationale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Advisor Recommendation */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-400">
                AI Strategic Recommendation
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Confidence: {advisor.confidence}
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{advisor.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {advisor.reason}
            </p>
          </div>

          {/* Post-Run AI Insights */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-400">
                Execution Takeaway
              </span>
            </div>
            {insights ? (
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {insights.takeaway}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Run visualization to generate post-execution efficiency insights.
              </p>
            )}
            {insights && (
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3 pt-2 border-t border-slate-800">
                <span>Efficiency: <strong className="text-amber-400">{insights.efficiencyRatio}</strong></span>
                <span>Explored: <strong className="text-sky-400">{insights.visitedCount}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
