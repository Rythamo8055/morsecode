import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BottomNavigationBar from './components/BottomNavigationBar';
import Quiz from './components/Quiz';
import Controls from './components/Controls';
import ProgressDisplay from './components/ProgressDisplay';
import ReferenceList from './components/ReferenceList';
import RhythmMethodDisplay from './components/RhythmMethodDisplay'; // New
import useLocalStorage from './hooks/useLocalStorage';
import { AppView, ProgressData } from './types';
import { INITIAL_DOT_DURATION_MS, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT } from './constants';

interface SnackbarState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  id: number;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Learn);
  const [progressData, setProgressData] = useLocalStorage<ProgressData>('morseMastery_m3_v2_expressive', {}); // Changed key for new version
  
  const [isProMode, setIsProMode] = useLocalStorage<boolean>('morseProMode_m3_v2_expressive', false);
  const [isSoundGloballyEnabled, setIsSoundGloballyEnabled] = useLocalStorage<boolean>('morseSoundEnabled_m3_v2_expressive', true);
  const [baseUnitDuration, setBaseUnitDuration] = useLocalStorage<number>('morseUnitDuration_m3_v2_expressive', INITIAL_DOT_DURATION_MS);

  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newId = Date.now();
    setSnackbar({ message, type, visible: true, id: newId });
    const visibilityDuration = message.length > 70 ? 4000 : 2500; // MWC typical duration

    setTimeout(() => {
      setSnackbar(currentSnackbar => 
        (currentSnackbar && currentSnackbar.id === newId) ? { ...currentSnackbar, visible: false } : currentSnackbar
      );
    }, visibilityDuration);
     setTimeout(() => {
      setSnackbar(currentSnackbar => 
        (currentSnackbar && currentSnackbar.id === newId && !currentSnackbar.visible) ? null : currentSnackbar
      );
    }, visibilityDuration + 300); // Remove from DOM after fade out (fade out is ~300ms)
  }, []);

  const updateProgress = useCallback((char: string, correct: boolean) => {
    setProgressData(prevData => {
      const stats = prevData[char] || { correctAttempts: 0, totalAttempts: 0, mastered: false };
      const newStats = {
        ...stats,
        correctAttempts: stats.correctAttempts + (correct ? 1 : 0),
        totalAttempts: stats.totalAttempts + 1,
      };
      newStats.mastered = newStats.correctAttempts >= MASTERY_THRESHOLD_CORRECT && 
                          (newStats.totalAttempts === 0 || newStats.correctAttempts / Math.max(1,newStats.totalAttempts) >= MASTERY_THRESHOLD_PERCENT);
      return { ...prevData, [char]: newStats };
    });
  }, [setProgressData]);
  
  const toggleProMode = () => setIsProMode(prev => !prev);
  const toggleSound = () => {
    setIsSoundGloballyEnabled(prev => {
      const newState = !prev;
      if (newState) {
        showSnackbar("Sound Enabled", "info");
      } else {
        showSnackbar("Sound Disabled", "info");
      }
      return newState;
    });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case AppView.Learn:
        return <RhythmMethodDisplay
                  isProMode={isProMode}
                  baseUnitDuration={baseUnitDuration}
                  isSoundGloballyEnabled={isSoundGloballyEnabled}
                  showSnackbar={showSnackbar}
                />;
      case AppView.Quiz:
        return <Quiz 
                  progressData={progressData} 
                  updateProgress={updateProgress} 
                  isProMode={isProMode}
                  baseUnitDuration={baseUnitDuration}
                  isSoundGloballyEnabled={isSoundGloballyEnabled}
                  showSnackbar={showSnackbar}
                />;
      case AppView.Reference:
        return <ReferenceList 
                  isProMode={isProMode} 
                  baseUnitDuration={baseUnitDuration} 
                  isSoundGloballyEnabled={isSoundGloballyEnabled} 
                />;
      case AppView.Progress:
        return <ProgressDisplay progressData={progressData} />;
      default: 
        setCurrentView(AppView.Learn); // Ensure a valid view
        return null;
    }
  };
  
  const showControls = ![AppView.Progress, AppView.Learn].includes(currentView);


  return (
    <div className="min-h-screen flex flex-col bg-[var(--md-sys-color-background-dark)] text-[var(--md-sys-color-on-background-dark)]">
      <Header currentView={currentView} />
      
      {/* M3 typical padding for main content area. Bottom padding accounts for Bottom Nav Bar. */}
      <main className="flex-grow container mx-auto px-4 py-4 pb-[80px] sm:pb-[96px]"> 
        {showControls && (
             <Controls
              isSoundEnabled={isSoundGloballyEnabled}
              onToggleSound={toggleSound}
              isProMode={isProMode}
              onToggleProMode={toggleProMode}
              playbackSpeed={baseUnitDuration}
              onPlaybackSpeedChange={setBaseUnitDuration}
            />
        )}
       
        {renderCurrentView()}
      </main>

      {snackbar && ( // Only render if snackbar object exists
        <div 
          role="status" // More appropriate for snackbars that convey status
          aria-live="polite" // Announce changes politely
          className={`fixed left-1/2 -translate-x-1/2 bottom-5 w-auto min-w-[288px] max-w-[calc(100%-32px)] sm:max-w-[512px] 
            py-3.5 px-4 rounded-[var(--md-sys-shape-corner-xs)] shadow-xl z-[100] transition-all duration-300 ease-in-out
            text-sm leading-5 font-medium  /* M3 Body Medium */
            ${snackbar.type === 'success' ? 'bg-[var(--md-sys-color-inverse-surface-dark)] text-[var(--md-sys-color-inverse-on-surface-dark)]' : ''}
            ${snackbar.type === 'error' ? 'bg-[var(--md-sys-color-error-container-dark)] text-[var(--md-sys-color-on-error-container-dark)]' : ''}
            ${snackbar.type === 'info' ? 'bg-[var(--md-sys-color-inverse-surface-dark)] text-[var(--md-sys-color-inverse-on-surface-dark)]' : ''}
            ${snackbar.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {snackbar.message}
        </div>
      )}

      <BottomNavigationBar currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
};

export default App;