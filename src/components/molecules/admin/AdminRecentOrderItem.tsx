"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import AdminBadge from "@/components/atoms/admin/AdminBadge";

interface AdminRecentOrderItemProps {
  orderNumber: string;
  timeAgo: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  onClick?: () => void;
}

const AdminRecentOrderItem: React.FC<AdminRecentOrderItemProps> = ({
  orderNumber,
  timeAgo,
  amount,
  status,
  onClick,
}) => {
  const { isDark } = useTheme();

  const getStatusVariant = () => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد المعالجة';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div 
      className={`
        flex items-center justify-between p-3 rounded-lg transition-colors
        ${onClick ? 'cursor-pointer hover:bg-opacity-80' : ''}
        ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#BAF3E6]'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${isDark ? 'bg-gray-700' : 'bg-[#CFF7EE]'}
        `}>
          <ShoppingCart size={16} className={
            isDark ? 'text-gray-400' : 'text-[#5CA9B5]'
          } />
        </div>
        <div>
          <p className={`font-medium text-sm ${
            isDark ? 'text-white' : 'text-[#004D5A]'
          }`}>
            {orderNumber}
          </p>
          <p className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-[#666666]'
          }`}>
            {timeAgo}
          </p>
        </div>
      </div>
      
      <div className="text-left space-y-1">
        <p className={`font-medium text-sm ${
          isDark ? 'text-white' : 'text-[#004D5A]'
        }`}>
          {formatAmount(amount)}
        </p>
        <AdminBadge
          variant={getStatusVariant()}
          size="sm"
        >
          {getStatusLabel()}
        </AdminBadge>
      </div>
    </div>
  );
};

export default AdminRecentOrderItem;