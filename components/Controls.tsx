<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';
import { Settings } from '../types';
import Switch from './Switch';
import Slider from './Slider';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';
import SpeedIcon from './icons/SpeedIcon';
<<<<<<< HEAD
import IconButton from './IconButton';
=======
import Button from './Button';
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import CloseIcon from './icons/CloseIcon';

interface ControlsProps {
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
  onClose: () => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange, onClose }) => {
  return (
<<<<<<< HEAD
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--md-sys-color-scrim)] bg-opacity-[0.4] p-4" // M3 Scrim opacity increased slightly
      onClick={onClose} 
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-lg)] p-6 shadow-xl w-full max-w-md space-y-6 relative" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)' // For Safari
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--md-sys-color-outline-variant)]"> {/* Optional: Divider for header */}
          <h2 id="settings-title" className="text-xl font-semibold text-[var(--md-sys-color-on-surface)]">Settings</h2> {/* M3 Headline Small like */}
           <IconButton variant="standard" onClick={onClose} aria-label="Close settings">
            <CloseIcon className="w-6 h-6"/>
          </IconButton>
        </div>
        
        {/* Settings items can be styled as list items or individual cards */}
        <div 
          className="flex items-center justify-between p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center">
            {settings.soundEnabled ? <SoundOnIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-primary)]" /> : <SoundOffIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-on-surface-variant)]" />}
            <span className="text-base text-[var(--md-sys-color-on-surface)]">Sound</span>
=======
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--md-sys-color-surface-container-high-dark)] rounded-[var(--md-sys-shape-corner-lg)] p-6 shadow-xl w-full max-w-md space-y-6 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-[var(--md-sys-color-on-surface-dark)]">Settings</h2>
           <Button variant="text" onClick={onClose} className="!px-2 !min-w-0">
            <CloseIcon className="w-6 h-6"/>
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-dark)]">
          <div className="flex items-center">
            {settings.soundEnabled ? <SoundOnIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-primary-dark)]" /> : <SoundOffIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-on-surface-variant-dark)]" />}
            <span className="text-base text-[var(--md-sys-color-on-surface-dark)]">Sound</span>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          </div>
          <Switch
            id="sound-toggle"
            checked={settings.soundEnabled}
            onChange={(checked) => onSettingsChange({ soundEnabled: checked })}
          />
        </div>

<<<<<<< HEAD
        <div 
          className="flex items-center justify-between p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
           <div className="flex items-center">
             <SpeedIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-primary)]" />
            <span className="text-base text-[var(--md-sys-color-on-surface)]">Pro Mode (Faster)</span>
=======
        <div className="flex items-center justify-between p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-dark)]">
           <div className="flex items-center">
             <SpeedIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-primary-dark)]" />
            <span className="text-base text-[var(--md-sys-color-on-surface-dark)]">Pro Mode (Faster)</span>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          </div>
          <Switch
            id="pro-mode-toggle"
            checked={settings.isProMode}
            onChange={(checked) => onSettingsChange({ isProMode: checked })}
          />
        </div>
        
<<<<<<< HEAD
        <div 
          className="p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container)]"
          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <Slider
            id="playback-speed-slider"
            label="Playback Speed (Dot Duration)"
            min="20" 
            max="200" 
=======
        <div className="p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-dark)]">
          <Slider
            id="playback-speed-slider"
            label="Playback Speed (Dot Duration)"
            min="20" // 20ms
            max="200" // 200ms
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            step="10"
            value={settings.playbackSpeed}
            onChange={(e) => onSettingsChange({ playbackSpeed: parseInt(e.target.value, 10) })}
            valueLabel={(value) => `${value} ms`}
            disabled={settings.isProMode}
<<<<<<< HEAD
            // className prop of Slider handles disabled styling internally now.
          />
          {settings.isProMode && <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1 px-1">Pro Mode overrides custom speed setting.</p>}
        </div>

        {/* M3 Dialogs often have action buttons at the bottom */}
        {/* <div className="flex justify-end pt-4 space-x-2 border-t border-[var(--md-sys-color-outline-variant)]">
          <Button variant="text" onClick={onClose}>Done</Button>
        </div> */}
=======
            className={settings.isProMode ? 'opacity-50' : ''}
          />
          {settings.isProMode && <p className="text-xs text-[var(--md-sys-color-on-surface-variant-dark)] mt-1">Pro Mode overrides custom speed.</p>}
        </div>

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Controls;
=======
export default Controls;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
