
import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange, label, disabled }) => {
  const trackColor = checked ? 'bg-[var(--md-sys-color-primary-dark)]' : 'bg-[var(--md-sys-color-surface-variant-dark)]';
  const thumbColor = checked ? 'bg-[var(--md-sys-color-on-primary-dark)]' : 'bg-[var(--md-sys-color-outline-dark)]';
  const thumbTranslate = checked ? 'translate-x-[18px]' : 'translate-x-0.5';

  return (
    <label htmlFor={id} className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="mr-3 text-sm text-[var(--md-sys-color-on-surface-dark)]">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
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
      </button>
    </label>
  );
};

export default Switch;
