import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  aiHealth,
  hasActiveProfile,
  onResetProfile,
  onOpenAbout
}) {
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
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Evidence-based government scheme discovery
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-2 sm:gap-4">
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
        </div>
      </div>
    </header>
  );
}
