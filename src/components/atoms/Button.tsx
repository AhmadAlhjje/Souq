// components/atoms/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseClasses = "transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "bg-teal-800 hover:bg-teal-900 hover:shadow-lg text-white focus:ring-teal-500",
    secondary: "border-2 border-teal-800 text-teal-800 hover:bg-teal-50 hover:border-teal-900 hover:shadow-md focus:ring-teal-500",
    accent: "bg-[#96EDD9] hover:bg-[#BAF3E6] hover:shadow-lg text-[#004D5A] focus:ring-[#5CA9B5]",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm focus:ring-gray-300"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
};

export default Button;