    import React from 'react';
import { Text, Heading } from '../atoms';

interface StatsCardProps {
  value: string | number;
  label: string;
  themeClasses: {
    textPrimary: string;
    textMuted: string;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  themeClasses
}) => {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${themeClasses.textPrimary}`}>
        {value}
      </div>
      <div className={`text-sm ${themeClasses.textMuted}`}>
        {label}
      </div>
    </div>
  );
};

export default StatsCard;