<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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
<<<<<<< HEAD
  disabled,
  ...props
}) => {
  const isFilled = props.value || props.defaultValue; // Check if input has content for label positioning

  // M3 Filled Text Field Styles using CSS variables which are now translucent
  const baseContainerColor = 'var(--md-sys-color-surface-container-highest)';

  const borderColor = error 
    ? 'border-[var(--md-sys-color-error)]' 
    : `border-[var(--md-sys-color-on-surface-variant)] group-focus-within:border-[var(--md-sys-color-primary)] ${disabled ? 'border-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]' : 'group-hover:border-[var(--md-sys-color-on-surface)]'}`;
  
  const borderWidth = error || 'group-focus-within:border-b-2' ? 'border-b-2' : 'border-b';

  const labelColor = error 
    ? 'text-[var(--md-sys-color-error)]' 
    : `${disabled ? 'text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]' : 'text-[var(--md-sys-color-on-surface-variant)] group-focus-within:text-[var(--md-sys-color-primary)]'}`;

  const inputTextColor = disabled ? 'text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]' : 'text-[var(--md-sys-color-on-surface)]';
  const iconColor = disabled ? 'text-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)]' : 'text-[var(--md-sys-color-on-surface-variant)]';


  return (
    <div className={`relative flex flex-col ${containerClassName}`}>
      <div 
        className={`
          relative flex items-center
          bg-[${baseContainerColor}]
          rounded-t-[var(--md-sys-shape-corner-sm)] /* Updated to sm for more visible rounding */
          ${borderColor} ${borderWidth}
          transition-colors duration-200
          group
          ${disabled ? 'after:border-dashed after:border-b after:border-[color-mix(in_srgb,var(--md-sys-color-on-surface),transparent_62%)] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:content-[""]' : ''}
        `}
        style={disabled ? { backgroundColor: `color-mix(in srgb, var(--md-sys-color-on-surface), transparent 96%)`} : {}}
      >
        {leadingIcon && <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`}>{leadingIcon}</span>}
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        <input
          id={id}
          type={type}
          className={`
<<<<<<< HEAD
            block w-full pt-[25px] pb-[9px] px-4 
            ${leadingIcon ? 'pl-12' : ''} ${trailingIcon ? 'pr-12' : ''}
            ${inputTextColor} bg-transparent
            text-base appearance-none focus:outline-none peer
            ${className}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          placeholder=" " 
          disabled={disabled}
=======
            block w-full pt-6 pb-2 px-3 
            ${leadingIcon ? 'pl-10' : ''} ${trailingIcon ? 'pr-10' : ''}
            text-[var(--md-sys-color-on-surface-dark)] bg-transparent
            text-base appearance-none focus:outline-none peer
            ${className}
          `}
          placeholder=" " /* Required for label animation */
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          {...props}
        />
        <label
          htmlFor={id}
          className={`
<<<<<<< HEAD
            absolute left-4 
            ${leadingIcon ? 'left-12' : ''}
            ${labelColor} text-base 
            transition-all duration-200 ease-in-out origin-[0]
            transform pointer-events-none
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
            peer-focus:top-[9px] peer-focus:scale-0.75 peer-focus:-translate-y-0  
            peer-[:not(:placeholder-shown)]:top-[9px] peer-[:not(:placeholder-shown)]:scale-0.75 peer-[:not(:placeholder-shown)]:-translate-y-0
=======
            absolute left-3 top-1/2 -translate-y-1/2 
            ${leadingIcon ? 'left-10' : ''}
            text-[var(--md-sys-color-on-surface-variant-dark)] text-base
            transition-all duration-200 ease-in-out origin-[0]
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 peer-focus:-translate-y-3 
            peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3
            ${error ? 'text-[var(--md-sys-color-error-dark)]' : 'group-focus-within:text-[var(--md-sys-color-primary-dark)]'}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          `}
        >
          {label}
        </label>
<<<<<<< HEAD
        {trailingIcon && <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${iconColor} ${error ? 'text-[var(--md-sys-color-error)]' : ''}`}>{trailingIcon}</span>}
      </div>
      {error && !disabled && <p className="mt-1 text-xs text-[var(--md-sys-color-error)] px-4">{error}</p>}
=======
        {trailingIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant-dark)]">{trailingIcon}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-[var(--md-sys-color-error-dark)] px-3">{error}</p>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
    </div>
  );
};

<<<<<<< HEAD
export default TextField;
=======
export default TextField;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
