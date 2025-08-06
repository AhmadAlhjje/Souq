// components/atoms/StatisticCard.tsx
import React from "react";

interface StatisticCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="flex items-center space-x-3 text-right">
      {/* النصوص */}
      <div>
        <p className="text-xl text-[#004D5A] font-bold ">{value}</p>
        <p className="text-black font-bold  text-sm">{title}</p>
      </div>

      {/* الأيقونة مع border بلون #004D5A */}
      <div className="flex-shrink-0 text-2xl text-[#004D5A] border-2 border-[#004D5A] rounded-full p-1.5 bg-white">
        {icon}
      </div>
    </div>
  );
};

export default StatisticCard;
