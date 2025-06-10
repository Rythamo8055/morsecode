import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'standard'; 
  selected?: boolean;
  toggle?: boolean; 
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'standard',
  selected = false,
  toggle = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    m3-ripple
    inline-flex items-center justify-center
    w-10 h-10 rounded-[var(--md-sys-shape-corner-full)] /* M3 standard 40dp */
    transition-all duration-150 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-[var(--md-sys-color-surface)]
  `;

  const getVariantStyles = () => {
    let styles = '';
    // Base styles for unselected state or non-toggle buttons
    switch (variant) {
      case 'filled':
        styles = `
          bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]
          hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_8%)]
          active:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_12%)]
        `;
        if (selected) { // M3 Selected Filled Toggle Button
          styles = `bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_8%)]`;
        }
        break;
      case 'tonal':
        styles = `
          bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]
          hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_8%)]
          active:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_12%)]
        `;
        if (selected) { // M3 Selected Tonal Toggle Button
          styles = `bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_8%)]`;
        }
        break;
      case 'outlined':
        styles = `
          border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]
          hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_92%)]
          active:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_88%)]
        `;
        if (selected) { // M3 Selected Outlined Toggle Button
          styles = `bg-[var(--md-sys-color-inverse-surface)] text-[var(--md-sys-color-inverse-on-surface)] border border-[var(--md-sys-color-outline)]
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-inverse-surface),var(--md-sys-color-inverse-on-surface)_8%)]`;
        }
        break;
      default: // standard
        styles = `
          text-[var(--md-sys-color-on-surface-variant)]
          hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_92%)]
          active:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_88%)]
        `;
        if (selected) { // M3 Selected Standard (text) Toggle Button
          styles = `bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] 
                    hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary-container),var(--md-sys-color-on-primary-container)_8%)]`;
          // Alternative if just icon color change is preferred: text-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_92%)]
        }
        break;
    }

    if (disabled) {
      if (variant === 'filled' || variant === 'tonal') {
        return `bg-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_88%)] text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]`;
      } else if (variant === 'outlined') {
        return `border-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_88%)] text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]`;
      }
      return `text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]`;
    }
    
    return styles;
  };
  
  return (
    <button
      className={`${baseStyles} ${getVariantStyles()} ${className}`}
      disabled={disabled}
      aria-pressed={toggle ? selected : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;