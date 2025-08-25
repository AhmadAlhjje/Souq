import React from 'react';
import { StatsCard } from '../molecules';

interface ProfileStatsProps {
  stats: {
    orders: number;
    rating: number;
    activity: number;
  };
  themeClasses: {
    cardBackground: string;
    textPrimary: string;
    textMuted: string;
    borderColor: string;
    shadow: string;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  themeClasses
}) => {
  return (
    <div className="pt-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6`}>
          <div className={`grid grid-cols-3 text-center w-full border-t ${themeClasses.borderColor} pt-4`} dir="rtl">
            <StatsCard
              value={stats.orders}
              label="الطلبات"
              themeClasses={themeClasses}
            />
            <StatsCard
              value={stats.rating}
              label="التقييم"
              themeClasses={themeClasses}
            />
            <StatsCard
              value={`${stats.activity}%`}
              label="النشاط"
              themeClasses={themeClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;