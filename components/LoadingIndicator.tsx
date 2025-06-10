<<<<<<< HEAD
=======

>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
import React from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4" role="status" aria-live="polite">
      <div
        className={`
          animate-spin rounded-full 
<<<<<<< HEAD
          border-[var(--md-sys-color-primary)] border-t-[var(--md-sys-color-surface-container-highest)] /* Use a surface tone for the transparent part for better contrast */
          ${sizeClasses[size]}
        `}
      />
      {text && <p className="mt-3 text-sm text-[var(--md-sys-color-on-surface-variant)]">{text}</p>}
=======
          border-[var(--md-sys-color-primary-dark)] border-t-transparent
          ${sizeClasses[size]}
        `}
      />
      {text && <p className="mt-3 text-sm text-[var(--md-sys-color-on-surface-variant-dark)]">{text}</p>}
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
    </div>
  );
};

<<<<<<< HEAD
export default LoadingIndicator;
=======
export default LoadingIndicator;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
