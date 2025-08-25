import React from 'react';
import { Edit2 } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
  disabled?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  size = 'md',
  tooltip,
  className = '',
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
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
        bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <Edit2 className={`text-gray-600 ${iconSizes[size]}`} />
    </button>
  );
};

export default EditButton;