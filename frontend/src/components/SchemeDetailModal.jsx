import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Award,
  CheckSquare, 
  Square, 
  Send, 
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { fetchSchemeExplanation, fetchActionChecklist, askSchemeQuestion } from '../services/api';

export default function SchemeDetailModal({
  isOpen,
  onClose,
  evaluationResult,
  profile,
  onOpenBridge
}) {
  if (!isOpen || !evaluationResult) return null;

  const { scheme, criteria, overall_assessment, overall_label, reason_summary } = evaluationResult;

  const [activeTab, setActiveTab] = useState('evidence'); // 'evidence' | 'ai_explanation' | 'checklist'
  const [explanationData, setExplanationData] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const [checklistData, setChecklistData] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  // Follow-up chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Standardize status badge
  let statusBadgeClass = '';
  let statusBadgeIcon = null;
  let normalizedStatus = overall_label;

  if (overall_assessment === 'likely_match' || overall_assessment === 'potential_match') {
    normalizedStatus = 'Likely match';
    statusBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    statusBadgeIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
  } else if (overall_assessment === 'doesnt_match' || overall_assessment === 'unmet') {
    normalizedStatus = "Doesn't match";
    statusBadgeClass = 'bg-rose-50 text-rose-800 border-rose-300';
    statusBadgeIcon = <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
  } else {
    normalizedStatus = 'More information needed';
    statusBadgeClass = 'bg-amber-50 text-amber-800 border-amber-300';
    statusBadgeIcon = <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
  }

  // Load explanation and checklist
  useEffect(() => {
    let isMounted = true;
    setIsLoadingExplanation(true);

    fetchSchemeExplanation(scheme.id, profile)
      .then((data) => {
        if (isMounted) setExplanationData(data);
      })
      .catch((err) => console.warn('Could not load explanation:', err))
      .finally(() => {
        if (isMounted) setIsLoadingExplanation(false);
      });

    fetchActionChecklist(scheme.id, profile)
      .then((data) => {
        if (isMounted) setChecklistData(data);
      })
      .catch((err) => console.warn('Could not load checklist:', err));

    return () => {
      isMounted = false;
    };
  }, [scheme.id]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSendQuestion = async () => {
    if (!inputQuestion.trim()) return;
    const q = inputQuestion.trim();
    setInputQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setIsAsking(true);

    try {
      const res = await askSchemeQuestion(scheme.id, q, profile);
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: 'ai', 
          text: res.answer, 
          model_used: res.model_used 
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: 'ai', 
          text: 'Unable to process question. Please refer directly to official guidelines.', 
          is_live_ai: false 
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* 1. Header: Scheme Name & Authority */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                {scheme.category}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Verified: {scheme.last_verified}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {scheme.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{scheme.administering_authority}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 & 3. Eligibility Summary & Verified Key Benefit */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
          {/* Eligibility Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${statusBadgeClass}`}>
                {statusBadgeIcon}
                <span>{normalizedStatus}</span>
              </div>
              <span className="text-xs text-slate-700">{reason_summary}</span>
            </div>

            {/* Bridge the Gap Trigger if it doesn't match */}
            {(overall_assessment === 'doesnt_match' || overall_assessment === 'unmet') && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBridge(scheme.id);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-2xs transition-colors self-start sm:self-auto"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Bridge Alternatives</span>
              </button>
            )}
          </div>

          {/* Key Benefit Summary */}
          {scheme.key_benefit && (
            <div className="flex items-center gap-2 text-xs text-indigo-950 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
              <Award className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>
                <strong className="text-indigo-900">Verified Benefit: </strong>
                {scheme.key_benefit}
              </span>
            </div>
          )}
        </div>

        {/* 4. Three Organised Sections / Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-white px-5 gap-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'evidence'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Eligibility Evidence ({criteria.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_explanation')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'ai_explanation'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI Plain-Language Explanation</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Application Checklist</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-5 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: Eligibility Evidence */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              {criteria.map((c, idx) => {
                let statusBg = 'bg-slate-50 border-slate-200 text-slate-800';
                let icon = null;

                if (c.status === 'Satisfied') {
                  statusBg = 'bg-emerald-50/60 border-emerald-200 text-emerald-950';
                  icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
                } else if (c.status === 'Not satisfied') {
                  statusBg = 'bg-rose-50/60 border-rose-200 text-rose-950';
                  icon = <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
                } else {
                  statusBg = 'bg-amber-50/60 border-amber-200 text-amber-950';
                  icon = <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
                }

                return (
                  <div key={idx} className={`p-3.5 rounded-xl border ${statusBg} text-xs space-y-1.5`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {icon}
                        <span className="font-bold text-sm text-slate-900">{c.label}</span>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200">
                        {c.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Official Requirement</span>
                        <span className="font-medium text-slate-800">{c.requirement}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Your Stated Value</span>
                        <span className="font-medium text-slate-800">{c.user_value}</span>
                      </div>
                    </div>

                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-900">Finding: </span>
                      <span>{c.explanation}</span>
                    </div>

                    {c.source_excerpt && (
                      <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-1">
                        <span className="font-semibold text-slate-700 flex-shrink-0">Source ({c.source_title}):</span>
                        <span className="italic line-clamp-2">"{c.source_excerpt}"</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Plain-Language AI Explanation & Grounded Q&A */}
          {activeTab === 'ai_explanation' && (
            <div className="space-y-5">
              {/* Plain-Language Explanation */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-200 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950">
                      Plain-Language Summary
                    </span>
                  </div>
                  {explanationData && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {explanationData.model_used}
                    </span>
                  )}
                </div>

                {isLoadingExplanation ? (
                  <div className="flex items-center gap-2 py-3 text-xs text-indigo-700">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing explanation from verified rules...</span>
                  </div>
                ) : (
                  <div className="text-xs text-indigo-950 leading-relaxed whitespace-pre-line">
                    {explanationData?.explanation || 'Explanation generated based on official guidelines.'}
                  </div>
                )}
              </div>

              {/* Grounded Follow-Up Q&A */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Grounded Follow-up Questions
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Answers are derived strictly from official guidelines for {scheme.name}.
                </p>

                {/* Conversation History */}
                {chatMessages.length > 0 && (
                  <div className="space-y-2 mb-3 max-h-56 overflow-y-auto p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white ml-auto max-w-sm'
                            : 'bg-white border border-slate-200 text-slate-800 mr-auto max-w-md shadow-2xs'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
                    placeholder="Ask about required documents, attendance rules, income certificate dates..."
                    className="flex-1 p-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendQuestion}
                    disabled={isAsking || !inputQuestion.trim()}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white transition-colors"
                  >
                    {isAsking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Application Checklist */}
          {activeTab === 'checklist' && checklistData && (
            <div className="space-y-5">
              {/* Mandatory Documents */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Verified Required Documents ({checklistData.checklist_documents.length})</span>
                </h4>
                <div className="space-y-2">
                  {checklistData.checklist_documents.map((doc) => {
                    const isChecked = !!checkedItems[doc.id];
                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleCheck(doc.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="font-medium">{doc.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Application Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Official Application Steps</span>
                </h4>
                <div className="space-y-2">
                  {checklistData.application_steps.map((step) => {
                    const stepId = `step_${step.step_number}`;
                    const isChecked = !!checkedItems[stepId];
                    return (
                      <div
                        key={stepId}
                        onClick={() => toggleCheck(stepId)}
                        className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-slate-50 border-slate-300 text-slate-500 line-through'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                          {step.step_number}
                        </div>
                        <span className="font-medium flex-1">{step.instruction}</span>
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Portal Link */}
              {checklistData.application_url && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold">Official Application Portal</span>
                    <p className="text-[11px] text-slate-400">Apply via {scheme.administering_authority}</p>
                  </div>
                  <a
                    href={checklistData.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <span>Open Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <a
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
          >
            <span>Source: {scheme.source_title}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
