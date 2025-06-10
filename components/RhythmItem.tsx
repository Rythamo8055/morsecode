<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';
import { MorseCodeMap } from '../types';
import IconButton from './IconButton';
import PlayArrowIcon from './icons/PlayArrowIcon';
import VolumeUpIcon from './icons/VolumeUpIcon';

interface RhythmItemProps {
  item: MorseCodeMap;
  onPlayMorse: (morse: string) => void;
  onPlayMnemonic: (mnemonic: string) => void;
  isPlayingMorse: boolean;
  isPlayingMnemonic: boolean;
<<<<<<< HEAD
  isActive: boolean; 
=======
  isActive: boolean; // For highlighting
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  disabled: boolean;
}

const RhythmItem: React.FC<RhythmItemProps> = ({
  item,
  onPlayMorse,
  onPlayMnemonic,
  isPlayingMorse,
  isPlayingMnemonic,
  isActive,
  disabled,
}) => {
  return (
    <div
      className={`
        flex flex-col items-center p-4 
<<<<<<< HEAD
        rounded-[var(--md-sys-shape-corner-lg)] /* M3 Card like corner */
        bg-[var(--md-sys-color-surface-container)] /* M3 Card background */
        border 
        ${isActive ? 'border-[var(--md-sys-color-primary)] shadow-lg' : 'border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-outline)]'}
        transition-all duration-200
      `}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)' // For Safari
      }}
    >
      <div className="text-5xl font-bold text-[var(--md-sys-color-primary)] mb-2">{item.char}</div>
      <div className="text-2xl font-mono text-[var(--md-sys-color-on-surface-variant)] mb-2 tracking-widest">{item.morse}</div>
      <div className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-4">{item.mnemonic}</div>
      <div className="flex space-x-2">
        <IconButton
          variant="tonal" // M3 Tonal for secondary actions on card
=======
        rounded-[var(--md-sys-shape-corner-lg)] 
        bg-[var(--md-sys-color-surface-container-dark)]
        border-2
        ${isActive ? 'border-[var(--md-sys-color-primary-dark)] shadow-lg' : 'border-transparent'}
        transition-all duration-200
      `}
    >
      <div className="text-5xl font-bold text-[var(--md-sys-color-primary-dark)] mb-2">{item.char}</div>
      <div className="text-2xl font-mono text-[var(--md-sys-color-on-surface-variant-dark)] mb-2 tracking-widest">{item.morse}</div>
      <div className="text-sm text-[var(--md-sys-color-on-surface-variant-dark)] mb-4">{item.mnemonic}</div>
      <div className="flex space-x-2">
        <IconButton
          variant="tonal"
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          onClick={() => onPlayMorse(item.morse)}
          disabled={disabled || isPlayingMorse || isPlayingMnemonic}
          aria-label={`Play Morse code for ${item.char}`}
          title={`Play Morse for ${item.char}`}
        >
          <PlayArrowIcon />
        </IconButton>
        <IconButton
          variant="tonal"
          onClick={() => onPlayMnemonic(item.mnemonic)}
          disabled={disabled || isPlayingMorse || isPlayingMnemonic}
          aria-label={`Play mnemonic for ${item.char}`}
          title={`Say "${item.mnemonic}"`}
        >
          <VolumeUpIcon />
        </IconButton>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default RhythmItem;
=======
export default RhythmItem;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
