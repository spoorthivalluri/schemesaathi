import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProfileWizard from './components/ProfileWizard';
import ResultsDashboard from './components/ResultsDashboard';
import SchemeDetailModal from './components/SchemeDetailModal';
import BridgeTheGapModal from './components/BridgeTheGapModal';
import VoiceInputModal from './components/VoiceInputModal';
import AboutModal from './components/AboutModal';

import { fetchHealth, matchProfile } from './services/api';

const INITIAL_PROFILE = {
  state: null,
  age: null,
  education_level: null,
  course: null,
  annual_income: null,
  category: null,
  gender: null,
  locality: 'urban'
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'wizard' | 'results'
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [matchResults, setMatchResults] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  // Modals state
  const [selectedDetailResult, setSelectedDetailResult] = useState(null);
  const [bridgeSchemeId, setBridgeSchemeId] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Health and backend status
  const [aiHealth, setAiHealth] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setAiHealth(data))
      .catch((err) => console.warn('Backend offline check:', err));
  }, []);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleRunMatch = async (customProfile = null) => {
    const profToUse = customProfile || profile;
    setIsMatching(true);
    try {
      const results = await matchProfile(profToUse);
      setMatchResults(results);
      setCurrentView('results');
    } catch (err) {
      console.error('Match error:', err);
      showNotification('Could not connect to backend evaluation engine. Please verify the backend is running.', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  const handleSelectScenario = (scenario) => {
    setProfile(scenario.profile);
    showNotification(`Loaded ${scenario.title}. Running deterministic evaluation...`, 'success');
    handleRunMatch(scenario.profile);
  };

  const handleResetProfile = () => {
    setProfile(INITIAL_PROFILE);
    setMatchResults(null);
    setCurrentView('landing');
    showNotification('Profile reset successfully.', 'info');
  };

  const handleProfileExtractedFromVoice = (extracted) => {
    setProfile((prev) => ({
      ...prev,
      ...extracted
    }));
    showNotification('Voice profile applied! Review details before discovery.', 'success');
    setCurrentView('wizard');
  };

  const hasActiveProfile = !!(profile.state || profile.course || profile.annual_income !== null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        aiHealth={aiHealth}
        hasActiveProfile={hasActiveProfile}
        onResetProfile={handleResetProfile}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm p-4 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border animate-fadeIn bg-slate-900 text-white border-slate-700">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartWizard={() => setCurrentView('wizard')}
            onSelectScenario={handleSelectScenario}
            onOpenAbout={() => setIsAboutModalOpen(true)}
          />
        )}

        {currentView === 'wizard' && (
          <ProfileWizard
            profile={profile}
            setProfile={setProfile}
            onRunMatch={() => handleRunMatch()}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {currentView === 'results' && (
          <ResultsDashboard
            matchResults={matchResults}
            onOpenDetails={(res) => setSelectedDetailResult(res)}
            onOpenBridge={(id) => setBridgeSchemeId(id)}
            onEditProfile={() => setCurrentView('wizard')}
            onReset={handleResetProfile}
          />
        )}
      </main>

      {/* Modals */}
      <SchemeDetailModal
        isOpen={!!selectedDetailResult}
        onClose={() => setSelectedDetailResult(null)}
        evaluationResult={selectedDetailResult}
        profile={profile}
        onOpenBridge={(id) => setBridgeSchemeId(id)}
      />

      <BridgeTheGapModal
        isOpen={!!bridgeSchemeId}
        onClose={() => setBridgeSchemeId(null)}
        failedSchemeId={bridgeSchemeId}
        profile={profile}
        onSelectAlternative={(altId) => {
          if (matchResults?.all_results) {
            const found = matchResults.all_results.find((r) => r.scheme.id === altId);
            if (found) setSelectedDetailResult(found);
          }
        }}
      />

      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onProfileExtracted={handleProfileExtractedFromVoice}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        aiHealth={aiHealth}
      />
    </div>
  );
}
