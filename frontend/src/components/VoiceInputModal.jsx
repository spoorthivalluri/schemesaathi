import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Check, AlertCircle, X, Sparkles, Edit3, ArrowRight, RefreshCw, Languages } from 'lucide-react';
import { parseNaturalLanguageProfile } from '../services/api';

export default function VoiceInputModal({ isOpen, onClose, onProfileExtracted }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser or type your description.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech was detected. Please try speaking again.');
        } else {
          setErrorMsg(`Voice input error: ${event.error}. You can also type or edit below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMsg('Web Speech API is not natively supported in this browser. You can type your circumstances below!');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [selectedLanguage]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setErrorMsg('');
      try {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Error starting speech:', err);
      }
    }
  };

  const handleProcessTranscript = async () => {
    if (!transcript.trim()) {
      setErrorMsg('Please speak or type a description first.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const result = await parseNaturalLanguageProfile(transcript);
      setExtractedResult(result);
    } catch (err) {
      setErrorMsg('Failed to process text. Please verify backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndApply = () => {
    if (extractedResult?.profile) {
      onProfileExtracted(extractedResult.profile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Voice & Multilingual Input
              </h3>
              <p className="text-xs text-slate-500">
                Natural-language circumstances converted to structured eligibility criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selection */}
        <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Languages className="w-4 h-4 text-slate-500" />
            <span>Spoken Language:</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedLanguage('en-IN')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'en-IN' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English (India)
            </button>
            <button
              onClick={() => setSelectedLanguage('te-IN')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'te-IN' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => setSelectedLanguage('hi-IN')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'hi-IN' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        {/* Microphone Button and Instructions */}
        <div className="mt-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 text-white mic-active hover:bg-rose-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <p className="mt-3 text-xs font-semibold text-slate-700">
            {isListening ? 'Listening... Speak your circumstances now.' : 'Click microphone to begin speaking'}
          </p>

          <p className="mt-1 text-[11px] text-slate-500 text-center max-w-sm">
            Example: <span className="italic font-medium text-slate-700">"I am a first-year B.Tech student in Telangana with family income 1.8 lakh."</span>
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Transcript Area (Editable before applying) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Spoken / Typed Description (You can edit mistakes below):</span>
            </label>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your spoken words will appear here. Or type directly: e.g., 'First year B.Tech student in Telangana, family income 1.8L, BC category'..."
            className="w-full p-3.5 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
          />
        </div>

        {/* Action: Extract button */}
        {!extractedResult && (
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessTranscript}
              disabled={isProcessing || !transcript.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold shadow-sm transition-all"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting with Open-Weight AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Profile Fields</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Fields Confirmation Box */}
        {extractedResult && (
          <div className="mt-6 p-5 rounded-2xl bg-teal-50/60 border border-teal-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-teal-200/80 mb-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-teal-950 font-heading">
                  Confirm Extracted Details
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                {extractedResult.extraction_method}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">State</span>
                <span className="font-semibold text-slate-800">{extractedResult.profile.state || 'Not specified'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Course</span>
                <span className="font-semibold text-slate-800">{extractedResult.profile.course || 'Not specified'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Annual Income</span>
                <span className="font-semibold text-slate-800">
                  {extractedResult.profile.annual_income ? `₹${extractedResult.profile.annual_income.toLocaleString('en-IN')}` : 'Not specified'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Category</span>
                <span className="font-semibold text-slate-800">{extractedResult.profile.category || 'Not specified'}</span>
              </div>
            </div>

            <p className="text-[11px] text-teal-800 mb-4">
              {extractedResult.verification_notice} You can edit these in the profile form anytime.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setExtractedResult(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
              >
                Re-Record / Re-Type
              </button>
              <button
                onClick={handleConfirmAndApply}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply to Search</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
