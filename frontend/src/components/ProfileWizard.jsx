import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  IndianRupee, 
  Users, 
  Sparkles, 
  Mic, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/demoScenarios';

export default function ProfileWizard({
  profile,
  setProfile,
  onRunMatch,
  onOpenVoiceModal,
  onSelectScenario
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value === '' ? null : value
    }));
  };

  const handleIncomeQuickSelect = (amt) => {
    setProfile((prev) => ({
      ...prev,
      annual_income: amt
    }));
  };

  const canProceedStep1 = true;
  const canProceedStep2 = true;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Profile Discovery Questionnaire</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Tell Us About Your Academic Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We evaluate your circumstances against official statutory criteria. No login or Aadhaar required.
          </p>
        </div>

        {/* Voice & Demo Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold shadow-sm transition-all"
          >
            <Mic className="w-4 h-4 text-blue-600" />
            <span>Voice / Natural Language</span>
          </button>
        </div>
      </div>

      {/* Quick Judge Demo Selector Bar */}
      <div className="mb-8 p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span className="font-semibold text-slate-200">Pre-fill Judge Test Scenario:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {DEMO_SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-teal-300 transition-colors"
            >
              Scenario {i + 1}: {sc.title.split(':')[1]?.trim() || sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto mb-2 text-xs font-semibold">
          <span className={step >= 1 ? 'text-blue-600' : 'text-slate-400'}>1. Domicile & Demographics</span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-slate-400'}>2. Education & Course</span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-slate-400'}>3. Family Income & Category</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-md mx-auto">
          <div
            className="bg-gradient-to-r from-blue-600 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Questionnaire Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        {/* STEP 1: Domicile, Gender, Age, Locality */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3 font-heading flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Step 1: State Domicile & Demographics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  State of Domicile <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select your home state...</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other">Other State</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Determines eligibility for state welfare programmes like Telangana ePASS and Overseas Vidya Nidhi.
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select gender...</option>
                  <option value="Female">Female (Eligible for Pragati & general)</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Transgender</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  AICTE Pragati is designated exclusively for female applicants.
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Age (in years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  value={profile.age || ''}
                  onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g. 19"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                </input>
                <p className="text-[11px] text-slate-500 mt-1">
                  Overseas Vidya Nidhi enforces a 35-year age limit.
                </p>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Area of Residence
                </label>
                <select
                  value={profile.locality || 'urban'}
                  onChange={(e) => handleChange('locality', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="urban">Urban (City / Town)</option>
                  <option value="rural">Rural (Village)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  ePASS has different statutory income ceilings for rural (₹1.5L) vs urban (₹2.0L) beneficiaries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Education Level & Course */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3 font-heading flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>Step 2: Educational Level & Program of Study</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.education_level || ''}
                  onChange={(e) => handleChange('education_level', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select level of study...</option>
                  <option value="Graduation">Undergraduate / Graduation (B.Tech, B.Sc, MBBS, etc.)</option>
                  <option value="Post-Graduation">Post-Graduation / Master's (MS, M.Tech, MBA)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Intermediate">Intermediate (10+2 / Junior College)</option>
                  <option value="Doctorate">Doctorate / Ph.D</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Course / Degree Program <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.course || ''}
                  onChange={(e) => handleChange('course', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select course...</option>
                  <option value="B.Tech">B.Tech / B.E (Engineering & Tech)</option>
                  <option value="MBBS">MBBS / Healthcare</option>
                  <option value="B.Pharmacy">B.Pharmacy</option>
                  <option value="B.Sc">B.Sc (Sciences)</option>
                  <option value="B.Com">B.Com / BBA</option>
                  <option value="MBA">MBA / MCA</option>
                  <option value="Master's Degree">Master's Degree / MS Abroad</option>
                  <option value="Diploma">Polytechnic / Technical Diploma</option>
                  <option value="Other">Other Degree</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Academic Verification Note:</strong> Central Sector CSSS requires scoring in the top 20th percentile of your 12th board, while ePASS requires at least 75% quarterly attendance.
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Family Income & Social Category */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3 font-heading flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <span>Step 3: Annual Family Income & Category</span>
            </h3>

            {/* Income */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Gross Annual Family Income (in INR) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-blue-700">
                  {profile.annual_income ? `₹${profile.annual_income.toLocaleString('en-IN')}` : 'Not entered'}
                </span>
              </div>
              <input
                type="number"
                step="10000"
                min="0"
                max="5000000"
                value={profile.annual_income !== null && profile.annual_income !== undefined ? profile.annual_income : ''}
                onChange={(e) => handleChange('annual_income', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g. 180000 (Enter ₹1,80,000 without commas)"
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Quick Select Buttons */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium">Quick presets:</span>
                {[
                  { label: '₹1.5 Lakh', val: 150000 },
                  { label: '₹1.8 Lakh', val: 180000 },
                  { label: '₹2.0 Lakh', val: 200000 },
                  { label: '₹3.5 Lakh', val: 350000 },
                  { label: '₹4.5 Lakh', val: 450000 },
                  { label: '₹8.0 Lakh', val: 800000 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleIncomeQuickSelect(item.val)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      profile.annual_income === item.val
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Social / Reservation Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={profile.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select social category...</option>
                <option value="BC">BC (Backward Classes)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EBC">EBC (Economically Backward Classes)</option>
                <option value="Minority">Minority (Muslim, Christian, Sikh, etc.)</option>
                <option value="General">General / Open Category</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                A valid caste certificate issued by Meeseva or a revenue officer will be required during application.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onRunMatch}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluate Eligible Schemes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
