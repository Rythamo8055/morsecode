
import React, { useEffect } from 'react';
import { SnackbarMessage } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CancelIcon from './icons/CancelIcon';
import CloseIcon from './icons/CloseIcon';

interface SnackbarProps {
  message: SnackbarMessage | null;
  onDismiss: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  const getIcon = () => {
    switch (message.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-[var(--md-sys-color-inverse-on-surface-dark)]" />;
      case 'error':
        return <CancelIcon className="w-5 h-5 text-[var(--md-sys-color-inverse-on-surface-dark)]" />;
      default:
        return null;
    }
  };

  const bgColor = {
    success: 'bg-[var(--md-sys-color-inverse-surface-dark)]', // M3 uses inverse surface for snackbars
    error: 'bg-[var(--md-sys-color-error-container-dark)]', // Could use error container for more emphasis
    info: 'bg-[var(--md-sys-color-inverse-surface-dark)]',
  }[message.type];

  const textColor = {
    success: 'text-[var(--md-sys-color-inverse-on-surface-dark)]',
    error: 'text-[var(--md-sys-color-on-error-container-dark)]',
    info: 'text-[var(--md-sys-color-inverse-on-surface-dark)]',
  }[message.type];


  return (
    <div
      role="alert"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2
                  min-w-[320px] max-w-md p-4 rounded-[var(--md-sys-shape-corner-xs)] shadow-xl
                  flex items-center justify-between
                  ${bgColor} ${textColor}
                  transition-all duration-300 ease-in-out transform
                  ${message ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  z-50`}
    >
      <div className="flex items-center">
        {getIcon() && <span className="mr-3">{getIcon()}</span>}
        <p className="text-sm">{message.message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss message"
        className={`ml-4 p-1 rounded-[var(--md-sys-shape-corner-full)] hover:bg-white/10 transition-colors`}
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Snackbar;
