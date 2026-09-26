import React from 'react';
import { Sparkles, Volume2, VolumeX, HelpCircle, Swords, Zap, Code } from 'lucide-react';

export function Navbar({ soundEnabled, setSoundEnabled, onOpenAI, onOpenHelp, onOpenRace }) {
  return (
    <header className="w-full glass-panel border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                PathFinder AI Visualizer
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                60 FPS Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:flex items-center gap-1.5 mt-0.5">
              <span>Dijkstra</span> • <span>A* Search</span> • <span>BFS</span> • <span>Recursive Backtracking</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* AI Generator Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
            <span>AI Prompt Generator</span>
          </button>

          {/* Race / Comparison Button */}
          <button
            onClick={onOpenRace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            title="Compare Dijkstra vs A* side-by-side"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Compare Algos</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute Web Audio Synth' : 'Enable Web Audio Synth'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="User Guide & Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
