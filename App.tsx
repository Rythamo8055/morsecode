
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
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const resumeAudio = () => {
      // AudioContext resume logic is primarily handled within useMorsePlayer now.
      // This global listener can be simplified or removed if not strictly needed
      // for other audio sources.
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
    // Calculate available height for views like ReferenceList
    // Header (h-16 = 64px), BottomNav (h-20 = 80px + bottom-4 = 16px -> 96px total from bottom of viewport)
    // Total static vertical space = 64px (header) + 96px (bottom nav area) = 160px
    // The main content area has pb-24 (96px).
    // The actual scrollable content height is 100vh - header height.
    // The padding-bottom on main is to prevent overlap with the fixed BottomNav.

    if (isLoading) {
      // Use min-h-full or similar to ensure it takes up space correctly if needed
      return <div className="flex items-center justify-center flex-grow"><LoadingIndicator text="Loading Morse Mentor..." /></div>;
    }
    switch (currentView) {
      case AppView.Learn:
        return <RhythmMethodDisplay dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} onShowSnackbar={showSnackbar} />;
      case AppView.Quiz:
        return <Quiz progressData={progressData} onUpdateProgress={handleUpdateProgress} settings={settings} onShowSnackbar={showSnackbar} />;
      case AppView.Reference:
        // ReferenceList is now designed to be flex-col h-full of its parent
        return <ReferenceList dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} />;
      case AppView.Progress:
        return <ProgressDisplay progressData={progressData} />;
      default:
        return null;
    }
  };
  
  const shouldShowSettingsButton = currentView === AppView.Learn || currentView === AppView.Quiz || currentView === AppView.Reference;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--md-sys-color-background)]">
      <Header 
        title={getHeaderTitle()} 
        showSettingsButton={shouldShowSettingsButton}
        onSettingsClick={() => setShowControls(true)}
      />
      {/* 
        Main content area:
        - flex-grow: takes available vertical space
        - overflow-y-auto: enables scrolling for content that overflows this area
        - pb-24: padding at the bottom to ensure content doesn't hide behind the BottomNavigationBar (80px height + 16px bottom offset)
        - For views like ReferenceList that manage their own internal scrolling (flex-col h-full), this setup works.
          The h-full in ReferenceList refers to the height of this main element.
      */}
      <main className="flex-grow overflow-y-auto pb-24 flex flex-col"> 
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

export default App;
