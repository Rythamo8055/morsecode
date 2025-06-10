
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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 shadow-md bg-[var(--md-sys-color-surface-container-dark)] text-[var(--md-sys-color-on-surface-dark)]">
      <h1 className="text-xl font-medium tracking-tight">{title}</h1>
      {showSettingsButton && onSettingsClick && (
        <IconButton onClick={onSettingsClick} aria-label="Open settings">
          <SettingsIcon />
        </IconButton>
      )}
    </header>
  );
};

export default Header;
