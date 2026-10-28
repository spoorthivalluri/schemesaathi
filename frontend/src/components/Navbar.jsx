import React from 'react';
import { Compass, Sparkles, RefreshCw, Info, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  aiHealth,
  hasActiveProfile,
  onResetProfile,
  onOpenAbout
}) {
  const isAiOnline = aiHealth?.ai_model?.is_live_ai;
  const modelName = aiHealth?.ai_model?.model || 'Qwen2.5-3B-Instruct';

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-teal-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-teal-300 transition-colors">
                Scheme<span className="text-teal-400">Saathi</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-teal-300">
                Open-Weight AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Evidence-based government scheme discovery
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* AI Model Status Badge */}
          <div 
            onClick={onOpenAbout}
            title={aiHealth?.ai_model?.message || 'AI Model Status'}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">Model:</span>
            <span className="text-slate-200 truncate max-w-[140px] font-mono">{modelName.split('/')[1] || modelName}</span>
            {isAiOnline ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.5 rounded font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.5 rounded font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Deterministic
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              currentView === 'landing' ? 'bg-slate-800 text-teal-300' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentView('wizard')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
              currentView === 'wizard' ? 'bg-slate-800 text-teal-300' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {hasActiveProfile ? 'Edit Profile' : 'Find Schemes'}
          </button>

          {hasActiveProfile && (
            <button
              onClick={() => setCurrentView('results')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                currentView === 'results' ? 'bg-slate-800 text-teal-300' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Results
            </button>
          )}

          {/* Reset Profile */}
          {hasActiveProfile && (
            <button
              onClick={onResetProfile}
              title="Reset profile data"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* About / Architecture Button */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </div>
    </header>
  );
}
