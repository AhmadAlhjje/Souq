// src/components/molecules/ProgressSection.tsx
import React from 'react';
import ProgressBar from '../atoms/ProgressBar';

interface ProgressSectionProps {
  percentage: number;
  className?: string;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  percentage,
  className = ''
}) => {
  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          إكمال الإعداد
        </span>
        <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
          {percentage}%
        </span>
      </div>
      <ProgressBar percentage={percentage} />
    </div>
  );
};

export default ProgressSection;