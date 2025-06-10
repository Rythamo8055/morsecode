import React, { useState } from 'react';
import { MORSE_CODE_MAP } from '../constants';
import { MorseCodeMap } from '../types';
import RhythmItem from './RhythmItem';
import useMorsePlayer from '../hooks/useMorsePlayer';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

interface RhythmMethodDisplayProps {
  dotDuration: number;
  soundEnabled: boolean;
  onShowSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
}

const RhythmMethodDisplay: React.FC<RhythmMethodDisplayProps> = ({ dotDuration, soundEnabled, onShowSnackbar }) => {
  const [activeChar, setActiveChar] = useState<string | null>(null);
  
  const { isPlaying: isPlayingMorse, playMorse, stopMorse } = useMorsePlayer(dotDuration, soundEnabled);
  const { isSpeaking: isPlayingMnemonic, isSupported: speechSupported, speak: playMnemonic, cancel: stopMnemonic } = useSpeechSynthesis(soundEnabled);

  const handlePlayMorse = (morse: string, char: string) => {
    stopMnemonic(); 
    setActiveChar(char);
    playMorse(morse, () => setActiveChar(null));
  };

  const handlePlayMnemonic = (mnemonic: string, char: string) => {
    if (!speechSupported) {
      onShowSnackbar("Speech synthesis is not supported on your browser.", "error");
      return;
    }
    stopMorse(); 
    setActiveChar(char);
    playMnemonic(mnemonic);
  };

  React.useEffect(() => {
    if (!isPlayingMorse && !isPlayingMnemonic) {
      setActiveChar(null);
    }
  }, [isPlayingMorse, isPlayingMnemonic]);


  const letters = MORSE_CODE_MAP.filter(item => item.category === 'letters');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-4">Learn the Rhythm (Letters)</h2>
      {!soundEnabled && (
         <p 
           className="text-center text-sm p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
           Sound is currently disabled. Enable it in settings to hear Morse code and mnemonics.
         </p>
      )}
      {!speechSupported && soundEnabled && (
         <p 
           className="text-center text-sm p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          >
           Speech synthesis for mnemonics is not supported or available on your browser. Morse code playback will still work.
         </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {letters.map((item) => (
          <RhythmItem
            key={item.char}
            item={item}
            onPlayMorse={(morse) => handlePlayMorse(morse, item.char)}
            onPlayMnemonic={(mnemonic) => handlePlayMnemonic(mnemonic, item.char)}
            isPlayingMorse={isPlayingMorse && activeChar === item.char}
            isPlayingMnemonic={isPlayingMnemonic && activeChar === item.char}
            isActive={activeChar === item.char}
            disabled={ (isPlayingMorse || isPlayingMnemonic) && activeChar !== item.char }
          />
        ))}
      </div>
    </div>
  );
};

export default RhythmMethodDisplay;