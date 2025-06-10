import React from 'react';
import IconButton from './IconButton';
import SettingsIcon from './icons/SettingsIcon';

interface HeaderProps {
  title: string;
  showSettingsButton?: boolean;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showSettingsButton, onSettingsClick }) => {
  return (
    <header 
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]"
      style={{ 
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.15), 0px 1px 1px 0px rgba(0,0,0,0.10), 0px 1px 0px -1px rgba(0,0,0,0.08)', // Softer shadow for blurred bg
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)' // For Safari
      }} 
    >
      <h1 className="text-xl font-medium tracking-tight text-[var(--md-sys-color-on-surface)]">{title}</h1> {/* M3 Title Large type style */}
      {showSettingsButton && onSettingsClick && (
        <IconButton variant="standard" onClick={onSettingsClick} aria-label="Open settings">
          <SettingsIcon />
        </IconButton>
      )}
    </header>
  );
};

export default Header;