
// components/molecules/SummaryRow.tsx
import React from 'react';

interface SummaryRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
  className?: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ 
  label, 
  value, 
  isTotal = false,
  className = '' 
}) => {
  const baseClasses = "flex justify-between items-center py-3";
  const borderClasses = isTotal 
    ? "bg-white rounded-xl px-4 shadow-sm" 
    : "border-b border-green-200";
  
  const textClasses = isTotal
    ? "text-xl font-bold text-gray-900"
    : "text-gray-700 font-medium";
    
  const valueClasses = isTotal
    ? "text-2xl font-bold text-green-600"
    : "font-bold text-gray-900 text-lg";

  return (
    <div className={`${baseClasses} ${borderClasses} ${className}`}>
      <span className={textClasses}>{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
};

export default SummaryRow;
