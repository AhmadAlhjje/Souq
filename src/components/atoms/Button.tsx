// components/atoms/Button/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean; // إضافة disabled
  loading?: boolean; // إضافة loading
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  className = '', 
  startIcon, 
  endIcon,
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  size = 'md'
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-[#004D5A] text-white hover:bg-[#003a44] focus:ring-[#5CA9B5]',
    secondary: 'bg-[#5CA9B5] text-white hover:bg-[#4a8b94] focus:ring-[#5CA9B5]',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'bg-transparent border-2 border-[#004D5A] text-[#004D5A] hover:bg-[#004D5A] hover:text-white focus:ring-[#5CA9B5]'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Icon size based on button size
  const iconSize = {
    sm: '16px',
    md: '18px',
    lg: '20px'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div 
      className="animate-spin rounded-full border-2 border-white border-t-transparent"
      style={{ 
        width: iconSize[size], 
        height: iconSize[size] 
      }}
    />
  );

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Build final className
  const finalClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      className={finalClassName}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      {/* Loading state */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        startIcon && (
          <span className="flex-shrink-0 mr-1.5">
            {startIcon}
          </span>
        )
      )}
      
      {/* Button text */}
      <span className="whitespace-nowrap">{text}</span>
      
      {/* End icon (only if not loading) */}
      {!loading && endIcon && (
        <span className="flex-shrink-0 ml-1.5">
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;