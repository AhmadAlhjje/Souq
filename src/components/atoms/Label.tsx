import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = "" }) => {
  return (
    <label className={`block text-right text-gray-700 text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${className}`}>
      {children}
    </label>
  );
};

export default Label;