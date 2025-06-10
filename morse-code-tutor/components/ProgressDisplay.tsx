import React from 'react';
import { ProgressData } from '../types';
import { ALPHABET, NUMBERS, PUNCTUATION, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MORSE_CODE_MAP } from '../constants';

interface ProgressDisplayProps {
  progressData: ProgressData;
}

const CharacterTile: React.FC<{ char: string; stats?: ProgressData[string] }> = ({ char, stats }) => {
  let tileBgColor = 'bg-[var(--md-sys-color-surface-container-high-dark)]';
  let textColor = 'text-[var(--md-sys-color-on-surface-variant-dark)]';
  let ringColor = 'ring-[var(--md-sys-color-outline-dark)]';
  
  const isMastered = stats && (stats.mastered || (stats.correctAttempts >= MASTERY_THRESHOLD_CORRECT && (stats.totalAttempts === 0 || stats.correctAttempts / Math.max(1, stats.totalAttempts) >= MASTERY_THRESHOLD_PERCENT)));

  if (stats) {
    const progressPercentage = stats.totalAttempts > 0 ? (stats.correctAttempts / stats.totalAttempts) * 100 : 0;
    if (isMastered) {
      tileBgColor = 'bg-[var(--md-sys-color-primary-container-dark)]';
      textColor = 'text-[var(--md-sys-color-on-primary-container-dark)]';
      ringColor = 'ring-[var(--md-sys-color-primary-dark)]';
    } else if (stats.totalAttempts > 0) {
      if (progressPercentage >= 75) { // Good progress
        tileBgColor = 'bg-[var(--md-sys-color-secondary-container-dark)]';
        textColor = 'text-[var(--md-sys-color-on-secondary-container-dark)]';
        ringColor = 'ring-[var(--md-sys-color-secondary-dark)]';
      } else if (progressPercentage >= 40) { // Some progress
        tileBgColor = 'bg-[var(--md-sys-color-tertiary-container-dark)]';
        textColor = 'text-[var(--md-sys-color-on-tertiary-container-dark)]';
        ringColor = 'ring-[var(--md-sys-color-tertiary-dark)]';
      } else { // Low progress or many mistakes
        tileBgColor = 'bg-[var(--md-sys-color-error-container-dark)]';
        textColor = 'text-[var(--md-sys-color-on-error-container-dark)]';
        ringColor = 'ring-[var(--md-sys-color-error-dark)]';
      }
    }
  }
  
  const tooltipText = stats 
    ? `Character: ${char}\nCorrect: ${stats.correctAttempts}\nAttempts: ${stats.totalAttempts}\nMastered: ${isMastered ? 'Yes' : 'No'}`
    : `Character: ${char}\nNot attempted yet`;

  // M3 Chip like styling
  return (
    <div 
      title={tooltipText}
      className={`h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center font-mono text-base sm:text-lg rounded-[var(--md-sys-shape-corner-sm)] 
                  ${tileBgColor} ${textColor} ${ringColor} 
                  shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md ring-1 hover:ring-2`}
      aria-label={tooltipText}
    >
      {char}
    </div>
  );
};

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progressData }) => {
  const allChars = [...ALPHABET, ...NUMBERS, ...PUNCTUATION];
  
  const masteredCount = allChars.filter(char => {
    const stats = progressData[char];
    return stats && (stats.mastered || (stats.correctAttempts >= MASTERY_THRESHOLD_CORRECT && (stats.totalAttempts === 0 || stats.correctAttempts / Math.max(1,stats.totalAttempts) >= MASTERY_THRESHOLD_PERCENT)));
  }).length;
  
  const totalTrackedChars = allChars.length; 
  const overallProgressPercentage = totalTrackedChars > 0 ? (masteredCount / totalTrackedChars) * 100 : 0;

  const sections: Array<{ title: string; charSet: string[] }> = [
    { title: 'Letters (A-Z)', charSet: ALPHABET },
    { title: 'Numbers (0-9)', charSet: NUMBERS },
    { title: 'Punctuation', charSet: PUNCTUATION.filter(p => MORSE_CODE_MAP[p]) }, // Only show punctuation with morse codes
  ];

  return (
    // M3 Card Styling
    <div className="p-4 sm:p-5 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl my-4 mx-auto max-w-3xl">
      {/* M3 Headline Small or Title Large */}
      <h2 className="text-2xl sm:text-[1.75rem] font-normal leading-8 sm:leading-9 text-[var(--md-sys-color-primary-dark)] mb-1 text-center">Overall Mastery</h2>
      {/* M3 Body Medium */}
      <p className="text-sm leading-5 text-[var(--md-sys-color-on-surface-variant-dark)] mb-5 text-center">
        {masteredCount} of {totalTrackedChars} characters mastered
      </p>
      {/* M3 Linear Progress Indicator */}
      <div className="w-full bg-[var(--md-sys-color-surface-container-highest-dark)] rounded-[var(--md-sys-shape-corner-full)] h-2.5 mb-8 shadow-inner overflow-hidden">
        <div 
          className="bg-[var(--md-sys-color-primary-dark)] h-full rounded-[var(--md-sys-shape-corner-full)] transition-all duration-500 ease-out"
          style={{ width: `${overallProgressPercentage}%` }}
          role="progressbar"
          aria-valuenow={overallProgressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Mastery progress: ${overallProgressPercentage.toFixed(0)}%`}
        ></div>
      </div>

      {sections.map(section => (
        <div key={section.title} className="mb-6">
          {/* M3 Title Medium */}
          <h3 className="text-base font-medium leading-6 text-[var(--md-sys-color-on-surface-variant-dark)] border-b border-[var(--md-sys-color-outline-variant-dark)] pb-2.5 mb-4">{section.title}</h3>
          {section.charSet.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {section.charSet.map(char => (
                <CharacterTile key={char} char={char} stats={progressData[char]} />
              ))}
            </div>
          ) : (
            <p className="text-[var(--md-sys-color-on-surface-variant-dark)] opacity-70 text-sm leading-5">No characters tracked in this section.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressDisplay;