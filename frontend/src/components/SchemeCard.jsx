import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Award
} from 'lucide-react';

export default function SchemeCard({ result, onOpenDetails }) {
  const { scheme, overall_assessment, overall_label, reason_summary } = result;

  // Standardize the 3 consistent statuses
  let badgeClasses = '';
  let badgeIcon = null;
  let displayLabel = overall_label;

  if (overall_assessment === 'likely_match' || overall_assessment === 'potential_match') {
    displayLabel = 'Likely match';
    badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    badgeIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
  } else if (overall_assessment === 'doesnt_match' || overall_assessment === 'unmet') {
    displayLabel = "Doesn't match";
    badgeClasses = 'bg-rose-50 text-rose-800 border-rose-300';
    badgeIcon = <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
  } else {
    displayLabel = 'More information needed';
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    badgeIcon = <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        {/* Authority & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{scheme.administering_authority}</span>
          </span>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${badgeClasses} self-start sm:self-auto`}>
            {badgeIcon}
            <span>{displayLabel}</span>
          </div>
        </div>

        {/* 1. Scheme Name */}
        <h3 className="text-lg font-bold text-slate-900 font-heading">
          {scheme.name}
        </h3>

        {/* 3. Key Benefit (verified) */}
        {scheme.key_benefit && (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Award className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Verified Benefit: </span>
              <span>{scheme.key_benefit}</span>
            </div>
          </div>
        )}

        {/* 5. Short Reason */}
        <p className="mt-3 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Status Reason: </span>
          {reason_summary}
        </p>
      </div>

      {/* 6. One Primary Action: View details */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => onOpenDetails(result)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <span>View details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
