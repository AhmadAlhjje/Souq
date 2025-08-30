import React from "react";
import { Package, Check, X, DollarSign } from "lucide-react";
import StatsCard from "../../components/molecules/StatsCard";
import { OrderStats } from "../../types/orders";

interface OrdersStatsGridProps {
  stats: OrderStats;
  loading: boolean;
}

const OrdersStatsGrid: React.FC<OrdersStatsGridProps> = ({
  stats,
  loading,
}) => {
  const statsData = [
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: Package,
      color: "blue" as const,
    },
    {
      title: "الطلبات المشحونة",
      value: stats.shippedOrders,
      icon: Check,
      color: "green" as const,
    },
    {
      title: "الطلبات الغير مشحونة",
      value: stats.unshippedOrders,
      icon: X,
      color: "red" as const,
    },
    {
      title: "مبلغ الطلبات المشحونة",
      value: `${stats.totalShippedPrice.toLocaleString()} ر.س`,
      icon: DollarSign,
      color: "purple" as const,
    },
    {
      title: "مبلغ الطلبات الغير مشحونة", // ✨ جديد
      value: `${stats.totalUnshippedPrice.toLocaleString()} ر.س`,
      icon: DollarSign,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default OrdersStatsGrid;
