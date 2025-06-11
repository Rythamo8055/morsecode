
import React from 'react';
import { ProgressData, CharacterProgress, UserStats, BadgeDefinition } from '../types';
import { 
    CHARACTER_SETS, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MORSE_CODE_MAP, 
    BADGE_DEFINITIONS, getXPForNextLevel, XP_DAILY_BONUS
} from '../constants';
import Chip from './Chip';
import LevelBar from './LevelBar';
import StarIcon from './icons/StarIcon';
import FlameIcon from './icons/FlameIcon';
import AwardIcon from './icons/AwardIcon'; // Default badge icon
import Button from './Button';

interface ProgressDisplayProps {
  progressData: ProgressData;
  userStats: UserStats;
  onClaimDailyBonus: () => void;
}

const getMasteryStatus = (progress: CharacterProgress | undefined) => {
  if (!progress || progress.attempts === 0) return 'not-attempted';
  const correctRate = progress.attempts > 0 ? progress.correct / progress.attempts : 0;
  if (progress.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT) {
    return 'mastered';
  }
  if (correctRate >= 0.5) return 'good-progress';
  return 'low-progress';
};

const statusColors = {
  'mastered': { 
    bg: 'bg-[var(--md-sys-color-tertiary-container)]', 
    text: 'text-[var(--md-sys-color-on-tertiary-container)]' 
  },
  'good-progress': { 
    bg: 'bg-[var(--md-sys-color-secondary-container)]', 
    text: 'text-[var(--md-sys-color-on-secondary-container)]' 
  },
  'low-progress': { 
    bg: 'bg-[var(--md-sys-color-error-container)]', 
    text: 'text-[var(--md-sys-color-on-error-container)]' 
  },
  'not-attempted': { 
    bg: 'bg-[var(--md-sys-color-surface-container-highest)]', 
    text: 'text-[var(--md-sys-color-on-surface-variant)]' 
  },
};

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progressData, userStats, onClaimDailyBonus }) => {
  const allCharsInSets = CHARACTER_SETS.flatMap(cs => cs.characters);
  const totalTrackedChars = allCharsInSets.length;
  
  const masteredCount = allCharsInSets.reduce((count, char) => {
    const status = getMasteryStatus(progressData[char]);
    return status === 'mastered' ? count + 1 : count;
  }, 0);

  const overallMasteryPercent = totalTrackedChars > 0 ? (masteredCount / totalTrackedChars) * 100 : 0;

  const xpForCurrentLevel = (() => {
    let xp = 0;
    for (let i = 1; i < userStats.level; i++) {
      xp += getXPForNextLevel(i);
    }
    return xp;
  })();
  const currentXPInLevel = userStats.totalXP - xpForCurrentLevel;
  const xpNeededForThisLevelUp = getXPForNextLevel(userStats.level);

  const today = new Date().toISOString().split('T')[0];
  const dailyBonusAvailable = userStats.dailyBonusClaimedDate !== today;

  const earnedBadgesDetails = userStats.earnedBadges
    .map(badgeId => BADGE_DEFINITIONS.find(def => def.id === badgeId))
    .filter(Boolean) as BadgeDefinition[];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-0">Your Profile</h2>

      {/* Stats Overview Card */}
      <div 
        className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)]">Level & XP</h3>
            <span className="text-sm text-[var(--md-sys-color-primary)] font-semibold">Total XP: {userStats.totalXP}</span>
        </div>
        <LevelBar currentXP={currentXPInLevel} xpForNextLevel={xpNeededForThisLevelUp} level={userStats.level} />
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
                <FlameIcon className="w-5 h-5 mr-2 text-[var(--md-sys-color-tertiary)]"/>
                <div>
                    <span className="block text-[var(--md-sys-color-on-surface-variant)]">Longest Streak</span>
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)]">{userStats.longestQuizStreak}</span>
                </div>
            </div>
             <div className="flex items-center">
                <AwardIcon className="w-5 h-5 mr-2 text-[var(--md-sys-color-secondary)]"/>
                <div>
                    <span className="block text-[var(--md-sys-color-on-surface-variant)]">Badges</span>
                    <span className="font-semibold text-[var(--md-sys-color-on-surface)]">{earnedBadgesDetails.length} / {BADGE_DEFINITIONS.length}</span>
                </div>
            </div>
        </div>
        {dailyBonusAvailable && (
            <Button 
                variant="tonal" 
                onClick={onClaimDailyBonus} 
                className="w-full mt-4"
                leadingIcon={<StarIcon />}
            >
                Claim Daily Bonus (+{XP_DAILY_BONUS} XP)
            </Button>
        )}
         {!dailyBonusAvailable && (
            <p className="text-center text-xs text-[var(--md-sys-color-on-surface-variant)] mt-4 p-2 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-sm)]">
                Daily bonus claimed for today! Come back tomorrow.
            </p>
        )}
      </div>

      {/* Badges Section */}
      {earnedBadgesDetails.length > 0 && (
        <div 
          className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-3">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {earnedBadgesDetails.map(badge => {
              const IconComponent = badge.icon as React.ElementType; // Cast to make TS happy
              return (
                <div key={badge.id} title={`${badge.name}: ${badge.description}`}
                     className="flex flex-col items-center p-2 w-24 text-center bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-md)] transition-transform hover:scale-105" >
                  <IconComponent className="w-8 h-8 mb-1 text-[var(--md-sys-color-primary)]" />
                  <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-tight">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* Character Mastery Progress */}
      <div 
        className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-2">Character Mastery</h3>
        <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] rounded-[var(--md-sys-shape-corner-full)] h-5 overflow-hidden mb-1">
          <div
            className="h-full bg-[var(--md-sys-color-primary)] transition-all duration-500 ease-out flex items-center justify-center text-xs font-medium text-[var(--md-sys-color-on-primary)]"
            style={{ width: `${overallMasteryPercent}%` }}
            role="progressbar"
            aria-valuenow={overallMasteryPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {overallMasteryPercent > 10 ? `${Math.round(overallMasteryPercent)}%` : ''}
          </div>
        </div>
        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1 mb-3 text-center">
          {masteredCount} of {totalTrackedChars} characters mastered.
        </p>
        {CHARACTER_SETS.map(set => (
          <div key={set.id} className="mb-3">
            <h4 className="text-md font-medium text-[var(--md-sys-color-on-surface-variant)] mb-2">{set.name}</h4>
            <div className="flex flex-wrap gap-2">
              {set.characters.map(char => {
                const progress = progressData[char];
                const status = getMasteryStatus(progress);
                const colors = statusColors[status];
                const morseItem = MORSE_CODE_MAP.find(m => m.char === char);
                const tooltip = progress 
                  ? `${char} (${morseItem?.morse || ''}): ${progress.correct}/${progress.attempts} correct. Status: ${status.replace('-', ' ')}`
                  : `${char} (${morseItem?.morse || ''}): Not attempted yet.`;

                return (
                  <Chip
                    key={char}
                    label={char}
                    color={colors.bg} 
                    textColor={colors.text}
                    title={tooltip}
                    className="w-10 h-10 !rounded-[var(--md-sys-shape-corner-md)] !px-0 !text-lg justify-center"
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressDisplay;
