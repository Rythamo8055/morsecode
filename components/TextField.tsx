
import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  leadingIcon,
  trailingIcon,
  error,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`relative flex flex-col ${containerClassName}`}>
      <div className={`
        relative flex items-center
        bg-[var(--md-sys-color-surface-container-high-dark)] 
        rounded-t-[var(--md-sys-shape-corner-xs)]
        border-b-2 ${error ? 'border-[var(--md-sys-color-error-dark)]' : 'border-[var(--md-sys-color-on-surface-variant-dark)] focus-within:border-[var(--md-sys-color-primary-dark)]'}
        transition-colors duration-200
        group
      `}>
        {leadingIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant-dark)]">{leadingIcon}</span>}
        <input
          id={id}
          type={type}
          className={`
            block w-full pt-6 pb-2 px-3 
            ${leadingIcon ? 'pl-10' : ''} ${trailingIcon ? 'pr-10' : ''}
            text-[var(--md-sys-color-on-surface-dark)] bg-transparent
            text-base appearance-none focus:outline-none peer
            ${className}
          `}
          placeholder=" " /* Required for label animation */
          {...props}
        />
        <label
          htmlFor={id}
          className={`
            absolute left-3 top-1/2 -translate-y-1/2 
            ${leadingIcon ? 'left-10' : ''}
            text-[var(--md-sys-color-on-surface-variant-dark)] text-base
            transition-all duration-200 ease-in-out origin-[0]
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 peer-focus:-translate-y-3 
            peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3
            ${error ? 'text-[var(--md-sys-color-error-dark)]' : 'group-focus-within:text-[var(--md-sys-color-primary-dark)]'}
          `}
        >
          {label}
        </label>
        {trailingIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant-dark)]">{trailingIcon}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-[var(--md-sys-color-error-dark)] px-3">{error}</p>}
    </div>
  );
};

export default TextField;
