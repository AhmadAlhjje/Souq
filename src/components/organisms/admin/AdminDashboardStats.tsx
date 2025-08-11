"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import AdminStatsCard from "@/components/molecules/admin/AdminStatsCard";
import AdminSkeleton from "@/components/atoms/admin/AdminSkeleton";
import { DashboardStats } from "@/types/admin";

interface AdminDashboardStatsProps {
  stats?: DashboardStats | null;
  loading?: boolean;
}

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  stats,
  loading = false,
}) => {
  const statsCards = [
    {
      title: "إجمالي الإيرادات",
      value: stats?.totalRevenue || 0,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "blue" as const,
      format: "currency",
    },
    {
      title: "إجمالي الطلبات",
      value: stats?.totalOrders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingCart,
      color: "green" as const,
      format: "number",
    },
    {
      title: "إجمالي المنتجات",
      value: stats?.totalProducts || 0,
      change: stats?.productsChange || 0,
      icon: Package,
      color: "purple" as const,
      format: "number",
    },
    {
      title: "إجمالي العملاء",
      value: stats?.totalCustomers || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      color: "orange" as const,
      format: "number",
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === "currency") {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(value);
    }
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <AdminSkeleton
            key={i}
            variant="card"
            height={120}
            className="p-6"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AdminStatsCard
            title={card.title}
            value={formatValue(card.value, card.format)}
            change={card.change}
            icon={card.icon}
            color={card.color}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default AdminDashboardStats;