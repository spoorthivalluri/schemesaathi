import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  RefreshCw,
  Info
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-start justify-between gap-4 border-b border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                Feature C: Bridge the Gap
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading">
                Alternative Scheme Recommendations
              </h2>
              <p className="text-xs text-purple-200 mt-0.5">
                Evaluated through the same deterministic statutory criteria engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              <span>Scanning verified knowledge base for compatible alternative schemes...</span>
            </div>
          ) : data ? (
            <>
              {/* Failed Scheme Diagnosis Banner */}
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span className="font-bold text-sm font-heading">
                    Why {data.failed_scheme?.name} Was Excluded:
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  {data.failed_scheme?.failed_criteria?.map((fc, i) => (
                    <div key={i} className="bg-white/80 p-3 rounded-xl border border-rose-100">
                      <div className="font-semibold text-rose-900">
                        • {fc.label}: {fc.explanation}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        <strong>Official Rule:</strong> {fc.requirement}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 italic">
                        Source: {fc.source_title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viable Alternatives Section */}
              {data.has_alternatives ? (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Compatible Schemes Identified ({data.alternatives.length})</span>
                  </h3>

                  <div className="space-y-4">
                    {data.alternatives.map((alt) => (
                      <div
                        key={alt.scheme_id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-purple-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            {alt.administering_authority}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {alt.assessment_label}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 font-heading">
                          {alt.scheme_name}
                        </h4>

                        {/* Relevance Explanation */}
                        <div className="mt-2.5 p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 font-medium">
                          <strong>Why This Fits: </strong> {alt.relevance_explanation}
                        </div>

                        {/* Satisfied Criteria */}
                        {alt.satisfied_criteria && alt.satisfied_criteria.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                              Satisfied Verified Requirements:
                            </span>
                            <ul className="text-xs text-slate-700 space-y-1">
                              {alt.satisfied_criteria.slice(0, 3).map((sc, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">✓</span>
                                  <span>{sc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Unknown Conditions */}
                        {alt.unknown_conditions && alt.unknown_conditions.length > 0 && (
                          <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            <span className="font-bold">Conditions Pending Verification: </span>
                            {alt.unknown_conditions.join('; ')}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap text-xs">
                          <a
                            href={alt.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-purple-700 flex items-center gap-1 font-medium transition-colors"
                          >
                            <span>Official Source ({alt.source_title})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <div className="flex items-center gap-2">
                            {alt.application_url && (
                              <a
                                href={alt.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                              >
                                Portal Link
                              </a>
                            )}
                            <button
                              onClick={() => {
                                onClose();
                                onSelectAlternative(alt.scheme_id);
                              }}
                              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm transition-all"
                            >
                              <span>View Full Evidence</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Master prompt fallback text requirement */
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
                    {data.fallback_message}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Alternatives
          </button>
        </div>
      </div>
    </div>
  );
}
