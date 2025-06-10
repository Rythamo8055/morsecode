<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';

interface ChipProps {
  label: string;
<<<<<<< HEAD
  color?: string; 
  textColor?: string; 
  leadingIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string; 
  selected?: boolean; // For M3 filter/input chips
}

const Chip: React.FC<ChipProps> = ({ 
    label, 
    color, 
    textColor, 
    leadingIcon, 
    className, 
    onClick, 
    title,
    selected 
}) => {
  // M3 Chip styling (Assist Chip by default, or Input Chip if onClick/selected)
  // Height: 32dp (h-8)
  // Padding: 12dp horizontal (px-3) or 8dp if icon only
  // Corner: 8dp (rounded-lg or var(--md-sys-shape-corner-sm))

  let baseBgColor = 'bg-[var(--md-sys-color-surface-container-low)]'; // M3 Assist Chip without border
  let baseTextColor = 'text-[var(--md-sys-color-on-surface-variant)]';
  let hoverBgColor = 'hover:bg-[color-mix(in_srgb,var(--md-sys-color-surface-container-low),var(--md-sys-color-on-surface-variant)_8%)]';
  
  if (onClick || selected !== undefined) { // Behaving like an Input/Filter chip
    if (selected) {
      baseBgColor = 'bg-[var(--md-sys-color-secondary-container)]';
      baseTextColor = 'text-[var(--md-sys-color-on-secondary-container)]';
      hoverBgColor = 'hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container),var(--md-sys-color-on-secondary-container)_8%)]';
    } else { // Unselected Input/Filter chip often has an outline
      baseBgColor = 'bg-transparent border border-[var(--md-sys-color-outline)]';
      baseTextColor = 'text-[var(--md-sys-color-on-surface-variant)]';
      hoverBgColor = 'hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface-variant),transparent_92%)]';
    }
  }

  const finalBgColor = color || baseBgColor;
  const finalTextColor = textColor || baseTextColor;

  const baseStyles = `
    inline-flex items-center justify-center
    h-8 px-4 py-1.5 /* M3 standard for chips with label */
    rounded-[var(--md-sys-shape-corner-sm)]
    text-sm font-medium /* M3 Label Large */
    transition-all duration-150 ease-in-out
  `;
  
  const interactiveStyles = onClick ? `cursor-pointer ${hoverBgColor} active:opacity-80 m3-ripple` : '';

  return (
    <div
      className={`${baseStyles} ${finalBgColor} ${finalTextColor} ${interactiveStyles} ${className || ''}`}
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      onClick={onClick}
      title={title}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
<<<<<<< HEAD
      aria-pressed={onClick && selected !== undefined ? selected : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {leadingIcon && <span className={`mr-2 -ml-1 h-4.5 w-4.5`}>{leadingIcon}</span>} {/* M3 icon size 18dp */}
=======
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {leadingIcon && <span className="mr-1.5 -ml-0.5 h-4 w-4">{leadingIcon}</span>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
      {label}
    </div>
  );
};

<<<<<<< HEAD
export default Chip;
=======
export default Chip;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
