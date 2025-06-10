
import React from 'react';
import { Settings } from '../types';
import Switch from './Switch';
import Slider from './Slider';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';
import SpeedIcon from './icons/SpeedIcon';
import Button from './Button';
import CloseIcon from './icons/CloseIcon';

interface ControlsProps {
  settings: Settings;
  onSettingsChange: (newSettings: Partial<Settings>) => void;
  onClose: () => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, onSettingsChange, onClose }) => {
  return (
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
          </div>
          <Switch
            id="sound-toggle"
            checked={settings.soundEnabled}
            onChange={(checked) => onSettingsChange({ soundEnabled: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-dark)]">
           <div className="flex items-center">
             <SpeedIcon className="w-6 h-6 mr-3 text-[var(--md-sys-color-primary-dark)]" />
            <span className="text-base text-[var(--md-sys-color-on-surface-dark)]">Pro Mode (Faster)</span>
          </div>
          <Switch
            id="pro-mode-toggle"
            checked={settings.isProMode}
            onChange={(checked) => onSettingsChange({ isProMode: checked })}
          />
        </div>
        
        <div className="p-3 rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-surface-container-dark)]">
          <Slider
            id="playback-speed-slider"
            label="Playback Speed (Dot Duration)"
            min="20" // 20ms
            max="200" // 200ms
            step="10"
            value={settings.playbackSpeed}
            onChange={(e) => onSettingsChange({ playbackSpeed: parseInt(e.target.value, 10) })}
            valueLabel={(value) => `${value} ms`}
            disabled={settings.isProMode}
            className={settings.isProMode ? 'opacity-50' : ''}
          />
          {settings.isProMode && <p className="text-xs text-[var(--md-sys-color-on-surface-variant-dark)] mt-1">Pro Mode overrides custom speed.</p>}
        </div>

      </div>
    </div>
  );
};

export default Controls;
