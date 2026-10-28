import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Edit3, 
  Layers
} from 'lucide-react';
import SchemeCard from './SchemeCard';

export default function ResultsDashboard({
  matchResults,
  onOpenDetails,
  onEditProfile
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  if (!matchResults) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500">No profile evaluation available.</p>
        <button
          onClick={onEditProfile}
          className="mt-3 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          Enter Profile
        </button>
      </div>
    );
  }

  const { summary, all_results } = matchResults;

  // Use standardized 3-tier collections (with fallback to legacy keys)
  const likelyMatches = matchResults.likely_matches || matchResults.potential_matches || [];
  const moreInfoNeeded = matchResults.more_info_needed || matchResults.needs_info || [];
  const doesntMatch = matchResults.doesnt_match || matchResults.unmet || [];

  // Filter schemes
  let displayedSchemes = all_results || [];
  if (activeFilter === 'likely_match') {
    displayedSchemes = likelyMatches;
  } else if (activeFilter === 'more_info') {
    displayedSchemes = moreInfoNeeded;
  } else if (activeFilter === 'doesnt_match') {
    displayedSchemes = doesntMatch;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Eligibility Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluated against {summary.total_schemes} verified government scholarship guidelines.
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-slate-500" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Missing Information Prompt */}
      {summary.missing_fields && summary.missing_fields.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Missing Information: </span>
              <span>
                Please provide your{' '}
                <strong className="underline">
                  {summary.missing_fields.map((f) => f.replace('_', ' ')).join(', ')}
                </strong>{' '}
                to get definitive eligibility results.
              </span>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex-shrink-0 text-xs transition-colors"
          >
            Add Information
          </button>
        </div>
      )}

      {/* Summary Counters: Exactly 3 Consistent Statuses */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        {/* Likely match */}
        <div 
          onClick={() => setActiveFilter('likely_match')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'likely_match'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Likely match</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-heading">
            {likelyMatches.length}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Mandatory criteria appear satisfied.
          </p>
        </div>

        {/* More information needed */}
        <div 
          onClick={() => setActiveFilter('more_info')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'more_info'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">More information needed</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-heading">
            {moreInfoNeeded.length}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Conditions remain unconfirmed.
          </p>
        </div>

        {/* Doesn't match */}
        <div 
          onClick={() => setActiveFilter('doesnt_match')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeFilter === 'doesnt_match'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Doesn't match</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-heading">
            {doesntMatch.length}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Failed verified criteria.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-5 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({all_results?.length || 0})
          </button>
          <button
            onClick={() => setActiveFilter('likely_match')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeFilter === 'likely_match' ? 'bg-white text-emerald-700 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Likely match ({likelyMatches.length})
          </button>
          <button
            onClick={() => setActiveFilter('more_info')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeFilter === 'more_info' ? 'bg-white text-amber-700 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            More info needed ({moreInfoNeeded.length})
          </button>
          <button
            onClick={() => setActiveFilter('doesnt_match')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              activeFilter === 'doesnt_match' ? 'bg-white text-rose-700 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doesn't match ({doesntMatch.length})
          </button>
        </div>
      </div>

      {/* Simplified Scheme Cards Grid */}
      {displayedSchemes.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          <p>No schemes found in this category.</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
          >
            View all schemes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedSchemes.map((res) => (
            <SchemeCard
              key={res.scheme.id}
              result={res}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
