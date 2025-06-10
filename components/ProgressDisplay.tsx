import React from 'react';
import { ProgressData, CharacterProgress } from '../types';
import { CHARACTER_SETS, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MORSE_CODE_MAP } from '../constants';
import Chip from './Chip';

interface ProgressDisplayProps {
  progressData: ProgressData;
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

// M3 Semantic Color Mapping
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

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progressData }) => {
  const allCharsInSets = CHARACTER_SETS.flatMap(cs => cs.characters);
  const totalTrackedChars = allCharsInSets.length;
  
  const masteredCount = allCharsInSets.reduce((count, char) => {
    const status = getMasteryStatus(progressData[char]);
    return status === 'mastered' ? count + 1 : count;
  }, 0);

  const overallMasteryPercent = totalTrackedChars > 0 ? (masteredCount / totalTrackedChars) * 100 : 0;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-4">Your Progress</h2>

      <div 
        className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-2">Overall Mastery</h3>
        <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] rounded-[var(--md-sys-shape-corner-full)] h-6 overflow-hidden">
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
        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">
          {masteredCount} of {totalTrackedChars} characters mastered.
        </p>
      </div>

      {CHARACTER_SETS.map(set => (
        <div 
          key={set.id} 
          className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-3">{set.name}</h3>
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
  );
};

export default ProgressDisplay;