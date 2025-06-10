import React from 'react';
import { AppView } from '../types';

// M3 Microphone Icon (example from before, kept for consistency)
const AppIcon = (props: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}>
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1.2-9.1c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2V9c0 .66-.54 1.2-1.2 1.2s-1.2-.54-1.2-1.2V4.9zm6.5 6.2c0 3.03-2.47 5.5-5.5 5.5S6.3 14.13 6.3 11.1H4.8c0 3.52 2.91 6.43 6.45 6.88V22h1.5v-4.02c3.54-.45 6.45-3.36 6.45-6.88h-1.5z"/>
    </svg>
);


const Header: React.FC<{ currentView: AppView }> = ({ currentView }) => {
  const appTitle = "Morse Mentor"; 
  let pageTitle = "";

  switch(currentView) {
    case AppView.Learn: pageTitle = "Learn Rhythm"; break;
    case AppView.Quiz: pageTitle = "Quiz"; break;
    case AppView.Reference: pageTitle = "Reference"; break;
    case AppView.Progress: pageTitle = "Progress"; break;
  }

  return (
    // M3 Small Top App Bar: Height 64dp.
    <header className="bg-[var(--md-sys-color-surface-container-highest-dark)] shadow-md sticky top-0 z-40 h-[64px] flex items-center print:hidden">
      <div className="container mx-auto flex items-center justify-start px-4"> {/* M3 spec: 4dp padding from edge for icon, 16dp for title */}
        <AppIcon className="w-6 h-6 text-[var(--md-sys-color-primary-dark)] mr-4" /> {/* mr-4 (16dp) standard spacing */}
        {/* M3 Title Large: Roboto Medium, 22sp, line height 28sp */}
        <h1 className="text-[1.375rem] leading-[1.75rem] font-medium text-[var(--md-sys-color-on-surface-dark)] truncate">
          {appTitle}
          {pageTitle && <span className="text-[var(--md-sys-color-on-surface-variant-dark)] font-normal"> / {pageTitle}</span>}
        </h1>
      </div>
    </header>
  );
};

export default Header;