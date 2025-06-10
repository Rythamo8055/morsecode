<<<<<<< HEAD
import React, { useEffect } from 'react';
import { SnackbarMessage } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CancelIcon from './icons/CancelIcon'; // Assuming this is an error icon
import CloseIcon from './icons/CloseIcon'; // For dismiss
=======

import React, { useEffect } from 'react';
import { SnackbarMessage } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CancelIcon from './icons/CancelIcon';
import CloseIcon from './icons/CloseIcon';
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde

interface SnackbarProps {
  message: SnackbarMessage | null;
  onDismiss: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
<<<<<<< HEAD
      }, 5000); // M3 suggests 4-10 seconds, 5s is a good middle ground
=======
      }, 3000); // Auto-dismiss after 3 seconds
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

<<<<<<< HEAD
  // Custom Aero Snackbar: Dark translucent background
  // Using HSL values from :root's --aero-base variables for consistency
  const aeroSnackbarBg = 'hsla(var(--aero-base-hue, 220), var(--aero-base-saturation, 10%), calc(var(--aero-base-lightness-surface, 12%) + 10%), 0.8)'; // Slightly lighter glass than other surfaces
  const mainTextColor = 'text-[var(--md-sys-color-on-surface)]'; // Use on-surface for readability on dark glass
  const actionColor = 'text-[var(--md-sys-color-primary)]'; // Primary for action button text

  let icon = null;
  if (message.type === 'success') {
    icon = <CheckCircleIcon className="w-5 h-5" />; 
  } else if (message.type === 'error') {
    icon = <CancelIcon className="w-5 h-5" />; 
  }
=======
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

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde

  return (
    <div
      role="alert"
<<<<<<< HEAD
      aria-live="assertive" 
      aria-atomic="true"
      className={`fixed bottom-5 left-1/2 -translate-x-1/2
                  min-w-[288px] max-w-[500px] py-3.5 px-4 rounded-[var(--md-sys-shape-corner-md)] shadow-xl
                  flex items-center justify-between
                  ${mainTextColor}
                  transition-all duration-300 ease-in-out transform
                  ${message ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                  z-50 border border-[var(--md-sys-color-outline-variant)]`}
      style={{ 
        backgroundColor: aeroSnackbarBg,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
       }}
    >
      <div className="flex items-center">
        {icon && <span className="mr-3 flex-shrink-0">{icon}</span>}
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        <p className="text-sm">{message.message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss message"
<<<<<<< HEAD
        className={`ml-4 p-2 rounded-[var(--md-sys-shape-corner-full)] uppercase text-sm font-medium
                    ${actionColor} 
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_90%)]
                    focus:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_85%)]
                    focus:outline-none
                    transition-colors`}
      >
        Dismiss
=======
        className={`ml-4 p-1 rounded-[var(--md-sys-shape-corner-full)] hover:bg-white/10 transition-colors`}
      >
        <CloseIcon className="w-5 h-5" />
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      </button>
    </div>
  );
};

<<<<<<< HEAD
export default Snackbar;
=======
export default Snackbar;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
