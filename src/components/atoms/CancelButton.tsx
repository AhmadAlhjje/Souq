import React from 'react';
import { X } from 'lucide-react';

interface CancelButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  text?: string;
  className?: string;
  disabled?: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  size = 'md',
  tooltip,
  text,
  className = '',
  disabled = false
}) => {
  const sizeClasses = {
    sm: text ? 'px-3 py-1.5 text-sm' : 'p-1.5',
    md: text ? 'px-4 py-2 text-base' : 'p-2',
    lg: text ? 'px-6 py-3 text-lg' : 'p-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <X className={iconSizes[size]} />
      {text && <span>{text}</span>}
    </button>
  );
};

export default CancelButton;