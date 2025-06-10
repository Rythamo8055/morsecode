import React, { useEffect } from 'react';
import { SnackbarMessage } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CancelIcon from './icons/CancelIcon'; // Assuming this is an error icon
import CloseIcon from './icons/CloseIcon'; // For dismiss

interface SnackbarProps {
  message: SnackbarMessage | null;
  onDismiss: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000); // M3 suggests 4-10 seconds, 5s is a good middle ground
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

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

  return (
    <div
      role="alert"
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
        <p className="text-sm">{message.message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss message"
        className={`ml-4 p-2 rounded-[var(--md-sys-shape-corner-full)] uppercase text-sm font-medium
                    ${actionColor} 
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_90%)]
                    focus:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_85%)]
                    focus:outline-none
                    transition-colors`}
      >
        Dismiss
      </button>
    </div>
  );
};

export default Snackbar;