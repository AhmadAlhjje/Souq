// components/atoms/TradeCard.tsx

'use client';

import React from 'react';
import {
  FaLaptop,
  FaNetworkWired,
  FaDesktop,
  FaPrint,
  FaBolt,
  FaWrench,
  FaBroadcastTower,
} from 'react-icons/fa';
import { IconType } from 'react-icons';

interface TradeCardProps {
  iconName: 'facebook' | 'twitter' | 'linkedin' | 'instagram'; // نبقيها لتوافق الكود (قد تُزال لاحقًا)
  label: string;
}

// دالة لاختيار الأيقونة بناءً على التصنيف (label)
const getIconByLabel = (label: string): IconType => {
  switch (label) {
    case 'إلكترونيات':
      return FaLaptop;
    case 'شبكات':
      return FaNetworkWired;
    case 'كمبيوتر':
      return FaDesktop;
    case 'طابعات':
      return FaPrint;
    case 'كهرباء':
      return FaBolt;
    case 'صيانة':
      return FaWrench;

    case 'أبراج':
      return FaBroadcastTower;
    default:
      return FaLaptop; // افتراضي
  }
};

const TradeCard: React.FC<TradeCardProps> = ({ label }) => {
  const Icon = getIconByLabel(label);

  return (
    <div
      className="
        flex flex-col items-center justify-between
        w-28 h-32 p-4
        bg-white
        border-4
        border-[#8cbbc3]
        rounded-2xl
        shadow-sm hover:shadow-lg
        transition-all duration-300
        hover:-translate-y-1 hover:scale-105
        group
      "
    >
      {/* الحاوية الخاصة بالأيقونة */}
      <div className="
        p-3 bg-gray-50 rounded-2xl
        group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50
        group-hover:scale-110
        transition-all duration-200
      ">
        <Icon 
          className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors duration-200" 
        />
      </div>

      {/* التسمية */}
      <span className="
        text-sm font-medium text-gray-800 text-center leading-tight
      ">
        {label}
      </span>
    </div>
  );
};

export default TradeCard;