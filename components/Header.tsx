
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
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] shadow-md" // Updated shadow
      style={{ 
        // Using Tailwind's shadow-md: box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
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
