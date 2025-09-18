// components/atoms/Label.tsx
import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string; // ✅ إضافة دعم className
}

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = '' }) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;