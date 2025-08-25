
// components/atoms/IconButton.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon: Icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '' 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'text-gray-400 hover:text-red-500 hover:bg-red-50'
  };

  const sizes = {
    sm: 'p-1 w-6 h-6',
    md: 'p-2 w-8 h-8',
    lg: 'p-3 w-10 h-10'
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
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-110
        ${className}
      `}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
