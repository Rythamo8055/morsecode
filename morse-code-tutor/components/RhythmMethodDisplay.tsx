import React, { useState, useEffect } from 'react';
import { RHYTHM_MNEMONICS_LIST, RhythmItem } from '../constants';
import useMorsePlayer from '../hooks/useMorsePlayer';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';

interface RhythmMethodDisplayProps {
  isProMode: boolean;
  baseUnitDuration: number;
  isSoundGloballyEnabled: boolean;
  showSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
}

// M3 Speaker Icon (example)
const SpeakerWaveIcon = (props: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M3 9v6h4l5 5V4L7 9H3zm7-.17v6.34L7.83 13H5v-2h2.83L10 8.83z"/>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);


const RhythmMethodDisplay: React.FC<RhythmMethodDisplayProps> = ({
  isProMode,
  baseUnitDuration,
  isSoundGloballyEnabled,
  showSnackbar
}) => {
  const { playMorseCode, isPlaying: isMorsePlaying, setBaseUnitDuration: setPlayerBaseUnitDuration } = useMorsePlayer(isSoundGloballyEnabled);
  const { speak, cancel: cancelSpeech, isSpeaking: isSpeechPlaying, isSupported: speechIsSupported, isAvailable: speechIsAvailable } = useSpeechSynthesis();
  const [activeItem, setActiveItem] = useState<RhythmItem | null>(null);

  useEffect(() => {
    setPlayerBaseUnitDuration(baseUnitDuration);
  }, [baseUnitDuration, setPlayerBaseUnitDuration]);

  useEffect(() => {
    if (!speechIsSupported && typeof window !== 'undefined') { // Check window to avoid SSR issues if any
      showSnackbar("Web Speech API not supported. Mnemonics cannot be spoken.", "error");
    } else if (speechIsSupported && !speechIsAvailable && typeof window !== 'undefined') {
       showSnackbar("Speech voices loading or unavailable. Mnemonics might not play.", "info");
    }
  }, [speechIsSupported, speechIsAvailable, showSnackbar]);

  const handleItemClick = (item: RhythmItem) => {
    if (isMorsePlaying || isSpeechPlaying) { // Prevent multiple rapid clicks if already active
      if(activeItem?.char === item.char) return; // Allow re-click to restart same item if needed, though current logic cancels.
      cancelSpeech(); // Cancel any ongoing speech
      // Morse player will stop itself or finish.
    }
    
    setActiveItem(item);

    const fullMnemonic = `${item.char}. ${item.mnemonic}.`;

    if (isSoundGloballyEnabled && speechIsSupported && speechIsAvailable) {
      speak(fullMnemonic, () => { // onEnd callback for speech
        if (!isMorsePlaying) setActiveItem(null); // Clear if Morse also finished
      });
      // Delay Morse to let speech start, or play concurrently.
      // Playing morse slightly after speech begins can feel more natural.
      setTimeout(() => {
        playMorseCode(item.code, isProMode).then(() => { // onEnd callback for Morse
            if(!isSpeechPlaying) setActiveItem(null); // Clear if speech also finished
        });
      }, 150); 
    } else if (isSoundGloballyEnabled) { // Speech not available/supported, but sound is
      playMorseCode(item.code, isProMode).then(() => setActiveItem(null));
      showSnackbar(`Spoken mnemonic unavailable. Playing Morse for ${item.char}: ${item.code}`, "info");
    } else if (speechIsSupported && speechIsAvailable) { // Sound off, but speech available
       speak(fullMnemonic, () => setActiveItem(null));
    } else { // Neither available
      showSnackbar(`Morse for ${item.char}: ${item.code}. Sound and speech are off/unavailable.`, "info");
      setActiveItem(null);
    }
  };
  
  const charSections = [
    { title: 'Letters (A-Z)', chars: RHYTHM_MNEMONICS_LIST.filter(item => item.char.match(/[A-Z]/i)) },
    { title: 'Numbers (0-9)', chars: RHYTHM_MNEMONICS_LIST.filter(item => item.char.match(/[0-9]/)) },
  ];

  return (
    // M3 Card Styling
    <div className="p-4 sm:p-5 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl my-4 mx-auto max-w-3xl">
      {/* M3 Card Header / Info Section */}
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left justify-center mb-6 p-4 bg-[var(--md-sys-color-primary-container-dark)] rounded-[var(--md-sys-shape-corner-md)]">
        <SpeakerWaveIcon className="w-10 h-10 text-[var(--md-sys-color-on-primary-container-dark)] mr-0 mb-2 sm:mr-4 sm:mb-0 shrink-0"/>
        <div>
            {/* M3 Title Medium */}
            <h2 className="text-lg font-medium leading-6 text-[var(--md-sys-color-on-primary-container-dark)]">Rhythm Method Learning</h2>
            {/* M3 Body Medium */}
            <p className="text-sm leading-5 text-[var(--md-sys-color-on-primary-container-dark)] opacity-90 mt-1">
                Click a character to hear its mnemonic and Morse sound. Internalize the rhythm!
            </p>
        </div>
      </div>

      {!speechIsSupported && (
        <div className="mb-4 p-3 text-sm leading-5 bg-[var(--md-sys-color-error-container-dark)] text-[var(--md-sys-color-on-error-container-dark)] rounded-[var(--md-sys-shape-corner-sm)]">
            Speech synthesis is not supported by your browser. You can still see mnemonics and play Morse sounds.
        </div>
      )}
       {speechIsSupported && !speechIsAvailable && (
        <div className="mb-4 p-3 text-sm leading-5 bg-[var(--md-sys-color-tertiary-container-dark)] text-[var(--md-sys-color-on-tertiary-container-dark)] rounded-[var(--md-sys-shape-corner-sm)]">
            Speech synthesis voices may still be loading or are unavailable on your device.
        </div>
      )}

      {charSections.map(section => (
        <div key={section.title} className="mb-6">
          {/* M3 Title Small */}
          <h3 className="text-sm font-medium leading-5 text-[var(--md-sys-color-on-surface-variant-dark)] border-b border-[var(--md-sys-color-outline-variant-dark)] pb-2 mb-4">{section.title}</h3>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {section.chars.map((item) => {
              const isCurrentlyActive = activeItem?.char === item.char && (isMorsePlaying || isSpeechPlaying);
              return (
                // M3 Chip or Filled Tonal Button like styling
                <button
                  key={item.char}
                  onClick={() => handleItemClick(item)}
                  // Disable if another item is active, or if this item is active but both sound/speech finished (activeItem would be null)
                  disabled={(isMorsePlaying || isSpeechPlaying) && !isCurrentlyActive} 
                  className={`m3-ripple flex flex-col items-center justify-center p-2.5 aspect-square rounded-[var(--md-sys-shape-corner-md)] transition-all duration-150 ease-in-out shadow
                            focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)] focus-visible:ring-[var(--md-sys-color-primary-dark)]
                            ${isCurrentlyActive 
                                ? 'bg-[var(--md-sys-color-primary-dark)] text-[var(--md-sys-color-on-primary-dark)] scale-105 shadow-lg ring-2 ring-[var(--md-sys-color-primary-dark)]' 
                                : `bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-dark)] 
                                   hover:bg-[var(--md-sys-color-surface-container-highest-dark)] 
                                   active:bg-[color-mix(in_srgb,var(--md-sys-color-surface-container-highest-dark)_88%,black_12%)]
                                   disabled:bg-[var(--md-sys-color-surface-variant-dark)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none`
                            }`}
                  title={`${item.char}: ${item.mnemonic}`}
                  aria-label={`Learn ${item.char}: ${item.mnemonic}. ${isCurrentlyActive ? "Currently playing." : ""}`}
                  aria-pressed={isCurrentlyActive}
                >
                  {/* M3 Display Small for char */}
                  <span className="text-2xl sm:text-3xl font-medium">{item.char}</span>
                  {/* M3 Label Small for mnemonic first word */}
                  <span className="text-[0.6875rem] leading-4 mt-1 opacity-80 truncate w-full px-0.5">{item.mnemonic.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RhythmMethodDisplay;