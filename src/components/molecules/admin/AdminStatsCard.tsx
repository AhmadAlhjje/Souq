"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export type AdminStatsCardColor = 'blue' | 'green' | 'purple' | 'orange';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: AdminStatsCardColor;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  change,
  changeLabel = "من الشهر الماضي",
  icon: Icon,
  color = 'blue',
  className = '',
  onClick,
  loading = false,
}) => {
  const { isDark } = useTheme();

  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-blue-900/20' : 'bg-[#CFF7EE]',
        icon: isDark ? 'bg-blue-600' : 'bg-[#004D5A]',
        text: isDark ? 'text-blue-400' : 'text-[#004D5A]',
      },
      green: {
        bg: isDark ? 'bg-green-900/20' : 'bg-[#95EDD8]',
        icon: isDark ? 'bg-green-600' : 'bg-[#5CA9B5]',
        text: isDark ? 'text-green-400' : 'text-[#5CA9B5]',
      },
      purple: {
        bg: isDark ? 'bg-purple-900/20' : 'bg-[#BAF3E6]',
        icon: isDark ? 'bg-purple-600' : 'bg-[#004D5A]',
        text: isDark ? 'text-purple-400' : 'text-[#004D5A]',
      },
      orange: {
        bg: isDark ? 'bg-orange-900/20' : 'bg-[#96EDD9]',
        icon: isDark ? 'bg-orange-600' : 'bg-[#5CA9B5]',
        text: isDark ? 'text-orange-400' : 'text-[#5CA9B5]',
      },
    };
    return colors[color];
  };

  const colorClasses = getColorClasses();
  const isPositive = change !== undefined ? change >= 0 : undefined;

  const formatValue = (value: string | number, format?: string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (format === "currency") {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(numValue);
    }
    return new Intl.NumberFormat('ar-SA').format(numValue);
  };

  if (loading) {
    return (
      <div className={`
        p-6 rounded-xl border animate-pulse
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
        ${className}
      `}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className={`h-4 w-24 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            <div className={`h-8 w-32 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            <div className={`h-3 w-16 rounded ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          </div>
          <div className={`w-12 h-12 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      className={`
        p-6 rounded-xl border transition-all duration-200
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {/* Title */}
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-[#666666]'
          }`}>
            {title}
          </p>
          
          {/* Value */}
          <p className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-[#004D5A]'
          }`}>
            {typeof value === 'string' ? value : new Intl.NumberFormat('ar-SA').format(value)}
          </p>
          
          {/* Change Indicator */}
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight size={16} className="text-green-500" />
              ) : (
                <ArrowDownRight size={16} className="text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {Math.abs(change)}%
              </span>
              <span className={`text-xs ${
                isDark ? 'text-gray-500' : 'text-[#5CA9B5]'
              }`}>
                {changeLabel}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          ${colorClasses.icon}
        `}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminStatsCard;