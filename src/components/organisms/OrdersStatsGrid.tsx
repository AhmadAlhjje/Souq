import React from "react";
import { Package, Check, X, DollarSign } from "lucide-react";
import StatsCard from "../../components/molecules/StatsCard";
import { OrderStats } from "../../types/orders";
import { useTranslation } from "react-i18next";

interface OrdersStatsGridProps {
  stats: OrderStats;
  loading: boolean;
}

const OrdersStatsGrid: React.FC<OrdersStatsGridProps> = ({
  stats,
  loading,
}) => {
  const { t } = useTranslation();

  const statsData = [
    {
      title: t("ordersStats.totalOrders"),
      value: stats.totalOrders,
      icon: Package,
      color: "blue" as const,
    },
    {
      title: t("ordersStats.shippedOrders"),
      value: stats.shippedOrders,
      icon: Check,
      color: "green" as const,
    },
    {
      title: t("ordersStats.unshippedOrders"),
      value: stats.unshippedOrders,
      icon: X,
      color: "red" as const,
    },
    {
      title: t("ordersStats.shippedAmount"),
      value: `${stats.totalShippedPrice.toLocaleString()} $`,
      icon: DollarSign,
      color: "purple" as const,
    },
    {
      title: t("ordersStats.unshippedAmount"),
      value: `${stats.totalUnshippedPrice.toLocaleString()} $`,
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
