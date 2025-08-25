// src/components/molecules/StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  loading = false
}) => {
  const { isDark } = useThemeContext();

  const colorClasses = {
    blue: {
      bg: isDark ? 'bg-[#5CA9B5]/15' : 'bg-[#5CA9B5]/10', // خلفية فاتحة
      icon: isDark ? 'text-[#004D5A]' : 'text-[#004D5A]', // أيقونة داكنة
      border: isDark ? 'border-[#5CA9B5]/40' : 'border-[#5CA9B5]/30'
    },
    green: {
      bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
      icon: isDark ? 'text-green-400' : 'text-green-500',
      border: isDark ? 'border-green-800' : 'border-green-200'
    },
    red: {
      bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
      icon: isDark ? 'text-red-400' : 'text-red-500',
      border: isDark ? 'border-red-800' : 'border-red-200'
    },
    yellow: {
      bg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
      icon: isDark ? 'text-yellow-400' : 'text-yellow-500',
      border: isDark ? 'border-yellow-800' : 'border-yellow-200'
    },
    purple: {
      bg: isDark ? 'bg-[#004D5A]/15' : 'bg-[#004D5A]/8', // خلفية داكنة
      icon: isDark ? 'text-[#5CA9B5]' : 'text-[#5CA9B5]', // أيقونة فاتحة
      border: isDark ? 'border-[#004D5A]/40' : 'border-[#004D5A]/25'
    }
  };

  if (loading) {
    return (
      <div className={`rounded-lg border p-6 animate-pulse ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`h-4 rounded w-20 mb-2 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-8 rounded w-16 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          </div>
          <div className={`w-12 h-12 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-6 hover:shadow-md transition-shadow ${
      isDark 
        ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClasses[color].bg} ${colorClasses[color].border}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;