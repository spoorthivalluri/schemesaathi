import React from 'react';
import { 
  X, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  GitBranch, 
  ExternalLink, 
  FileCode, 
  BookOpen, 
  Lock,
  Layers,
  HeartHandshake
} from 'lucide-react';

export default function AboutModal({ isOpen, onClose, aiHealth }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading">
                About SchemeSaathi
              </h2>
              <p className="text-xs text-slate-400">
                Evidence-Based, Voice-Enabled Government Scheme Discovery Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-6 leading-relaxed">
          {/* Mission */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>Project Mission & The Problem</span>
            </h3>
            <p>
              India has hundreds of valuable welfare and educational scholarships, but finding the right scheme and navigating eligibility circulars is overwhelming. Official information is scattered across state and central portals, lengthy government orders (GOs), and complex income ceiling matrices.
            </p>
            <p className="mt-2">
              <strong>SchemeSaathi does not invent scheme discovery or replace official portals</strong> like myScheme, the National Scholarship Portal (NSP), or Telangana ePASS. Instead, it serves as an intelligent pre-application companion that translates legalistic government circulars into evidence-backed criteria evaluations, actionable document checklists, and alternative options.
            </p>
          </div>

          {/* Architecture: Strict Separation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Open-Weight AI Architecture & Responsibilities</span>
            </h3>
            <p className="mb-2">
              SchemeSaathi strictly adheres to ethical AI principles by dividing responsibilities:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Deterministic Eligibility Engine (Python):</strong> Evaluates numbers against verified thresholds, checks state domicile, social category, and education level. <em>The language model is strictly prohibited from making final eligibility judgments.</em>
              </li>
              <li>
                <strong>Open-Weight Model ({aiHealth?.ai_model?.model || 'Qwen2.5-3B-Instruct'}):</strong> Interprets natural language circumstances, extracts structured profile fields, explains statutory rules in plain words, and answers grounded questions using retrieved official excerpts.
              </li>
              <li>
                <strong>Evidence Grounding Layer:</strong> Maintains traceable citations to official Government Orders and portals (e.g. Telangana ePASS, AICTE, Ministry of Education).
              </li>
            </ul>
          </div>

          {/* Transparency & AI Status */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-950">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider">Live Model Connection Status:</span>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-white border border-teal-300">
                {aiHealth?.ai_model?.provider || 'Deterministic Mode'}
              </span>
            </div>
            <p className="text-[11px] text-teal-900">
              {aiHealth?.ai_model?.message}
            </p>
          </div>

          {/* Privacy & Safeguards */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-heading flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Privacy, Security & Uncertainty Handling</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>No Aadhaar numbers, phone numbers, or passwords are ever requested or stored.</li>
              <li>Profiles reside strictly in client-side memory or temporary session state.</li>
              <li>Missing information is never treated as satisfied—it is transparently labelled <strong>"Needs Information"</strong>.</li>
              <li>No invented probability percentages or false guarantees of approval are provided.</li>
            </ul>
          </div>

          {/* Open Source & Contributing */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-500 text-[11px]">
            <div>
              <span>Licensed under the </span>
              <strong className="text-slate-800">MIT Open-Source License</strong>.
              <span> Model weight licenses apply to respective upstream models (Qwen / Llama).</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-semibold text-slate-700">MLH × NIAT Hack Day</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
