import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Filter, 
  Edit3, 
  Layers, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import SchemeCard from './SchemeCard';

export default function ResultsDashboard({
  matchResults,
  onOpenDetails,
  onOpenBridge,
  onEditProfile,
  onReset
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!matchResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">No matching evaluations available. Please complete your profile first.</p>
        <button
          onClick={onEditProfile}
          className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Enter Profile
        </button>
      </div>
    );
  }

  const { summary, potential_matches, needs_info, unmet, all_results } = matchResults;

  // Filter schemes based on active tab
  let displayedSchemes = all_results || [];
  if (activeFilter === 'potential_matches') {
    displayedSchemes = potential_matches;
  } else if (activeFilter === 'needs_info') {
    displayedSchemes = needs_info;
  } else if (activeFilter === 'unmet') {
    displayedSchemes = unmet;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Government Scheme Discovery Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluated against {summary.total_schemes} curated statutory schemes using deterministic rules and source-grounded evidence.
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-slate-500" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Missing Fields Alert Bar (if any mandatory fields are missing) */}
      {summary.missing_fields && summary.missing_fields.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Missing Profile Fields Detected: </span>
              <span>
                Your profile is missing{' '}
                <strong className="underline">
                  {summary.missing_fields.map((f) => f.replace('_', ' ')).join(', ')}
                </strong>
                . Adding these fields enables definitive eligibility checks rather than unresolved status.
              </span>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex-shrink-0 text-xs shadow-sm transition-colors"
          >
            Complete Missing Info
          </button>
        </div>
      )}

      {/* Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Matches */}
        <div 
          onClick={() => setActiveFilter('potential_matches')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'potential_matches'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potential Matches</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-heading">
            {summary.potential_matches_count}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Mandatory criteria appear satisfied based on reported circumstances.
          </p>
        </div>

        {/* Needs Information */}
        <div 
          onClick={() => setActiveFilter('needs_info')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'needs_info'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Needs Information</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-heading">
            {summary.needs_info_count}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Key fields or verification conditions need to be confirmed.
          </p>
        </div>

        {/* Unmet Requirements */}
        <div 
          onClick={() => setActiveFilter('unmet')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'unmet'
              ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-rose-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unmet Requirements</span>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900 font-heading">
            {summary.unmet_count}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Failed verified thresholds (Eligible for Bridge the Gap alternatives).
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Schemes:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Schemes ({all_results?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('potential_matches')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'potential_matches' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Potential Matches ({potential_matches?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('needs_info')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'needs_info' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Info ({needs_info?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('unmet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'unmet' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unmet ({unmet?.length || 0})
          </button>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {displayedSchemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No schemes match the selected filter category.</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-3 px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Show All Schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedSchemes.map((res) => (
            <SchemeCard
              key={res.scheme.id}
              result={res}
              onOpenDetails={onOpenDetails}
              onOpenBridge={onOpenBridge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
