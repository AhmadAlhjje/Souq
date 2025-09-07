'use client';
import React from 'react';
import Typography from '../atoms/Typography';
import useTheme from '@/hooks/useTheme';

export interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center space-x-4 space-x-reverse group p-3 rounded-xl transition-all duration-300 ${
      isDark 
        ? 'hover:bg-slate-800/30 border border-slate-600/20' 
        : 'hover:bg-white/10 border border-gray-200/20'
    }`}>
      <div className="flex-shrink-0 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <Typography 
          variant="h4" 
          className={`leading-tight mb-1 transition-colors duration-300 ${
            isDark ? 'text-emerald-300' : 'text-teal-800'
          }`}
        >
          {title}
        </Typography>
        {description && description.trim() && (
          <Typography 
            variant="caption"
            className={`transition-colors duration-300 ${
              isDark ? 'text-slate-300' : 'text-gray-600'
            }`}
          >
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default FeatureItem;