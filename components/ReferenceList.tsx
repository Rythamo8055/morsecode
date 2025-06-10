<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React, { useState, useMemo } from 'react';
import { MORSE_CODE_MAP } from '../constants';
import { MorseCodeMap } from '../types';
import useMorsePlayer from '../hooks/useMorsePlayer';
import IconButton from './IconButton';
import PlayArrowIcon from './icons/PlayArrowIcon';
import TextField from './TextField';
import SearchIcon from './icons/SearchIcon';

interface ReferenceListProps {
  dotDuration: number;
  soundEnabled: boolean;
}

const ReferenceList: React.FC<ReferenceListProps> = ({ dotDuration, soundEnabled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMorse, setActiveMorse] = useState<string | null>(null);
  const { isPlaying, playMorse } = useMorsePlayer(dotDuration, soundEnabled);

  const handlePlayMorse = (morse: string) => {
    if (isPlaying && activeMorse === morse) return;
    setActiveMorse(morse);
    playMorse(morse, () => setActiveMorse(null));
  };

  const filteredItems = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) return MORSE_CODE_MAP;
    return MORSE_CODE_MAP.filter(
      (item) =>
        item.char.toLowerCase().includes(lowerSearchTerm) ||
<<<<<<< HEAD
        item.morse.includes(lowerSearchTerm) || 
=======
        item.morse.includes(lowerSearchTerm) || // Morse code doesn't have case
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        item.mnemonic.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="p-4">
<<<<<<< HEAD
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-4">Morse Code Reference</h2>
=======
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-4">Morse Code Reference</h2>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      <TextField
        id="search-reference"
        label="Search by character, Morse, or mnemonic"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leadingIcon={<SearchIcon className="w-5 h-5" />}
        containerClassName="mb-6"
      />
      {!soundEnabled && (
<<<<<<< HEAD
         <p 
           className="text-center text-sm mb-4 p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
=======
         <p className="text-center text-sm mb-4 p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-variant-dark)]">
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
           Sound is currently disabled. Enable it in settings to hear Morse code.
         </p>
      )}
      {filteredItems.length === 0 && (
<<<<<<< HEAD
        <p className="text-center text-[var(--md-sys-color-on-surface-variant)]">No items match your search.</p>
      )}
      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2"> {/* Custom scrollbar styling can be added if needed */}
=======
        <p className="text-center text-[var(--md-sys-color-on-surface-variant-dark)]">No items match your search.</p>
      )}
      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        {filteredItems.map((item: MorseCodeMap) => (
          <div
            key={item.char}
            className={`
              flex items-center justify-between p-3 
<<<<<<< HEAD
              bg-[var(--md-sys-color-surface-container)] 
              rounded-[var(--md-sys-shape-corner-md)]
              hover:bg-[var(--md-sys-color-surface-container-high)]
              transition-colors duration-150
              ${activeMorse === item.morse && isPlaying ? 'ring-2 ring-[var(--md-sys-color-primary)]' : ''}
            `}
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold w-10 text-center text-[var(--md-sys-color-primary)]">{item.char}</span>
              <span className="ml-4 text-xl font-mono tracking-wider text-[var(--md-sys-color-on-surface)] flex-1">{item.morse}</span>
=======
              bg-[var(--md-sys-color-surface-container-dark)] 
              rounded-[var(--md-sys-shape-corner-md)]
              ${activeMorse === item.morse && isPlaying ? 'ring-2 ring-[var(--md-sys-color-primary-dark)]' : ''}
            `}
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold w-10 text-center text-[var(--md-sys-color-primary-dark)]">{item.char}</span>
              <span className="ml-4 text-xl font-mono tracking-wider text-[var(--md-sys-color-on-surface-dark)] flex-1">{item.morse}</span>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            </div>
            <IconButton
                variant="standard"
                onClick={() => handlePlayMorse(item.morse)}
                disabled={isPlaying && activeMorse !== item.morse}
                aria-label={`Play Morse code for ${item.char}`}
            >
              <PlayArrowIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ReferenceList;
=======
export default ReferenceList;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
