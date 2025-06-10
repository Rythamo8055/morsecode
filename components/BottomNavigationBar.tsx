
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around h-20 shadow-lg bg-[var(--md-sys-color-surface-container-dark)] text-[var(--md-sys-color-on-surface-variant-dark)]">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            aria-current={isActive ? 'page' : undefined}
            className={`
              m3-ripple flex flex-col items-center justify-center flex-grow p-2
              transition-colors duration-200
              rounded-[var(--md-sys-shape-corner-md)] m-1
              ${isActive ? 'bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)]' : 'hover:bg-[var(--md-sys-color-surface-container-high-dark)]'}
            `}
          >
            <div className={`w-8 h-8 mb-0.5 ${isActive ? 'text-[var(--md-sys-color-on-secondary-container-dark)]' : 'text-[var(--md-sys-color-on-surface-variant-dark)]'}`}>
              {item.icon}
            </div>
            <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;
