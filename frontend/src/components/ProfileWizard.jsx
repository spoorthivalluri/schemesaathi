import React, { useState } from 'react';
import { 
  MapPin, 
  GraduationCap, 
  IndianRupee, 
  Sparkles, 
  Mic, 
  ArrowRight, 
  ArrowLeft, 
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Your Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Enter your details to check eligibility against verified government scholarship criteria.
          </p>
        </div>

        <button
          onClick={onOpenVoiceModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Mic className="w-4 h-4 text-blue-600" />
          <span>Voice Input</span>
        </button>
      </div>

      {/* Quick Evaluator Presets */}
      <div className="mb-6 p-3 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span>Test Scenarios:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-teal-300 transition-colors"
            >
              {sc.title.split(':')[0]} ({sc.badge})
            </button>
          ))}
        </div>
      </div>

      {/* Step Tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between max-w-sm mx-auto mb-1.5 text-xs font-semibold">
          <span className={step >= 1 ? 'text-blue-600' : 'text-slate-400'}>1. Domicile</span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-slate-400'}>2. Education</span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-slate-400'}>3. Income & Category</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden max-w-sm mx-auto">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
        {/* STEP 1: Domicile, Gender, Age, Locality */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>State Domicile & Demographics</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State of Domicile <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.state || ''}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select state...</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              {/* Gender - strictly clean labels with NO bracketed descriptions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select gender...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Age (in years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="65"
                  value={profile.age || ''}
                  onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="e.g. 19"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Area of Residence
                </label>
                <select
                  value={profile.locality || 'urban'}
                  onChange={(e) => handleChange('locality', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="urban">Urban (City / Town)</option>
                  <option value="rural">Rural (Village)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Education Level & Course */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education Level & Program</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.education_level || ''}
                  onChange={(e) => handleChange('education_level', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select level...</option>
                  <option value="Graduation">Undergraduate / Graduation (Degree)</option>
                  <option value="Post-Graduation">Post-Graduation / Master's</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Intermediate">Intermediate (10+2)</option>
                  <option value="Doctorate">Doctorate / Ph.D</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Current Course <span className="text-rose-500">*</span>
                </label>
                <select
                  value={profile.course || ''}
                  onChange={(e) => handleChange('course', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select course...</option>
                  <option value="B.Tech">B.Tech / B.E (Engineering)</option>
                  <option value="MBBS">MBBS / Healthcare</option>
                  <option value="B.Pharmacy">B.Pharmacy</option>
                  <option value="B.Sc">B.Sc (Sciences)</option>
                  <option value="B.Com">B.Com / BBA</option>
                  <option value="MBA">MBA / MCA</option>
                  <option value="Master's Degree">Master's Degree / MS</option>
                  <option value="Diploma">Polytechnic / Diploma</option>
                  <option value="Other">Other Degree</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Income & Social Category */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-blue-600" />
                <span>Annual Family Income & Category</span>
              </h3>
            </div>

            {/* Income */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Gross Annual Family Income (in INR) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-blue-700">
                  {profile.annual_income !== null && profile.annual_income !== undefined 
                    ? `₹${profile.annual_income.toLocaleString('en-IN')}` 
                    : 'Not entered'}
                </span>
              </div>
              <input
                type="number"
                step="10000"
                min="0"
                max="5000000"
                value={profile.annual_income !== null && profile.annual_income !== undefined ? profile.annual_income : ''}
                onChange={(e) => handleChange('annual_income', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g. 180000"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              />

              {/* Quick Select Buttons */}
              <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
                {[
                  { label: '₹1.5L', val: 150000 },
                  { label: '₹1.8L', val: 180000 },
                  { label: '₹2.0L', val: 200000 },
                  { label: '₹3.5L', val: 350000 },
                  { label: '₹4.5L', val: 450000 },
                  { label: '₹8.0L', val: 800000 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleIncomeQuickSelect(item.val)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                      profile.annual_income === item.val
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Social Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={profile.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select category...</option>
                <option value="BC">BC (Backward Classes)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EBC">EBC (Economically Backward Classes)</option>
                <option value="Minority">Minority</option>
                <option value="General">General / Open Category</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onRunMatch}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
