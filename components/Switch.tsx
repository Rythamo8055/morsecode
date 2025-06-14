<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange, label, disabled }) => {
<<<<<<< HEAD
  // M3 Colors & Sizing
  // Track: 52w x 32h. Thumb selected: 24diam, unselected: 16diam. Icon: 16x16
  const trackStyles = `
    relative inline-flex items-center h-[32px] w-[52px] rounded-[var(--md-sys-shape-corner-full)] transition-colors duration-200 ease-in-out
    border-2 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-[var(--md-sys-color-surface)]
  `;

  const trackColor = checked 
    ? 'bg-[var(--md-sys-color-primary)] border-[var(--md-sys-color-primary)]' 
    : 'bg-[var(--md-sys-color-surface-container-highest)] border-[var(--md-sys-color-outline)]';
  
  const thumbBaseStyles = `
    absolute inline-flex items-center justify-center rounded-[var(--md-sys-shape-corner-full)] shadow
    transition-all duration-200 ease-in-out
    top-1/2 -translate-y-1/2
  `;

  const thumbStyles = checked
    ? `w-6 h-6 bg-[var(--md-sys-color-on-primary)] left-[22px]` // 24px thumb, pos for 52px track
    : `w-4 h-4 bg-[var(--md-sys-color-outline)] left-[4px] group-hover:bg-[var(--md-sys-color-on-surface-variant)]`; // 16px thumb

  const iconColor = checked ? 'text-[var(--md-sys-color-primary)]' : 'text-transparent';

  return (
    <label htmlFor={id} className={`flex items-center cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="mr-3 text-sm text-[var(--md-sys-color-on-surface)]">{label}</span>}
=======
  const trackColor = checked ? 'bg-[var(--md-sys-color-primary-dark)]' : 'bg-[var(--md-sys-color-surface-variant-dark)]';
  const thumbColor = checked ? 'bg-[var(--md-sys-color-on-primary-dark)]' : 'bg-[var(--md-sys-color-outline-dark)]';
  const thumbTranslate = checked ? 'translate-x-[18px]' : 'translate-x-0.5';

  return (
    <label htmlFor={id} className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="mr-3 text-sm text-[var(--md-sys-color-on-surface-dark)]">{label}</span>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
<<<<<<< HEAD
        className={`${trackStyles} ${trackColor}`}
      >
        {/* State layer for hover/focus on thumb (visual representation) */}
        <span 
          className={`
            absolute w-10 h-10 rounded-[var(--md-sys-shape-corner-full)]
            ${checked ? 'left-[18px]' : 'left-[-2px]'} top-1/2 -translate-y-1/2
            transition-opacity duration-100 opacity-0 
            group-hover:opacity-10 group-hover:bg-[var(--md-sys-color-primary)]
            group-focus:opacity-10 group-focus:bg-[var(--md-sys-color-primary)]
            ${checked ? '' : 'group-hover:bg-[var(--md-sys-color-on-surface-variant)] group-focus:bg-[var(--md-sys-color-on-surface-variant)]'}
          `}
        />
        <span // Thumb
          className={`${thumbBaseStyles} ${thumbStyles}`}
        >
          {checked && (
          <svg className={`w-4 h-4 ${iconColor} transition-opacity duration-100`} viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
          )}
        </span>
=======
        className={`
          relative inline-flex items-center h-[32px] w-[52px] rounded-[var(--md-sys-shape-corner-full)] transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-[var(--md-sys-color-surface-dark)]
          ${trackColor}
        `}
      >
        <span
          className={`
            absolute inline-block w-6 h-6 rounded-[var(--md-sys-shape-corner-full)] shadow transform transition-transform duration-200 ease-in-out
            ${thumbColor} ${thumbTranslate}
            ${checked ? 'left-0.5' : 'left-0.5'}
          `}
        />
         {/* Icon inside thumb (optional for M3) */}
         {checked && (
          <svg className={`absolute w-4 h-4 text-[var(--md-sys-color-primary-dark)] left-[26px] top-1/2 -translate-y-1/2 transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        )}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      </button>
    </label>
  );
};

<<<<<<< HEAD
export default Switch;
=======
export default Switch;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
