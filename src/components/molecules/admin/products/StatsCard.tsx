// components/molecules/StatsCard/StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  className = '',
}) => {
  const colorClasses = {
    blue: 'bg-[#CFF7EE] text-[#004D5A]',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const textColorClasses = {
    blue: 'text-[#004D5A]',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={`bg-white p-4 rounded-lg border border-[#96EDD9] shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${textColorClasses[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;