// components/organisms/StatisticsSection.tsx
import React from 'react';
import StatisticCard from '../atoms/StatisticCard';
import { FaChartLine, FaUsers, FaCrown } from 'react-icons/fa';

const StatisticsSection: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 mt-10 px-4">
      {/* البطاقة 1: المبيعات */}
      <StatisticCard
        title="مبيعات المتاجر والبائعين"
        value="100,000,000$"
        icon={<FaChartLine />}
      />

      {/* البطاقة 2: البائعون النشطون */}
      <StatisticCard
        title="بائعون نشيطون"
        value="+100,000"
        icon={<FaUsers />}
      />

      {/* البطاقة 3: التجار الناجحون */}
      <StatisticCard
        title="تجار ناجحون"
        value="+50,000"
        icon={<FaCrown />}
      />
    </div>
  );
};

export default StatisticsSection;