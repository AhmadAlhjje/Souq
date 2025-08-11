"use client";

import React from "react";
import useTheme from "@/hooks/useTheme";

export type AdminBadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type AdminBadgeSize = 'sm' | 'md' | 'lg';

interface AdminBadgeProps {
  children?: React.ReactNode;
  variant?: AdminBadgeVariant;
  size?: AdminBadgeSize;
  className?: string;
  pulse?: boolean;
}

const AdminBadge: React.FC<AdminBadgeProps> = ({
  children = '',
  variant = 'primary',
  size = 'md',
  className = '',
  pulse = false,
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return isDark 
          ? 'bg-blue-600 text-white' 
          : 'bg-[#004D5A] text-white';
      case 'secondary':
        return isDark 
          ? 'bg-gray-600 text-white' 
          : 'bg-[#666666] text-white';
      case 'success':
        return isDark 
          ? 'bg-green-600 text-white' 
          : 'bg-[#95EDD8] text-[#004D5A]';
      case 'warning':
        return isDark 
          ? 'bg-yellow-600 text-white' 
          : 'bg-[#BAF3E6] text-[#004D5A]';
      case 'danger':
        return isDark 
          ? 'bg-red-600 text-white' 
          : 'bg-[#5CA9B5] text-white';
      case 'info':
        return isDark 
          ? 'bg-blue-500 text-white' 
          : 'bg-[#96EDD9] text-[#004D5A]';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs min-w-[16px] h-4';
      case 'md':
        return 'px-2 py-1 text-xs min-w-[20px] h-5';
      case 'lg':
        return 'px-3 py-1.5 text-sm min-w-[24px] h-6';
      default:
        return 'px-2 py-1 text-xs min-w-[20px] h-5';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center rounded-full font-bold text-center
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default AdminBadge;