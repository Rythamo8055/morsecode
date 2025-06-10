<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueLabel?: string | ((value: number) => string);
}

const Slider: React.FC<SliderProps> = ({ label, id, value, min, max, step, onChange, className, valueLabel, ...props }) => {
  const displayValue = typeof valueLabel === 'function' ? valueLabel(Number(value)) : valueLabel ?? value;
  
<<<<<<< HEAD
  // M3 Slider styling
  // Note: Styling the active part of the track (left of thumb) purely with CSS on a native input[type="range"]
  // is tricky and often requires JS or complex pseudo-elements that might not be fully cross-browser.
  // This styling focuses on thumb and overall track appearance according to M3.
  return (
    <div className={`flex flex-col ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
          {label} {displayValue && <span className="text-[var(--md-sys-color-primary)]">({displayValue})</span>}
=======
  return (
    <div className={`flex flex-col ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant-dark)] mb-1">
          {label} {displayValue && <span className="text-[var(--md-sys-color-primary-dark)]">({displayValue})</span>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        </label>
      )}
      <input
        type="range"
        id={id}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        className={`
<<<<<<< HEAD
          w-full h-1 bg-[var(--md-sys-color-surface-container-highest)] rounded-[var(--md-sys-shape-corner-full)] appearance-none cursor-pointer group
          focus:outline-none 
          disabled:opacity-50 disabled:cursor-not-allowed
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 /* 20dp thumb */
          [&::-webkit-slider-thumb]:bg-[var(--md-sys-color-primary)]
          [&::-webkit-slider-thumb]:rounded-[var(--md-sys-shape-corner-full)]
          [&::-webkit-slider-thumb]:transition-all
          /* M3 State Layer for thumb: a halo/ring */
          group-hover:[&::-webkit-slider-thumb]:ring-4 group-hover:[&::-webkit-slider-thumb]:ring-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_80%)]
          group-focus:[&::-webkit-slider-thumb]:ring-4 group-focus:[&::-webkit-slider-thumb]:ring-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_80%)]
          
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:bg-[var(--md-sys-color-primary)]
          [&::-moz-range-thumb]:rounded-[var(--md-sys-shape-corner-full)]
          [&::-moz-range-thumb]:border-none
          group-hover:[&::-moz-range-thumb]:ring-4 group-hover:[&::-moz-range-thumb]:ring-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_80%)]
          group-focus:[&::-moz-range-thumb]:ring-4 group-focus:[&::-moz-range-thumb]:ring-[color-mix(in_srgb,var(--md-sys-color-primary),transparent_80%)]
          
          /* Active track color (left of thumb) - experimental with linear gradient, might not be perfect */
          /* This part is very browser-dependent for native sliders */
        `}
        style={{
          // A common trick for active track color, but support varies.
          // background: `linear-gradient(to right, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary) ${((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100}%, var(--md-sys-color-surface-container-highest) ${((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100}%, var(--md-sys-color-surface-container-highest) 100%)`
        }}
=======
          w-full h-2 bg-[var(--md-sys-color-surface-variant-dark)] rounded-[var(--md-sys-shape-corner-full)] appearance-none cursor-pointer
          focus:outline-none 
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:bg-[var(--md-sys-color-primary-dark)]
          [&::-webkit-slider-thumb]:rounded-[var(--md-sys-shape-corner-full)]
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:ring-4 [&::-webkit-slider-thumb]:hover:ring-[var(--md-sys-color-primary-dark)] [&::-webkit-slider-thumb]:hover:ring-opacity-20
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:bg-[var(--md-sys-color-primary-dark)]
          [&::-moz-range-thumb]:rounded-[var(--md-sys-shape-corner-full)]
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:hover:ring-4 [&::-moz-range-thumb]:hover:ring-[var(--md-sys-color-primary-dark)] [&::-moz-range-thumb]:hover:ring-opacity-20
        `}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
        {...props}
      />
    </div>
  );
};

<<<<<<< HEAD
export default Slider;
=======
export default Slider;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
