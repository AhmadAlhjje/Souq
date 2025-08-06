// components/organisms/StatisticsSection.tsx
import React from 'react';
import StatisticCard from '../atoms/StatisticCard';

const StatisticsSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
      <StatisticCard
        title="مبيعات المتاجر والبائعين"
        value="100,000,000$"
        icon="chart-bar"
      />
      <StatisticCard
        title="بائعون نشيطون"
        value="+100,000"
        icon="users"
      />
      <StatisticCard
        title="تجار ناجحين"
        value="+50,000"
        icon="trophy"
      />
    </div>
  );
};

export default StatisticsSection;