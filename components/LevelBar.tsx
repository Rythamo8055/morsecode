
import React from 'react';

interface LevelBarProps {
  currentXP: number;
  xpForNextLevel: number;
  level: number;
  className?: string;
}

const LevelBar: React.FC<LevelBarProps> = ({ currentXP, xpForNextLevel, level, className }) => {
  const progressPercent = xpForNextLevel > 0 ? Math.min((currentXP / xpForNextLevel) * 100, 100) : 0;

  return (
    <div className={`my-2 ${className || ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-[var(--md-sys-color-primary)]">Level {level}</span>
        <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
          {currentXP} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="w-full bg-[var(--md-sys-color-surface-container-highest)] rounded-[var(--md-sys-shape-corner-full)] h-3 overflow-hidden">
        <div
          className="h-full bg-[var(--md-sys-color-primary)] transition-all duration-500 ease-out rounded-[var(--md-sys-shape-corner-full)]"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          title={`${progressPercent.toFixed(0)}% to next level`}
        ></div>
      </div>
    </div>
  );
};

export default LevelBar;
