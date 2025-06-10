import React from 'react';
import { AppView } from '../types';
import LearnIcon from './icons/LearnIcon';
import QuizIcon from './icons/QuizIcon';
import ReferenceIcon from './icons/ReferenceIcon';
import ProgressIcon from './icons/ProgressIcon';

interface BottomNavigationBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

interface NavItem {
  view: AppView;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { view: AppView.Learn, label: 'Learn', icon: <LearnIcon /> },
  { view: AppView.Quiz, label: 'Quiz', icon: <QuizIcon /> },
  { view: AppView.Reference, label: 'Reference', icon: <ReferenceIcon /> },
  { view: AppView.Progress, label: 'Progress', icon: <ProgressIcon /> },
];

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav 
        className="fixed bottom-4 left-4 right-4 z-30 flex justify-around h-20 bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] rounded-[var(--md-sys-shape-corner-xl)] shadow-lg"
        style={{ 
          backdropFilter: 'blur(16px)', // Increased from 12px to 16px
          WebkitBackdropFilter: 'blur(16px)' // Increased from 12px to 16px
        }} 
    >
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            aria-current={isActive ? 'page' : undefined}
            className={`
              m3-ripple flex flex-col items-center justify-center flex-grow p-1 pt-3 pb-2 
              transition-colors duration-200
              focus:outline-none focus-visible:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_90%)]
              group rounded-[var(--md-sys-shape-corner-xl)] 
            `}
          >
            <div // Icon container with active indicator (pill)
              className={`
                flex items-center justify-center w-16 h-8 mb-0.5 rounded-[var(--md-sys-shape-corner-full)] transition-colors duration-150
                ${isActive 
                  ? 'bg-[var(--md-sys-color-secondary-container)]' 
                  : 'group-hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_92%)]'}
              `}
            >
              <div className={`w-6 h-6 transition-colors duration-150
                ${isActive 
                  ? 'text-[var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[var(--md-sys-color-on-surface-variant)] group-hover:text-[var(--md-sys-color-on-surface)]'}`
              }>
                {item.icon}
              </div>
            </div>
            <span className={`text-xs font-medium transition-colors duration-150
              ${isActive 
                ? 'text-[var(--md-sys-color-on-secondary-container)]' 
                : 'text-[var(--md-sys-color-on-surface-variant)] group-hover:text-[var(--md-sys-color-on-surface)]'}`
            }>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;