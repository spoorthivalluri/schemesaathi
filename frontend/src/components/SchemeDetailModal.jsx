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
  HelpCircle, 
  CheckSquare, 
  Square, 
  Send, 
  RefreshCw,
  Building2,
  Calendar,
  Layers
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

  const [activeTab, setActiveTab] = useState('criteria'); // 'criteria' | 'explanation' | 'checklist'
  const [explanationData, setExplanationData] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const [checklistData, setChecklistData] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  // Follow-up chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Load explanation and checklist on open
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
          is_live_ai: res.is_live_ai, 
          model_used: res.model_used 
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { 
          sender: 'ai', 
          text: 'Unable to process question at this time. Please verify backend connection.', 
          is_live_ai: false 
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
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
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'criteria'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Criteria Evidence Matrix ({criteria.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'explanation'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Plain-Language AI Explanation & Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Action Checklist & Documents</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* TAB 1: Criteria Evidence Matrix */}
          {activeTab === 'criteria' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <span className="font-bold text-slate-900">Overall Assessment: </span>
                  <span className="font-semibold text-blue-700">{overall_label}</span>
                  <p className="mt-0.5 text-slate-600">{reason_summary}</p>
                </div>
                {overall_assessment === 'unmet' && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBridge(scheme.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Bridge the Gap Alternatives</span>
                  </button>
                )}
              </div>

              {/* Criteria Table / Cards */}
              <div className="space-y-3">
                {criteria.map((c, idx) => {
                  let statusBg = 'bg-slate-50 border-slate-200 text-slate-800';
                  let statusIcon = null;

                  if (c.status === 'Satisfied') {
                    statusBg = 'bg-emerald-50/70 border-emerald-200 text-emerald-950';
                    statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
                  } else if (c.status === 'Not satisfied') {
                    statusBg = 'bg-rose-50/70 border-rose-200 text-rose-950';
                    statusIcon = <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />;
                  } else {
                    statusBg = 'bg-amber-50/70 border-amber-200 text-amber-950';
                    statusIcon = <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
                  }

                  return (
                    <div key={idx} className={`p-4 rounded-xl border ${statusBg} text-xs transition-colors`}>
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {statusIcon}
                          <span className="font-bold text-sm">{c.label}</span>
                          {!c.is_mandatory && (
                            <span className="text-[10px] uppercase font-semibold text-slate-400 bg-white/80 px-1.5 py-0.5 rounded border">
                              Verification Note
                            </span>
                          )}
                        </div>
                        <span className="font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded-full bg-white border shadow-2xs">
                          {c.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2 bg-white/80 p-3 rounded-lg border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Verified Statutory Requirement</span>
                          <span className="font-medium text-slate-800">{c.requirement}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Your Reported Value</span>
                          <span className="font-medium text-slate-800">{c.user_value}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-slate-700">
                        <span className="font-semibold text-slate-900">Finding: </span>
                        <span>{c.explanation}</span>
                      </div>

                      {/* Source Excerpt */}
                      {c.source_excerpt && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-1.5">
                          <span className="font-semibold text-slate-700 flex-shrink-0">Official Source ({c.source_title}):</span>
                          <span className="italic line-clamp-2">"{c.source_excerpt}"</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Plain-Language AI Explanation & Grounded Q&A */}
          {activeTab === 'explanation' && (
            <div className="space-y-6">
              {/* AI Explanation Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950 font-heading">
                      Grounded AI Explanation
                    </span>
                  </div>
                  {explanationData && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                      {explanationData.model_used}
                    </span>
                  )}
                </div>

                {isLoadingExplanation ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-indigo-700">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing explanation from verified scheme guidelines...</span>
                  </div>
                ) : (
                  <div className="text-xs text-indigo-950 leading-relaxed whitespace-pre-line font-normal">
                    {explanationData?.explanation || 'Explanation generated based on statutory criteria.'}
                  </div>
                )}
              </div>

              {/* Grounded Follow-up Q&A Assistant */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Ask a Question About {scheme.name}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-4">
                  Answers are grounded strictly in this scheme's verified documentation. The assistant will not invent rules.
                </p>

                {/* Question suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  <span className="text-[11px] text-slate-400 font-medium">Quick questions:</span>
                  {[
                    "What documents are required?",
                    "How do I apply on the official portal?",
                    "What is the exact income ceiling?",
                    "Are distance education courses eligible?"
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setInputQuestion(preset)}
                      className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Conversation History */}
                {chatMessages.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-100">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-xs ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white ml-auto max-w-md'
                            : 'bg-white border border-slate-200 text-slate-800 mr-auto max-w-lg shadow-2xs'
                        }`}
                      >
                        {msg.sender === 'ai' && (
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mb-1">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Grounded Answer ({msg.model_used || 'SchemeSaathi Engine'})</span>
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputQuestion}
                    onChange={(e) => setInputQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
                    placeholder="Ask about required documents, attendance rules, income certificate dates..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendQuestion}
                    disabled={isAsking || !inputQuestion.trim()}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white transition-colors"
                  >
                    {isAsking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Action Checklist & Documents */}
          {activeTab === 'checklist' && checklistData && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">One-Click Action Checklist: </span>
                <span>
                  Check off items as you gather them. All documents and steps below are derived strictly from official guidelines. Completing this checklist does not guarantee government approval.
                </span>
              </div>

              {/* Required Documents Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Mandatory Documents Listed in Official Guidelines ({checklistData.checklist_documents.length})</span>
                </h4>
                <div className="space-y-2">
                  {checklistData.checklist_documents.map((doc) => {
                    const isChecked = !!checkedItems[doc.id];
                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleCheck(doc.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 line-through'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="font-medium">{doc.title}</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Official Requirement
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Official Application Steps</span>
                </h4>
                <div className="space-y-2.5">
                  {checklistData.application_steps.map((step) => {
                    const stepId = `step_${step.step_number}`;
                    const isChecked = !!checkedItems[stepId];
                    return (
                      <div
                        key={stepId}
                        onClick={() => toggleCheck(stepId)}
                        className={`p-3 rounded-xl border flex items-start gap-3 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-slate-50 border-slate-300 text-slate-500 line-through'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
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

              {/* Official Application Portal Link */}
              {checklistData.application_url && (
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold font-heading">Ready to Submit Application?</span>
                    <p className="text-[11px] text-slate-400">
                      Applications must be officially lodged through {scheme.administering_authority}.
                    </p>
                  </div>
                  <a
                    href={checklistData.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
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
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
