
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueLabel?: string | ((value: number) => string);
}

const Slider: React.FC<SliderProps> = ({ label, id, value, min, max, step, onChange, className, valueLabel, ...props }) => {
  const displayValue = typeof valueLabel === 'function' ? valueLabel(Number(value)) : valueLabel ?? value;
  
  return (
    <div className={`flex flex-col ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant-dark)] mb-1">
          {label} {displayValue && <span className="text-[var(--md-sys-color-primary-dark)]">({displayValue})</span>}
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
        {...props}
      />
    </div>
  );
};

export default Slider;
