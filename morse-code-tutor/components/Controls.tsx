import React from 'react';
import { INITIAL_DOT_DURATION_MS } from '../constants';

interface ControlsProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isProMode: boolean;
  onToggleProMode: () => void;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
}

// M3 Icons
const SoundOnIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={className}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
);
const SoundOffIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={className}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
);

const Controls: React.FC<ControlsProps> = ({
  isSoundEnabled,
  onToggleSound,
  isProMode,
  onToggleProMode,
  playbackSpeed,
  onPlaybackSpeedChange,
}) => {
  return (
    // M3 Card Styling
    <div className="p-4 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-lg my-4 mx-auto max-w-md">
      {/* M3 Title Small for section header */}
      <h3 className="text-sm font-medium leading-5 text-[var(--md-sys-color-on-surface-variant-dark)] mb-5">Settings</h3>
      <div className="space-y-6">
        {/* Sound Toggle - M3 Icon Button */}
        <div className="flex items-center justify-between h-[48px]"> {/* Min touch target height */}
          <span className="text-base leading-6 font-normal text-[var(--md-sys-color-on-surface-dark)]">Sound</span> {/* M3 Body Large */}
          <button
            onClick={onToggleSound}
            className={`m3-ripple flex items-center justify-center w-10 h-10 rounded-[var(--md-sys-shape-corner-full)] transition-colors
                        hover:bg-[var(--md-sys-color-on-surface-dark)] hover:bg-opacity-[var(--md-sys-state-hover-state-layer-opacity)]
                        active:bg-[var(--md-sys-color-on-surface-dark)] active:bg-opacity-[var(--md-sys-state-pressed-state-layer-opacity)]
                        focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)]
                        ${isSoundEnabled ? 'text-[var(--md-sys-color-primary-dark)]' : 'text-[var(--md-sys-color-on-surface-variant-dark)]'}`}
            aria-pressed={isSoundEnabled}
            aria-label={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
            title={isSoundEnabled ? "Disable Sound" : "Enable Sound"}
          >
            {isSoundEnabled ? <SoundOnIcon className="w-6 h-6" /> : <SoundOffIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Pro Mode Toggle - M3 Switch */}
        <div className="flex items-center justify-between h-[48px]">
          <label htmlFor="proModeToggle" className="text-base leading-6 font-normal text-[var(--md-sys-color-on-surface-dark)] cursor-pointer">
            Pro Mode <span className={`text-xs font-normal ${isProMode ? 'text-[var(--md-sys-color-primary-dark)]' : 'text-[var(--md-sys-color-on-surface-variant-dark)]'}`}>({isProMode ? 'Faster' : 'Normal'})</span>
          </label>
          <button
            id="proModeToggle"
            role="switch"
            aria-checked={isProMode}
            onClick={onToggleProMode}
            className={`m3-ripple relative group inline-flex items-center h-[32px] w-[52px] rounded-[var(--md-sys-shape-corner-full)] transition-colors duration-150 ease-in-out cursor-pointer shrink-0
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--md-sys-color-primary-dark)] 
              ${isProMode ? 'bg-[var(--md-sys-color-primary-dark)]' : 'bg-[var(--md-sys-color-surface-variant-dark)] border-2 border-[var(--md-sys-color-outline-dark)] hover:border-[var(--md-sys-color-on-surface-variant-dark)]'}`}
          >
            <span className="sr-only">Toggle Pro Mode</span>
            <span // Switch handle/thumb
              className={`pointer-events-none inline-block transform rounded-[var(--md-sys-shape-corner-full)] shadow-sm ring-0 transition-all duration-150 ease-in-out
              ${isProMode 
                ? 'w-[24px] h-[24px] translate-x-[22px] bg-[var(--md-sys-color-on-primary-dark)] group-hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-primary-dark)_92%,var(--md-sys-color-primary-dark)_8%)]' // on-primary + primary hover state layer
                : 'w-[16px] h-[16px] translate-x-[4px] bg-[var(--md-sys-color-outline-dark)] group-hover:w-[20px] group-hover:h-[20px] group-hover:bg-[var(--md-sys-color-on-surface-variant-dark)]'
              }`}
            />
          </button>
        </div>
        
        {/* Playback Speed Slider - M3 Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="playbackSpeed" className="text-base leading-6 font-normal text-[var(--md-sys-color-on-surface-dark)]">
              Unit Duration
            </label>
            <span className="text-sm font-medium text-[var(--md-sys-color-primary-dark)]">{playbackSpeed}ms</span>
          </div>
          <input
            type="range"
            id="playbackSpeed"
            min="50" 
            max="300" 
            step="10"
            value={playbackSpeed}
            onChange={(e) => onPlaybackSpeedChange(Number(e.target.value))}
            className="w-full h-10 appearance-none cursor-pointer group focus-visible:outline-none" // Increased height for easier interaction with custom thumb
            title={`Set base unit duration (Default: ${INITIAL_DOT_DURATION_MS}ms)`}
            aria-label="Playback speed unit duration in milliseconds"
            style={{ // For track background
              background: `linear-gradient(to right, 
                var(--md-sys-color-primary-dark) 0%, 
                var(--md-sys-color-primary-dark) ${((playbackSpeed - 50) / (300 - 50)) * 100}%, 
                var(--md-sys-color-surface-variant-dark) ${((playbackSpeed - 50) / (300 - 50)) * 100}%, 
                var(--md-sys-color-surface-variant-dark) 100%)`
            }}
          >
            {/* Custom track and thumb styling will be via ::-webkit-slider-runnable-track and ::-webkit-slider-thumb or ::-moz-range-track and ::-moz-range-thumb in global CSS if needed, or rely on Tailwind's appearance-none and manual styling if that's insufficient for M3 look */}
          </input>
          {/* Fallback styling for slider track using pseudo elements in Tailwind for basic appearance, proper M3 slider is complex */}
           <div className="relative h-1 bg-[var(--md-sys-color-surface-variant-dark)] rounded-[var(--md-sys-shape-corner-full)] -mt-6"> {/* Manual track visual */}
             <div 
                className="absolute h-1 bg-[var(--md-sys-color-primary-dark)] rounded-[var(--md-sys-shape-corner-full)]"
                style={{ width: `${((playbackSpeed - 50) / (300 - 50)) * 100}%` }}
             ></div>
             <div // Thumb visual
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-primary-dark)] shadow group-focus-visible:ring-4 group-focus-visible:ring-[var(--md-sys-color-primary-dark)] group-focus-visible:ring-opacity-30 group-hover:ring-4 group-hover:ring-[var(--md-sys-color-primary-dark)] group-hover:ring-opacity-20"
                style={{ left: `calc(${((playbackSpeed - 50) / (300 - 50)) * 100}% - 10px)` }} // Adjust 10px (half thumb width)
             ></div>
           </div>

           <div className="flex justify-between w-full text-xs text-[var(--md-sys-color-on-surface-variant-dark)] opacity-80 mt-1"> {/* M3 Label Small */}
              <span>Fast (50ms)</span>
              <span>Slow (300ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;