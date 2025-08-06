// components/atoms/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode; // أيقونة في البداية (في LTR تكون اليسار، في RTL تكون اليمين)
  endIcon?: React.ReactNode;   // أيقونة في النهاية (في LTR تكون اليمين، في RTL تكون اليسار)
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  className = '', 
  startIcon, 
  endIcon 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center 
        gap-1.5 
        ${startIcon || endIcon ? 'px-3' : 'px-4'} 
        py-1.5
        ${className}
      `.trim()}
      type="button"
    >
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      <span className="whitespace-nowrap">{text}</span>
      {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
    </button>
  );
};

export default Button;