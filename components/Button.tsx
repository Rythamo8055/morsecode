
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
    px-6 h-10 min-w-[64px]
    rounded-[var(--md-sys-shape-corner-full)]
    text-sm font-medium tracking-wide
    transition-all duration-150 ease-in-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-[var(--md-sys-color-surface-dark)]
  `;

  const variantStyles = {
    filled: `
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

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {leadingIcon && <span className="mr-2 -ml-1 h-5 w-5">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="ml-2 -mr-1 h-5 w-5">{trailingIcon}</span>}
    </button>
  );
};

export default Button;
