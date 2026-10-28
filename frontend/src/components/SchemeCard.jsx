import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SchemeCard({ 
  result, 
  onOpenDetails, 
  onOpenBridge 
}) {
  const { scheme, overall_assessment, overall_label, reason_summary, criteria } = result;

  const satisfiedCount = criteria.filter((c) => c.status === 'Satisfied').length;
  const failedCount = criteria.filter((c) => c.status === 'Not satisfied').length;
  const needsInfoCount = criteria.filter((c) => c.status === 'Needs information').length;

  // Visual status badge configuration
  let badgeClasses = '';
  let badgeIcon = null;

  if (overall_assessment === 'potential_match') {
    badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    badgeIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
  } else if (overall_assessment === 'unmet') {
    badgeClasses = 'bg-rose-50 text-rose-800 border-rose-300';
    badgeIcon = <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
  } else {
    badgeClasses = 'bg-amber-50 text-amber-900 border-amber-300';
    badgeIcon = <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Authority & Assessment Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5 truncate max-w-md">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{scheme.administering_authority}</span>
          </span>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${badgeClasses} self-start sm:self-auto`}>
            {badgeIcon}
            <span>{overall_label}</span>
          </div>
        </div>

        {/* Scheme Name */}
        <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-blue-700 transition-colors">
          {scheme.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {scheme.short_description}
        </p>

        {/* Reason summary */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
          <span className="font-semibold text-slate-800">Assessment Note:</span> {reason_summary}
        </div>

        {/* Criterion Breakdown Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-medium text-slate-500">Criteria:</span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{satisfiedCount} Satisfied</span>
          </span>

          {failedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <XCircle className="w-3 h-3 text-rose-600" />
              <span>{failedCount} Unmet</span>
            </span>
          )}

          {needsInfoCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>{needsInfoCount} Unknown</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Bridge the Gap button (promoted if unmet) */}
          {failedCount > 0 && (
            <button
              onClick={() => onOpenBridge(scheme.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold shadow-sm transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Bridge the Gap Alternatives</span>
            </button>
          )}

          {scheme.application_url && (
            <a
              href={scheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-2"
              title="Open official portal in new tab"
            >
              <span>Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          onClick={() => onOpenDetails(result)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
        >
          <span>View Evidence & Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
