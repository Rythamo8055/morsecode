import React from 'react';
import { AppView } from '../types';

interface BottomNavigationBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

// M3 Style Icons (using existing simplified versions)
const LearnIconOutline = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 3L1 9l4 2.18v6.32L12 21l7-3.5V11.18L23 9l-3-1.54V3.14L12 3zm6.82 6L12 11.76 5.18 9 12 6.24 18.82 9zM17 17.18L12 19.5l-5-2.32v-4.53L12 15l5-2.35v4.53z"/></svg>
);
const LearnIconFilled = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm6.85 6.09L12 12.72 5.15 9.09 12 5.48l6.85 3.61zM12 13.47l-7-3.82v6.85l7 3.83 7-3.83v-6.85l-7 3.82z"/></svg>
);
const QuizIconOutline = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
);
const QuizIconFilled = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-14h-2c0 1.1.9 2 2 2s2-.9 2-2c0-2-3-1.75-3-5h2c0 2.25 3 2.5 3 5 0 2.21-1.79 4-4 4zm-1 8h2v-2h-2v2z"/></svg>
);
const ReferenceIconOutline = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm0 15v-2h12v2H6z"/></svg>
);
const ReferenceIconFilled = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0z" fill="none"/><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
);
const ProgressIconOutline = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
);
const ProgressIconFilled = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0z" fill="none"/><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
);

interface NavItemProps {
  label: string;
  iconOutline: JSX.Element;
  iconFilled: JSX.Element;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, iconOutline, iconFilled, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`m3-ripple flex flex-col items-center justify-center flex-1 h-full pt-3 pb-4 px-1 group 
                focus-visible:bg-[var(--md-sys-color-on-surface-dark)] 
                focus-visible:bg-opacity-[var(--md-sys-state-focus-state-layer-opacity)] 
                focus-visible:rounded-[var(--md-sys-shape-corner-full)]`} // Focus visible on the whole item for better UX
    aria-current={isActive ? 'page' : undefined}
    aria-label={label}
  >
    <div 
      className={`flex items-center justify-center w-16 h-8 rounded-[var(--md-sys-shape-corner-full)] mb-1 transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-[var(--md-sys-color-secondary-container-dark)]' 
                    : 'group-hover:bg-[var(--md-sys-color-on-surface-dark)] group-hover:bg-opacity-[var(--md-sys-state-hover-state-layer-opacity)]'
                  }`
      }
    >
      {React.cloneElement(isActive ? iconFilled : iconOutline, { 
        className: `w-6 h-6 transition-colors duration-150 ease-in-out 
                    ${isActive 
                      ? 'text-[var(--md-sys-color-on-secondary-container-dark)]' 
                      : 'text-[var(--md-sys-color-on-surface-variant-dark)] group-hover:text-[var(--md-sys-color-on-surface-dark)]'}` 
      })}
    </div>
    {/* M3 Label Medium: Roboto Medium, 12sp, line height 16sp */}
    <span 
      className={`text-[0.75rem] leading-4 font-medium tracking-[0.03125em] transition-colors duration-150 ease-in-out 
                  ${isActive 
                    ? 'text-[var(--md-sys-color-on-surface-dark)]' 
                    : 'text-[var(--md-sys-color-on-surface-variant-dark)] group-hover:text-[var(--md-sys-color-on-surface-dark)]'}`
      }
    >
      {label}
    </span>
  </button>
);


const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.Learn, label: 'Learn', iconOutline: <LearnIconOutline />, iconFilled: <LearnIconFilled /> },
    { view: AppView.Quiz, label: 'Quiz', iconOutline: <QuizIconOutline />, iconFilled: <QuizIconFilled /> },
    { view: AppView.Reference, label: 'Reference', iconOutline: <ReferenceIconOutline />, iconFilled: <ReferenceIconFilled /> },
    { view: AppView.Progress, label: 'Progress', iconOutline: <ProgressIconOutline />, iconFilled: <ProgressIconFilled /> },
  ];

  return (
    // M3 Navigation Bar: Height 80dp.
    <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-[var(--md-sys-color-surface-container-dark)] flex justify-around items-stretch z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.1),0_-1px_2px_rgba(0,0,0,0.06)] print:hidden">
      {navItems.map(item => (
        <NavItem
          key={item.view}
          label={item.label}
          iconOutline={item.iconOutline}
          iconFilled={item.iconFilled}
          isActive={currentView === item.view}
          onClick={() => onNavigate(item.view)}
        />
      ))}
    </nav>
  );
};

export default BottomNavigationBar;