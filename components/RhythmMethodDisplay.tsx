
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
    stopMnemonic(); // Stop any ongoing speech
    setActiveChar(char);
    playMorse(morse, () => setActiveChar(null));
  };

  const handlePlayMnemonic = (mnemonic: string, char: string) => {
    if (!speechSupported) {
      onShowSnackbar("Speech synthesis is not supported on your browser.", "error");
      return;
    }
    stopMorse(); // Stop any ongoing morse
    setActiveChar(char);
    playMnemonic(mnemonic);
    // isSpeaking will turn false via its own onend/onerror handlers, then activeChar will be unset.
    // However, speech might finish before morse, so we need to ensure activeChar is handled.
    // We can rely on the user clicking something else or the natural end of speech.
    // For now, let's reset activeChar when speech ends (already handled by useSpeechSynthesis hook)
    // and rely on isPlayingMnemonic to unset activeChar when it becomes false.
    // This part is a bit tricky, let's keep it simple: if speech ends, active char resets.
    // We don't have a direct onEnd callback for speak in this setup.
    // Let's rely on the global isPlayingMnemonic state.
  };

  // Reset activeChar if no audio is playing
  React.useEffect(() => {
    if (!isPlayingMorse && !isPlayingMnemonic) {
      setActiveChar(null);
    }
  }, [isPlayingMorse, isPlayingMnemonic]);


  const letters = MORSE_CODE_MAP.filter(item => item.category === 'letters');
  // Consider adding numbers and punctuation later or via a filter

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-4">Learn the Rhythm (Letters)</h2>
      {!soundEnabled && (
         <p className="text-center text-sm p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-variant-dark)]">
           Sound is currently disabled. Enable it in settings to hear Morse code and mnemonics.
         </p>
      )}
      {!speechSupported && soundEnabled && (
         <p className="text-center text-sm p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-error-container-dark)] text-[var(--md-sys-color-on-error-container-dark)]">
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
            disabled={ (isPlayingMorse || isPlayingMnemonic) && activeChar !== item.char } // Disable other buttons when one is active
          />
        ))}
      </div>
    </div>
  );
};

export default RhythmMethodDisplay;
