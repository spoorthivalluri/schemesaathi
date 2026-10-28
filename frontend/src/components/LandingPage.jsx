import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Mic, 
  ArrowRight, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  ExternalLink,
  BookOpen,
  Lock,
  Cpu
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

export default function LandingPage({ onStartWizard, onSelectScenario, onOpenAbout }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-teal-50/30 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span>MLH × NIAT Hacktoberfest · Best Open-Source AI Project</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-heading max-w-4xl mx-auto leading-[1.15]">
            Find your schemes. Understand your eligibility. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-teal-600 to-indigo-700">Know your next step.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SchemeSaathi is an evidence-based, open-weight AI assistant for Indian college students and families.
            We eliminate the confusion of government scholarship circulars with <strong className="text-slate-800 font-semibold">deterministic eligibility checks</strong>, <strong className="text-slate-800 font-semibold">source-grounded evidence</strong>, and <strong className="text-slate-800 font-semibold">alternative suggestions</strong> when you miss a cutoff.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartWizard}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-teal-500/30 transform hover:-translate-y-0.5 transition-all"
            >
              <span>Find Schemes for Me</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-300 shadow-sm transition-colors"
            >
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>How Open-Weight AI Works</span>
            </button>
          </div>

          {/* Quick Disclaimer */}
          <p className="mt-4 text-xs text-slate-500 max-w-xl mx-auto">
            Guidance only. Final eligibility decisions are strictly determined by the administering government departments.
          </p>
        </div>
      </section>

      {/* 90-Second Judge Scenarios Bar */}
      <section className="bg-slate-900 text-white py-12 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-teal-400 uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Demo Presets
              </div>
              <h2 className="text-2xl font-bold font-heading">
                Explore the Three Official Hackathon Test Scenarios
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                One-click fictional profiles designed to demonstrate deterministic matching, Bridge the Gap, and missing information handling.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEMO_SCENARIOS.map((sc, index) => (
              <div
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/50 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Scenario {index + 1}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {sc.title.split(': ')[1] || sc.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {sc.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-medium text-teal-400 group-hover:text-teal-300">
                  <span>Run Scenario Demo</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 4 Signature Features Grid */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              Built on Four Signature Principles
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Unlike generic AI wrappers that hallucinate answers, SchemeSaathi enforces strict separation between deterministic eligibility logic and open-weight model explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                Voice & Multilingual Input
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Describe your circumstances in English, Telugu, or Hindi. The speech layer transcribes your voice, extracts structured fields, and asks for confirmation before searching.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                Evidence-Backed Reasoning
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every criterion is evaluated as Satisfied, Not Satisfied, or Needs Information. Transparent source quotes link directly to official government notifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                "Bridge the Gap" Alternatives
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Missed an income threshold? SchemeSaathi does not stop at rejection. It scans the verified catalog to recommend alternative schemes with compatible rules.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-heading">
                One-Click Action Checklist
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates a practical checklist of verified certificates (Meeseva income, caste, bonafide) and sequential application steps directly from official guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust, Privacy & Official Portal Harmony */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900 font-heading">
                Privacy-First & Non-Disruptive Public Service
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                SchemeSaathi does not collect Aadhaar numbers, phone numbers, or passwords. Your profile data is kept strictly in temporary client-side memory. We do not replace official platforms like myScheme, NSP, or Telangana ePASS—we empower citizens to understand their eligibility before applying.
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={onStartWizard}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Start Discovery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-200">SchemeSaathi</span>
            <span>· Open-Source AI for Public Good</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            <span>MLH × NIAT Hacktoberfest Hack Day · Open-Weight AI Category</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
