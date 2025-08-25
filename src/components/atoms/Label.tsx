import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = "", htmlFor }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-right text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${className}`}
      style={{ color: '#004D5A' }}
    >
      {children}
    </label>
  );
};

export default Label;