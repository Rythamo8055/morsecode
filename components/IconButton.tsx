
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'standard'; // standard is like text button
  selected?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'standard',
  selected = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    m3-ripple
    inline-flex items-center justify-center
    w-10 h-10 rounded-[var(--md-sys-shape-corner-full)]
    transition-all duration-150 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-[var(--md-sys-color-surface-dark)]
  `;

  const getVariantStyles = () => {
    if (selected) {
      switch (variant) {
        case 'filled':
          return `bg-[var(--md-sys-color-primary-dark)] text-[var(--md-sys-color-on-primary-dark)]`;
        case 'tonal':
          return `bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)]`;
        case 'outlined':
          return `bg-[var(--md-sys-color-inverse-surface-dark)] text-[var(--md-sys-color-inverse-on-surface-dark)] border border-[var(--md-sys-color-outline-dark)]`;
        default: // standard
          return `bg-[var(--md-sys-color-primary-dark)] bg-opacity-20 text-[var(--md-sys-color-primary-dark)]`;
      }
    }
    // Not selected
    switch (variant) {
      case 'filled':
        return `
          bg-[var(--md-sys-color-primary-container-dark)] text-[var(--md-sys-color-on-primary-container-dark)]
          hover:bg-opacity-90 active:bg-opacity-80
          disabled:bg-[var(--md-sys-color-on-surface-dark)] disabled:bg-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
        `;
      case 'tonal':
        return `
          bg-[var(--md-sys-color-surface-container-highest-dark)] text-[var(--md-sys-color-primary-dark)]
          hover:bg-opacity-90 active:bg-opacity-80
          disabled:bg-[var(--md-sys-color-on-surface-dark)] disabled:bg-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
        `;
      case 'outlined':
        return `
          border border-[var(--md-sys-color-outline-dark)] text-[var(--md-sys-color-on-surface-variant-dark)]
          hover:bg-[var(--md-sys-color-on-surface-variant-dark)] hover:bg-opacity-10 active:bg-opacity-20
          disabled:border-[var(--md-sys-color-on-surface-dark)] disabled:border-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
        `;
      default: // standard
        return `
          text-[var(--md-sys-color-on-surface-variant-dark)]
          hover:bg-[var(--md-sys-color-on-surface-variant-dark)] hover:bg-opacity-10 active:bg-opacity-20
          disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
        `;
    }
  };
  
  return (
    <button
      className={`${baseStyles} ${getVariantStyles()} ${className}`}
      disabled={disabled}
      aria-pressed={selected}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
