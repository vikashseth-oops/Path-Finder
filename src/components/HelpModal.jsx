import React from 'react';
import { X, MousePointer, Rocket, Target, Shield, Mountain, Droplets, Sparkles, BookOpen } from 'lucide-react';

export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel border border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Visualizer Guide & Resume Features</h3>
            <p className="text-xs text-slate-400">Interactive Pathfinding Engine Overview</p>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4 text-xs text-slate-300">
          {/* Section 1: Resume Key Highlights */}
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4">
            <h4 className="font-bold text-indigo-300 text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Project Highlights
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li><strong>60 FPS Animation Engine:</strong> Smooth rendering loop with instant real-time drag preview.</li>
              <li><strong>50x50 Grid Optimization:</strong> High performance grid scaling from 20x20 up to 60x60 cells.</li>
              <li><strong>Recursive Backtracking Maze:</strong> Custom backtracker stack maze generation algorithm.</li>
              <li><strong>AI Integration:</strong> Natural prompt-to-maze generator, AI algorithm advisor, & heuristic heatmaps.</li>
            </ul>
          </div>

          {/* Section 2: Legend & Controls */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-slate-200 text-sm mb-3">Grid Legend & Tools</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span><strong>Start Node:</strong> Drag to move starting point</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-rose-500 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <span><strong>End Node:</strong> Target destination</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700"></div>
                <span><strong>Wall (🧱):</strong> Impassable obstacle</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-900/80 border border-amber-700 flex items-center justify-center text-[10px] text-amber-300 font-mono">5x</div>
                <span><strong>Mud:</strong> Traversal cost 5x</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-700 flex items-center justify-center">
                  <Mountain className="w-3 h-3 text-emerald-400" />
                </div>
                <span><strong>Forest:</strong> Traversal cost 15x</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-700 flex items-center justify-center">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                </div>
                <span><strong>Water:</strong> Traversal cost 3x</span>
              </div>
            </div>
          </div>

          {/* Section 3: Interactions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-sky-400" />
              Mouse & Touch Gestures
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Click & Drag:</strong> Paint walls or weights on the grid.</li>
              <li><strong>Drag Nodes:</strong> Click and hold Start 🚀 or End 🎯 to move them across the grid.</li>
              <li><strong>Real-Time Preview:</strong> Dragging nodes after path is found instantly updates path at 60 FPS!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
