<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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
<<<<<<< HEAD
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
=======
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 shadow-md bg-[var(--md-sys-color-surface-container-dark)] text-[var(--md-sys-color-on-surface-dark)]">
      <h1 className="text-xl font-medium tracking-tight">{title}</h1>
      {showSettingsButton && onSettingsClick && (
        <IconButton onClick={onSettingsClick} aria-label="Open settings">
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          <SettingsIcon />
        </IconButton>
      )}
    </header>
  );
};

<<<<<<< HEAD
export default Header;
=======
export default Header;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
