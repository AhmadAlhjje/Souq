// ===========================================
// 4. StatsCard.tsx
// ===========================================
'use client';
import React from 'react';
import Typography from '@/components/atoms/Typography';
import useTheme from '@/hooks/useTheme';

export interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatsCard: React.FC<StatCardProps> = ({ value, label, className = '' }) => {
  const { isDark } = useTheme();

  return (
    <div className={`group space-y-3 p-3 lg:p-4 rounded-2xl transition-all duration-300 ${
      isDark 
        ? 'hover:bg-slate-700/40 border border-slate-600/30' 
        : 'hover:bg-white/20 border border-white/20'
    } ${className}`}>
      <Typography 
        variant="h1" 
        className={`group-hover:scale-110 transition-all duration-300 text-2xl lg:text-3xl xl:text-4xl ${
          isDark ? 'text-emerald-300' : 'text-teal-800'
        }`}
      >
        {value}
      </Typography>
      <Typography 
        variant="caption" 
        className={`font-medium transition-colors duration-300 ${
          isDark ? 'text-slate-300' : 'text-teal-800/80'
        }`}
      >
        {label}
      </Typography>
    </div>
  );
};

export default StatsCard;
