
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Settings, ProgressData, SnackbarMessage, UserStats, BadgeDefinition, QuizSessionStats, BadgeId } from './types';
import { 
  INITIAL_SETTINGS, INITIAL_PROGRESS, DEFAULT_PLAYBACK_SPEED, PRO_MODE_PLAYBACK_SPEED, 
  INITIAL_USER_STATS, XP_PER_CORRECT_ANSWER, XP_STREAK_BONUS_MULTIPLIER, 
  getXPForNextLevel, BADGE_DEFINITIONS, XP_DAILY_BONUS, LEVEL_UP_SOUND_MORSE, BADGE_UNLOCK_SOUND_MORSE
} from './constants';
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
import useMorsePlayer from './hooks/useMorsePlayer'; // For sound feedback

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Learn);
  const [settings, setSettings] = useLocalStorage<Settings>('morseMentorSettings', INITIAL_SETTINGS);
  const [progressData, setProgressData] = useLocalStorage<ProgressData>('morseMentorProgress', INITIAL_PROGRESS);
  const [userStats, setUserStats] = useLocalStorage<UserStats>('morseMentorUserStats', INITIAL_USER_STATS);
  const [showControls, setShowControls] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  const effectivePlaybackSpeed = settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed;
  const { playMorse: playSoundFeedback } = useMorsePlayer(effectivePlaybackSpeed, settings.soundEnabled);


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const showSnackbar = useCallback((message: string, type: SnackbarMessage['type']) => {
    setSnackbar({ id: Date.now(), message, type });
  }, []);

  // Check for daily bonus on app load or view change if relevant
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userStats.lastActivityDate !== today && userStats.dailyBonusClaimedDate !== today) {
      // Logic to prompt for daily bonus could be here, or implicitly handled on first action
    }
    // Update last activity date
    if (userStats.lastActivityDate !== today) {
      setUserStats(prev => ({ ...prev, lastActivityDate: today }));
    }
  }, [userStats.lastActivityDate, userStats.dailyBonusClaimedDate, setUserStats]);


  const claimDailyBonus = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userStats.dailyBonusClaimedDate !== today) {
      setUserStats(prev => {
        const newTotalXP = prev.totalXP + XP_DAILY_BONUS;
        const newStats: UserStats = {
          ...prev,
          totalXP: newTotalXP,
          dailyBonusClaimedDate: today,
          dailyBonusClaimsCount: prev.dailyBonusClaimsCount + 1,
        };
        // Check for level up after bonus
        let newLevel = prev.level;
        let xpForNext = getXPForNextLevel(newLevel); 
        
        let totalXpToReachCurrentLevel = 0;
        for (let i = 1; i < prev.level; i++) {
            totalXpToReachCurrentLevel += getXPForNextLevel(i);
        }
         if (prev.level === 1) totalXpToReachCurrentLevel = 0;


        let currentXPInLevelAfterBonus = newTotalXP - totalXpToReachCurrentLevel;
        
        while (currentXPInLevelAfterBonus >= xpForNext && xpForNext > 0) { // Add xpForNext > 0 to prevent infinite loop if getXPForNextLevel returns 0
          currentXPInLevelAfterBonus -= xpForNext; 
          newLevel++;
          xpForNext = getXPForNextLevel(newLevel); 
        }

        if (newLevel > prev.level) {
          showSnackbar(`Level Up! Reached Level ${newLevel}!`, 'success');
          if (settings.soundEnabled) playSoundFeedback(LEVEL_UP_SOUND_MORSE);
        }
        newStats.level = newLevel;
        return newStats;
      });
      showSnackbar(`Daily Bonus! +${XP_DAILY_BONUS} XP claimed!`, 'success');
    }
  }, [userStats, setUserStats, showSnackbar, settings.soundEnabled, playSoundFeedback]);


  const checkAndAwardBadges = useCallback((quizSessionStats?: QuizSessionStats) => {
    setUserStats(prevStats => {
      const newlyEarnedBadges: BadgeId[] = BADGE_DEFINITIONS.filter(badgeDef => {
        if (prevStats.earnedBadges.includes(badgeDef.id)) {
          return false; 
        }
        return badgeDef.condition(progressData, prevStats, quizSessionStats);
      }).map(b => b.id);

      if (newlyEarnedBadges.length > 0) {
        newlyEarnedBadges.forEach(badgeId => {
            const badgeInfo = BADGE_DEFINITIONS.find(b => b.id === badgeId);
            if (badgeInfo) {
              showSnackbar(`Achievement Unlocked: ${badgeInfo.name}!`, 'success');
              if(settings.soundEnabled) playSoundFeedback(BADGE_UNLOCK_SOUND_MORSE);
            }
        });
        return {
          ...prevStats,
          earnedBadges: [...prevStats.earnedBadges, ...newlyEarnedBadges],
        };
      }
      return prevStats; 
    });
  }, [setUserStats, progressData, showSnackbar, settings.soundEnabled, playSoundFeedback]); 

  useEffect(() => {
    checkAndAwardBadges();
  }, [progressData, userStats.level, userStats.longestQuizStreak, userStats.dailyBonusClaimsCount, userStats.completedQuizSessions, checkAndAwardBadges]);


  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const handleQuizQuestionAnswered = useCallback((char: string, isCorrect: boolean, currentSessionStreak: number, quizSessionStats: QuizSessionStats) => {
    setProgressData(prevProgress => {
      const current = prevProgress[char] || { attempts: 0, correct: 0, score: 0 };
      return {
        ...prevProgress,
        [char]: {
          attempts: current.attempts + 1,
          correct: current.correct + (isCorrect ? 1 : 0),
          score: (current.score || 0) + (isCorrect ? XP_PER_CORRECT_ANSWER : 0),
        },
      };
    });

    if (isCorrect) {
      setUserStats(prevStats => {
        let newXP = prevStats.totalXP + XP_PER_CORRECT_ANSWER;
        newXP += currentSessionStreak * XP_STREAK_BONUS_MULTIPLIER;

        let updatedLevel = prevStats.level;
        let totalXpToReachCurrentLevelStart = 0; 
        for (let i = 1; i < updatedLevel; i++) { 
            totalXpToReachCurrentLevelStart += getXPForNextLevel(i);
        }
         if (updatedLevel === 1) totalXpToReachCurrentLevelStart = 0;


        let xpIntoCurrentLevel = newXP - totalXpToReachCurrentLevelStart;
        let xpNeededForThisLevelUp = getXPForNextLevel(updatedLevel);

        while (xpIntoCurrentLevel >= xpNeededForThisLevelUp && xpNeededForThisLevelUp > 0) {
            xpIntoCurrentLevel -= xpNeededForThisLevelUp; 
            updatedLevel++;
            xpNeededForThisLevelUp = getXPForNextLevel(updatedLevel); 
            showSnackbar(`Level Up! Reached Level ${updatedLevel}!`, 'success');
            if(settings.soundEnabled) playSoundFeedback(LEVEL_UP_SOUND_MORSE);
        }

        const newLongestStreak = Math.max(prevStats.longestQuizStreak, currentSessionStreak);

        return {
          ...prevStats,
          totalXP: newXP,
          level: updatedLevel,
          currentQuizStreak: currentSessionStreak, 
          longestQuizStreak: newLongestStreak,
        };
      });
    }
  }, [setProgressData, setUserStats, showSnackbar, settings.soundEnabled, playSoundFeedback]);

  const handleQuizSessionComplete = useCallback((quizSessionStats: QuizSessionStats) => {
    setUserStats(prev => ({
        ...prev,
        completedQuizSessions: prev.completedQuizSessions + 1,
    }));
    checkAndAwardBadges(quizSessionStats);
  }, [setUserStats, checkAndAwardBadges]);


  const getHeaderTitle = () => {
    switch (currentView) {
      case AppView.Learn: return 'Learn Morse';
      case AppView.Quiz: return 'Practice Quiz';
      case AppView.Reference: return 'Morse Reference';
      case AppView.Progress: return 'Your Profile';
      default: return 'Morse Mentor';
    }
  };
  
  const handleViewInteraction = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userStats.lastActivityDate !== today) {
      setUserStats(prev => ({ ...prev, lastActivityDate: today }));
      if (userStats.dailyBonusClaimedDate !== today) {
          if (currentView === AppView.Learn || currentView === AppView.Quiz || currentView === AppView.Progress) { 
             claimDailyBonus();
          }
      }
    }
  }, [userStats.lastActivityDate, userStats.dailyBonusClaimedDate, setUserStats, claimDailyBonus, currentView]);

  useEffect(() => {
    handleViewInteraction();
  }, [currentView, handleViewInteraction]);


  const renderView = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center flex-grow"><LoadingIndicator text="Loading Morse Mentor..." /></div>;
    }
    switch (currentView) {
      case AppView.Learn:
        return <RhythmMethodDisplay dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} onShowSnackbar={showSnackbar} />;
      case AppView.Quiz:
        return <Quiz 
                  progressData={progressData} 
                  onQuestionAnswered={handleQuizQuestionAnswered}
                  onSessionComplete={handleQuizSessionComplete}
                  settings={settings} 
                  onShowSnackbar={showSnackbar} 
                  userStats={userStats}
                  playUiSound={playSoundFeedback} // Pass the sound player for UI feedback
                />;
      case AppView.Reference:
        return <ReferenceList dotDuration={effectivePlaybackSpeed} soundEnabled={settings.soundEnabled} />;
      case AppView.Progress:
        return <ProgressDisplay progressData={progressData} userStats={userStats} onClaimDailyBonus={claimDailyBonus} />;
      default:
        return null;
    }
  };
  
  const shouldShowSettingsButton = currentView === AppView.Learn || currentView === AppView.Quiz || currentView === AppView.Reference || currentView === AppView.Progress;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--md-sys-color-background)]">
      <Header 
        title={getHeaderTitle()} 
        showSettingsButton={shouldShowSettingsButton}
        onSettingsClick={() => setShowControls(true)}
      />
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
      <Snackbar message={snackbar} onDismiss={() => setSnackbar(null)} />
    </div>
  );
};

export default App;