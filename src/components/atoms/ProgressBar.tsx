// src/components/atoms/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  className = ''
}) => {
  return (
    <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 ${className}`}>
      <div 
        className="bg-gradient-to-r from-teal-500 to-cyan-600 h-3 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;