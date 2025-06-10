
import React from 'react';

interface ChipProps {
  label: string;
  color?: string; // Tailwind bg color class e.g., 'bg-green-500' or CSS var
  textColor?: string; // Tailwind text color class or CSS var
  leadingIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string; // For tooltips
}

const Chip: React.FC<ChipProps> = ({ label, color, textColor, leadingIcon, className, onClick, title }) => {
  const baseStyles = `
    inline-flex items-center justify-center
    h-8 px-3 py-0.5 
    rounded-[var(--md-sys-shape-corner-sm)]
    text-sm font-medium
    transition-all duration-150 ease-in-out
  `;

  const defaultBgColor = 'bg-[var(--md-sys-color-surface-container-high-dark)]';
  const defaultTextColor = 'text-[var(--md-sys-color-on-surface-variant-dark)]';

  const interactiveStyles = onClick ? 'cursor-pointer hover:opacity-80 active:opacity-70 m3-ripple' : '';

  return (
    <div
      className={`${baseStyles} ${color || defaultBgColor} ${textColor || defaultTextColor} ${interactiveStyles} ${className || ''}`}
      onClick={onClick}
      title={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {leadingIcon && <span className="mr-1.5 -ml-0.5 h-4 w-4">{leadingIcon}</span>}
      {label}
    </div>
  );
};

export default Chip;
