<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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
<<<<<<< HEAD
    px-6 h-10 min-w-[64px] /* M3 standard height 40dp, padding 24dp */
    rounded-[var(--md-sys-shape-corner-full)]
    text-sm font-medium tracking-wide /* M3 Label Large */
    transition-all duration-150 ease-out /* M3 standard duration */
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-offset-[var(--md-sys-color-surface)]
=======
    px-6 h-10 min-w-[64px]
    rounded-[var(--md-sys-shape-corner-full)]
    text-sm font-medium tracking-wide
    transition-all duration-150 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-[var(--md-sys-color-surface-dark)]
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  `;

  const variantStyles = {
    filled: `
<<<<<<< HEAD
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
  
=======
      bg-[var(--md-sys-color-primary-dark)] text-[var(--md-sys-color-on-primary-dark)]
      hover:bg-opacity-90 active:bg-opacity-80
      disabled:bg-[var(--md-sys-color-on-surface-dark)] disabled:bg-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
    `,
    tonal: `
      bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)]
      hover:bg-opacity-90 active:bg-opacity-80
      disabled:bg-[var(--md-sys-color-on-surface-dark)] disabled:bg-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
    `,
    outlined: `
      border border-[var(--md-sys-color-outline-dark)] text-[var(--md-sys-color-primary-dark)]
      hover:bg-[var(--md-sys-color-primary-dark)] hover:bg-opacity-10 active:bg-opacity-20
      disabled:border-[var(--md-sys-color-on-surface-dark)] disabled:border-opacity-10 disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
    `,
    text: `
      text-[var(--md-sys-color-primary-dark)]
      hover:bg-[var(--md-sys-color-primary-dark)] hover:bg-opacity-10 active:bg-opacity-20
      disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-30
    `,
  };

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
<<<<<<< HEAD
      {leadingIcon && <span className={`mr-2 -ml-1 h-5 w-5 ${variant === 'text' ? '-ml-0.5' : ''}`}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={`ml-2 -mr-1 h-5 w-5 ${variant === 'text' ? '-mr-0.5' : ''}`}>{trailingIcon}</span>}
=======
      {leadingIcon && <span className="mr-2 -ml-1 h-5 w-5">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="ml-2 -mr-1 h-5 w-5">{trailingIcon}</span>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
    </button>
  );
};

<<<<<<< HEAD
export default Button;
=======
export default Button;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
