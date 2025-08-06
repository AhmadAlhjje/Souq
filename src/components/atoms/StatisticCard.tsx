// components/atoms/StatisticCard.tsx
import React from 'react';
import Icon from './Icon';

interface StatisticCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, icon }) => {
  return (
    <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow-md">
      <Icon name={icon} className="text-green-500" />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatisticCard;