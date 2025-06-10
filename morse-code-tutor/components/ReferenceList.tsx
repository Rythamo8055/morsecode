import React, { useState, useEffect } from 'react';
import { MORSE_CODE_MAP, ALPHABET, NUMBERS, PUNCTUATION } from '../constants';
import useMorsePlayer from '../hooks/useMorsePlayer';

interface ReferenceListProps {
  isProMode: boolean;
  baseUnitDuration: number;
  isSoundGloballyEnabled: boolean;
}

const PlayIcon = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
);


const ReferenceList: React.FC<ReferenceListProps> = ({ isProMode, baseUnitDuration, isSoundGloballyEnabled }) => {
  const { playMorseCode, isPlaying, setBaseUnitDuration: setPlayerBaseUnitDuration } = useMorsePlayer(isSoundGloballyEnabled);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setPlayerBaseUnitDuration(baseUnitDuration);
  }, [baseUnitDuration, setPlayerBaseUnitDuration]);

  const charSets = [
    { title: 'Letters (A-Z)', chars: ALPHABET },
    { title: 'Numbers (0-9)', chars: NUMBERS },
    { title: 'Punctuation', chars: PUNCTUATION },
  ];

  const filteredCharSets = charSets.map(set => ({
    ...set,
    chars: set.chars.filter(char => {
        const morse = MORSE_CODE_MAP[char];
        if (!morse) return false; 
        return char.toLowerCase().includes(filter.toLowerCase()) || morse.includes(filter);
    })
  })).filter(set => set.chars.length > 0);

  return (
    // M3 Card Styling
    <div className="p-4 sm:p-5 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl my-4 mx-auto max-w-2xl">
      {/* M3 Filled Text Field for Filter */}
      <div className="relative mb-6">
        <label htmlFor="referenceFilter" className="sr-only">Filter Morse code reference</label>
        <input 
          type="text"
          id="referenceFilter"
          placeholder=" " // Important for floating label when empty
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="peer w-full h-[56px] px-4 pt-5 pb-2 bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-dark)] 
                     border-b-2 border-[var(--md-sys-color-on-surface-variant-dark)] rounded-t-[var(--md-sys-shape-corner-xs)] text-base leading-6
                     focus:border-[var(--md-sys-color-primary-dark)] focus:border-b-[3px] shadow-sm transition-colors"
          aria-label="Filter Morse code reference"
        />
        <span className={`absolute left-4 top-4 text-[var(--md-sys-color-on-surface-variant-dark)] transition-all pointer-events-none 
                        peer-placeholder-shown:top-4 peer-placeholder-shown:text-base 
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-[var(--md-sys-color-primary-dark)]
                        ${filter ? 'top-2 text-xs' : 'top-4 text-base'}`}>
           Filter by character or Morse...
        </span>
      </div>


      {filteredCharSets.length === 0 && (
        <p className="text-center text-[var(--md-sys-color-on-surface-variant-dark)] text-base py-5">No characters match your filter.</p>
      )}

      {filteredCharSets.map(set => (
        <div key={set.title} className="mb-6">
          {/* M3 Subhead or Title Small */}
          <h3 className="text-base font-medium leading-6 text-[var(--md-sys-color-on-surface-variant-dark)] border-b border-[var(--md-sys-color-outline-variant-dark)] pb-2 mb-4">{set.title}</h3>
          <ul className="space-y-2">
            {set.chars.map(char => {
              const morse = MORSE_CODE_MAP[char];
              const isDisabled = isPlaying || !isSoundGloballyEnabled;
              return (
                // M3 List Item a
                <li key={char} className="rounded-[var(--md-sys-shape-corner-md)] shadow-sm transition-shadow duration-200">
                  <button
                    onClick={() => playMorseCode(morse, isProMode)}
                    disabled={isDisabled}
                    className={`m3-ripple w-full flex items-center justify-between p-3 h-[64px] rounded-[var(--md-sys-shape-corner-md)] transition-all duration-150 ease-in-out 
                                focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)] focus-visible:ring-[var(--md-sys-color-primary-dark)]
                                ${isDisabled 
                                  ? 'bg-[var(--md-sys-color-surface-container-low-dark)] opacity-50 cursor-not-allowed' 
                                  : 'bg-[var(--md-sys-color-surface-container-high-dark)] hover:bg-[var(--md-sys-color-surface-container-highest-dark)] active:bg-[color-mix(in_srgb,var(--md-sys-color-surface-container-highest-dark)_88%,black_12%)]'
                                }`}
                    aria-label={`Play Morse code for ${char}: ${morse}`}
                    aria-disabled={isDisabled}
                  >
                    <div className="flex items-center text-left overflow-hidden">
                      {/* M3 Title Medium for Character, M3 Body Large for Morse */}
                      <span className={`text-xl font-medium w-10 text-center shrink-0 ${isDisabled ? 'text-[var(--text-emphasis-disabled-dark)]' : 'text-[var(--md-sys-color-primary-dark)]'}`}>{char}</span>
                      <span className={`ml-4 text-base font-mono tracking-wider truncate ${isDisabled ? 'text-[var(--text-emphasis-disabled-dark)]' : 'text-[var(--md-sys-color-on-surface-variant-dark)]'}`}>{morse}</span>
                    </div>
                    <PlayIcon className={`w-6 h-6 flex-shrink-0 ml-2 ${isDisabled ? 'text-[var(--text-emphasis-disabled-dark)]' : 'text-[var(--md-sys-color-primary-dark)]'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ReferenceList;