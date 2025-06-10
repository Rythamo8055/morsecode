<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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

<<<<<<< HEAD
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
=======
const statusColors = {
  'mastered': { bg: 'bg-green-500', text: 'text-white' }, // Using semantic colors for clarity
  'good-progress': { bg: 'bg-yellow-500', text: 'text-black' },
  'low-progress': { bg: 'bg-red-500', text: 'text-white' },
  'not-attempted': { bg: 'bg-[var(--md-sys-color-surface-container-highest-dark)]', text: 'text-[var(--md-sys-color-on-surface-variant-dark)]' },
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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
<<<<<<< HEAD
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-4">Your Progress</h2>

      <div 
        className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-2">Overall Mastery</h3>
        <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] rounded-[var(--md-sys-shape-corner-full)] h-6 overflow-hidden">
          <div
            className="h-full bg-[var(--md-sys-color-primary)] transition-all duration-500 ease-out flex items-center justify-center text-xs font-medium text-[var(--md-sys-color-on-primary)]"
=======
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-4">Your Progress</h2>

      <div className="bg-[var(--md-sys-color-surface-container-dark)] p-4 rounded-[var(--md-sys-shape-corner-lg)]">
        <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface-dark)] mb-2">Overall Mastery</h3>
        <div className="w-full bg-[var(--md-sys-color-surface-container-highest-dark)] rounded-[var(--md-sys-shape-corner-full)] h-6 overflow-hidden">
          <div
            className="h-full bg-[var(--md-sys-color-primary-dark)] transition-all duration-500 ease-out flex items-center justify-center text-xs font-medium text-[var(--md-sys-color-on-primary-dark)]"
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            style={{ width: `${overallMasteryPercent}%` }}
            role="progressbar"
            aria-valuenow={overallMasteryPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
<<<<<<< HEAD
            {overallMasteryPercent > 10 ? `${Math.round(overallMasteryPercent)}%` : ''}
          </div>
        </div>
        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">
=======
            {Math.round(overallMasteryPercent)}%
          </div>
        </div>
        <p className="text-sm text-[var(--md-sys-color-on-surface-variant-dark)] mt-1">
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          {masteredCount} of {totalTrackedChars} characters mastered.
        </p>
      </div>

      {CHARACTER_SETS.map(set => (
<<<<<<< HEAD
        <div 
          key={set.id} 
          className="bg-[var(--md-sys-color-surface-container)] p-4 rounded-[var(--md-sys-shape-corner-lg)] border border-[var(--md-sys-color-outline-variant)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface)] mb-3">{set.name}</h3>
=======
        <div key={set.id} className="bg-[var(--md-sys-color-surface-container-dark)] p-4 rounded-[var(--md-sys-shape-corner-lg)]">
          <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface-dark)] mb-3">{set.name}</h3>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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
<<<<<<< HEAD
                  color={colors.bg} 
                  textColor={colors.text}
                  title={tooltip}
                  className="w-10 h-10 !rounded-[var(--md-sys-shape-corner-md)] !px-0 !text-lg justify-center"
=======
                  color={colors.bg}
                  textColor={colors.text}
                  title={tooltip}
                  className="w-10 h-10 !rounded-[var(--md-sys-shape-corner-md)] !px-0 !text-lg justify-center" // Custom styling for square tiles
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

<<<<<<< HEAD
export default ProgressDisplay;
=======
export default ProgressDisplay;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
