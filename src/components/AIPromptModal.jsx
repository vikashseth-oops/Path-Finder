import React, { useState } from 'react';
import { Sparkles, X, Wand2, Shield, Compass, TrafficCone, Trees, Waves } from 'lucide-react';

export function AIPromptModal({ isOpen, onClose, onGenerate }) {
  const [promptText, setPromptText] = useState('');

  if (!isOpen) return null;

  const samplePrompts = [
    {
      title: "Spiral Dungeon Challenge",
      icon: <Compass className="w-4 h-4 text-purple-400" />,
      text: "Create a concentric spiral maze structure forcing pathfinding around outer perimeters."
    },
    {
      title: "Double Bottleneck Fortress",
      icon: <Shield className="w-4 h-4 text-indigo-400" />,
      text: "Build a double bottleneck fortress barrier with narrow choke points."
    },
    {
      title: "Urban Traffic Jam",
      icon: <TrafficCone className="w-4 h-4 text-amber-400" />,
      text: "Simulate a city traffic grid with heavy mud and forest weight penalties."
    },
    {
      title: "Serpentine River & Mud",
      icon: <Waves className="w-4 h-4 text-cyan-400" />,
      text: "Generate a serpentine river water channel surrounded by mud swamps."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (promptText.trim()) {
      onGenerate(promptText);
      onClose();
    }
  };

  const handleSelectSample = (text) => {
    setPromptText(text);
    onGenerate(text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel-glow border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Terrain & Maze Prompt Generator</h3>
            <p className="text-xs text-slate-400">Describe a scenario or choose an AI prompt preset</p>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Create a narrow spiral dungeon maze with heavy mud swamps in the center..."
              className="w-full bg-slate-900/90 border border-slate-700/90 rounded-2xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!promptText.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate AI Terrain</span>
          </button>
        </form>

        {/* Preset Prompt Suggestions */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2.5">
            Or Choose an AI Preset:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample.text)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-950/60 transition-colors">
                  {sample.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    {sample.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">
                    {sample.text}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
