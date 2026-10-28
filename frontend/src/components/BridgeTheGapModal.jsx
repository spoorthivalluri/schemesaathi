import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink, 
  ArrowRight, 
  Building2, 
  Sparkles,
  RefreshCw,
  Info,
  Award
} from 'lucide-react';
import { fetchBridgeAlternatives } from '../services/api';

export default function BridgeTheGapModal({
  isOpen,
  onClose,
  failedSchemeId,
  profile,
  onSelectAlternative
}) {
  if (!isOpen || !failedSchemeId) return null;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBridgeAlternatives(failedSchemeId, profile)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => console.warn('Could not load alternatives:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [failedSchemeId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-start justify-between gap-3 border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Bridge the Gap Alternatives
              </div>
              <h2 className="text-xl font-bold font-heading">
                Alternative Scheme Recommendations
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Evaluated through the same deterministic criteria engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600 mb-2.5" />
              <span>Scanning verified knowledge base for compatible alternative schemes...</span>
            </div>
          ) : data ? (
            <>
              {/* Failed Scheme Diagnosis */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span className="font-bold text-sm font-heading">
                    Why {data.failed_scheme?.name} Doesn't Match:
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  {data.failed_scheme?.failed_criteria?.map((fc, i) => (
                    <div key={i} className="bg-white/80 p-2.5 rounded-lg border border-rose-100">
                      <div className="font-semibold text-rose-900">
                        • {fc.label}: {fc.explanation}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <strong>Official Rule:</strong> {fc.requirement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viable Alternatives */}
              {data.has_alternatives ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Alternatives Identified ({data.alternatives.length})</span>
                  </h3>

                  <div className="space-y-3">
                    {data.alternatives.map((alt) => {
                      const isLikely = alt.assessment === 'likely_match' || alt.assessment === 'potential_match';
                      return (
                        <div
                          key={alt.scheme_id}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {alt.administering_authority}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                              isLikely 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {isLikely ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
                              <span>{isLikely ? 'Likely match' : 'More information needed'}</span>
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 font-heading">
                            {alt.scheme_name}
                          </h4>

                          {/* Key Benefit */}
                          {alt.key_benefit && (
                            <div className="text-xs text-indigo-950 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span><strong>Benefit: </strong>{alt.key_benefit}</span>
                            </div>
                          )}

                          {/* Relevance Explanation */}
                          <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-xs text-purple-900 font-medium">
                            <strong>Why This Fits: </strong> {alt.relevance_explanation}
                          </div>

                          {/* Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                            <a
                              href={alt.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-500 hover:text-purple-700 flex items-center gap-1 font-medium transition-colors"
                            >
                              <span>Official Source</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                              onClick={() => {
                                onClose();
                                onSelectAlternative(alt.scheme_id);
                              }}
                              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-2xs transition-colors"
                            >
                              <span>View details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-white rounded-xl border border-slate-200">
                  <Info className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700 max-w-sm mx-auto">
                    {data.fallback_message}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
