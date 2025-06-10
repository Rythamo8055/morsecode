<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Settings, ProgressData, SnackbarMessage, QuizMode } from './types';
import { INITIAL_SETTINGS, INITIAL_PROGRESS, DEFAULT_PLAYBACK_SPEED, PRO_MODE_PLAYBACK_SPEED } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import BottomNavigationBar from './components/BottomNavigationBar';
import RhythmMethodDisplay from './components/RhythmMethodDisplay';
import Quiz from './components/Quiz';
import ReferenceList from './components/ReferenceList';
import ProgressDisplay from './components/ProgressDisplay';
import Controls from './components/Controls';
import Snackbar from './components/Snackbar';
import LoadingIndicator from './components/LoadingIndicator';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Learn);
  const [settings, setSettings] = useLocalStorage<Settings>('morseMentorSettings', INITIAL_SETTINGS);
  const [progressData, setProgressData] = useLocalStorage<ProgressData>('morseMentorProgress', INITIAL_PROGRESS);
  const [showControls, setShowControls] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
=======
  const [isLoading, setIsLoading] = useState(true); // For initial load simulation or PWA readiness

  useEffect(() => {
    // Simulate initial loading or PWA asset readiness check
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
<<<<<<< HEAD
  useEffect(() => {
    const resumeAudio = () => {
      // AudioContext resume logic is primarily handled within useMorsePlayer now.
      // This global listener can be simplified or removed if not strictly needed
      // for other audio sources.
=======
  // Resume AudioContext on first user interaction globally (alternative to per-hook)
  useEffect(() => {
    const resumeAudio = () => {
      if (typeof window !== 'undefined' && window.AudioContext) {
        // A common pattern is to create a dummy context and resume it
        // This is mostly handled by useMorsePlayer now.
      }
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      document.body.removeEventListener('click', resumeAudio, true);
      document.body.removeEventListener('touchstart', resumeAudio, true);
    };
    document.body.addEventListener('click', resumeAudio, true);
    document.body.addEventListener('touchstart', resumeAudio, true);
    return () => {
      document.body.removeEventListener('click', resumeAudio, true);
      document.body.removeEventListener('touchstart', resumeAudio, true);
    };
  }, []);


  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleUpdateProgress = useCallback((char: string, isCorrect: boolean) => {
    setProgressData(prev => {
      const current = prev[char] || { attempts: 0, correct: 0 };
      return {
        ...prev,
        [char]: {
          attempts: current.attempts + 1,
          correct: current.correct + (isCorrect ? 1 : 0),
        },
      };
    });
  }, [setProgressData]);

  const showSnackbar = (message: string, type: SnackbarMessage['type']) => {
    setSnackbar({ id: Date.now(), message, type });
  };

  const dismissSnackbar = () => {
    setSnackbar(null);
  };

  const effectivePlaybackSpeed = settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed;

  const getHeaderTitle = () => {
    switch (currentView) {
      case AppView.Learn: return 'Learn Morse';
      case AppView.Quiz: return 'Practice Quiz';
      case AppView.Reference: return 'Morse Reference';
      case AppView.Progress: return 'Your Progress';
      default: return 'Morse Mentor';
    }
  };
  
  const renderView = () => {
    if (isLoading) {
<<<<<<< HEAD
      return <div className="flex items-center justify-center h-[calc(100vh-144px)]"><LoadingIndicator text="Loading Morse Mentor..." /></div>;
=======
      return <div className="flex items-center justify-center h-[calc(100vh-144px)]"><LoadingIndicator text="Loading Morse Mentor..." /></div>; // 144px = header + nav bar height
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
    }
    switch (currentView) {
      case AppView.Learn:
        return <RhythmMethodDisplay dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} onShowSnackbar={showSnackbar} />;
      case AppView.Quiz:
        return <Quiz progressData={progressData} onUpdateProgress={handleUpdateProgress} settings={settings} onShowSnackbar={showSnackbar} />;
      case AppView.Reference:
        return <ReferenceList dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} />;
      case AppView.Progress:
        return <ProgressDisplay progressData={progressData} />;
      default:
        return null;
    }
  };
  
  const shouldShowSettingsButton = currentView === AppView.Learn || currentView === AppView.Quiz || currentView === AppView.Reference;

  return (
<<<<<<< HEAD
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--md-sys-color-background)]">
=======
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--md-sys-color-background-dark)]">
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      <Header 
        title={getHeaderTitle()} 
        showSettingsButton={shouldShowSettingsButton}
        onSettingsClick={() => setShowControls(true)}
      />
<<<<<<< HEAD
      <main className="flex-grow overflow-y-auto pb-24"> {/* pb-24 (96px) for bottom nav: h-20 (80px) + bottom-4 (16px) */}
=======
      <main className="flex-grow overflow-y-auto pb-20"> {/* pb-20 for bottom nav */}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        {renderView()}
      </main>
      <BottomNavigationBar currentView={currentView} onNavigate={setCurrentView} />
      {showControls && (
        <Controls
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowControls(false)}
        />
      )}
      <Snackbar message={snackbar} onDismiss={dismissSnackbar} />
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
