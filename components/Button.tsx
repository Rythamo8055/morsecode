import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  leadingIcon,
  trailingIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    m3-ripple
    inline-flex items-center justify-center
    px-6 h-10 min-w-[64px] /* M3 standard height 40dp, padding 24dp */
    rounded-[var(--md-sys-shape-corner-full)]
    text-sm font-medium tracking-wide /* M3 Label Large */
    transition-all duration-150 ease-out /* M3 standard duration */
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-[var(--md-sys-color-surface)]
  `;

  const variantStyles = {
    filled: `
      bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]
      hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_8%)] 
      focus:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_12%)]
      active:bg-[color-mix(in_srgb,var(--md-sys-color-primary),var(--md-sys-color-on-primary)_12%)]
      disabled:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_88%)] disabled:text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]
    `,
    tonal: `
      bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]
      hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_8%)]
      focus:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_12%)]
      active:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_12%)]
      disabled:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_88%)] disabled:text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]
    `,
    outlined: `
      border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)]
      hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_92%)] 
      focus:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_88%)]
      active:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_88%)]
      disabled:border-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_88%)] disabled:text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]
    `,
    text: `
      text-[var(--md-sys-color-primary)] px-3 
      hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_92%)]
      focus:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_88%)]
      active:bg-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_88%)]
      disabled:text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]
    `,
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leadingIcon && <span className={`mr-2 -ml-1 h-5 w-5 ${variant === 'text' ? '-ml-0.5' : ''}`}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={`ml-2 -mr-1 h-5 w-5 ${variant === 'text' ? '-mr-0.5' : ''}`}>{trailingIcon}</span>}
    </button>
  );
};

export default Button;