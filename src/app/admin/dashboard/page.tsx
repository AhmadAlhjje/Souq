"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import useTheme from "@/hooks/useTheme";

// Atomic Design Componentsx
import AdminButton from "@/components/atoms/admin/AdminButton";
import AdminSkeleton from "@/components/atoms/admin/AdminSkeleton";
import AdminDashboardStats from "@/components/organisms/admin/AdminDashboardStats";
import AdminQuickActionCard from "@/components/molecules/admin/AdminQuickActionCard";
import AdminRecentOrderItem from "@/components/molecules/admin/AdminRecentOrderItem";

// Types
import { DashboardStats } from "@/types/admin";

const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalRevenue: 125000,
        totalOrders: 1248,
        totalProducts: 324,
        totalCustomers: 892,
        revenueChange: 12.5,
        ordersChange: 8.2,
        productsChange: -2.1,
        customersChange: 15.3,
        topProducts: [],
        recentOrders: [],
        salesData: [],
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Mock recent orders data
  const recentOrders = [
    { id: 1001, timeAgo: "منذ ساعة", amount: 1250, status: 'completed' as const },
    { id: 1002, timeAgo: "منذ ساعتين", amount: 890, status: 'pending' as const },
    { id: 1003, timeAgo: "منذ 3 ساعات", amount: 2100, status: 'completed' as const },
    { id: 1004, timeAgo: "منذ 4 ساعات", amount: 750, status: 'cancelled' as const },
  ];

  // Quick actions data
  const quickActions = [
    { title: "إضافة منتج", icon: Package, href: "/admin/products/add" },
    { title: "عرض الطلبات", icon: ShoppingCart, href: "/admin/orders" },
    { title: "إدارة العملاء", icon: Users, href: "/admin/customers" },
    { title: "تقارير المبيعات", icon: TrendingUp, href: "/admin/analytics" },
  ];

  const handleOrderClick = (orderId: number) => {
    console.log(`Navigate to order ${orderId}`);
    // Add navigation logic here
  };

  const handleQuickAction = (href: string) => {
    console.log(`Navigate to ${href}`);
    // Add navigation logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-[#004D5A]'
          }`}>
            لوحة التحكم
          </h1>
          <p className={`mt-1 ${
            isDark ? 'text-gray-400' : 'text-[#666666]'
          }`}>
            مرحباً بك في لوحة تحكم متجرك
          </p>
        </div>
        
        <AdminButton
          icon={MoreHorizontal}
          variant="secondary"
          size="md"
          title="خيارات إضافية"
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdminDashboardStats stats={stats} loading={loading} />
      </motion.div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`
            lg:col-span-2 p-6 rounded-xl border
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-[#004D5A]'
            }`}>
              تطور المبيعات
            </h3>
            <AdminButton
              variant="ghost"
              size="sm"
            >
              عرض التفاصيل
            </AdminButton>
          </div>
          
          {loading ? (
            <AdminSkeleton variant="rectangle" height={256} />
          ) : (
            <div className={`
              h-64 rounded-lg flex items-center justify-center
              ${isDark ? 'bg-gray-700' : 'bg-[#CFF7EE]'}
            `}>
              <p className={`${isDark ? 'text-gray-400' : 'text-[#5CA9B5]'}`}>
                مخطط المبيعات سيتم إضافته قريباً
              </p>
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            p-6 rounded-xl border
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-[#004D5A]'
            }`}>
              أحدث الطلبات
            </h3>
            <AdminButton
              variant="ghost"
              size="sm"
            >
              عرض الكل
            </AdminButton>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <AdminSkeleton key={i} variant="rectangle" height={60} />
              ))
            ) : (
              recentOrders.map((order) => (
                <AdminRecentOrderItem
                  key={order.id}
                  orderNumber={`طلب #${order.id}`}
                  timeAgo={order.timeAgo}
                  amount={order.amount}
                  status={order.status}
                  onClick={() => handleOrderClick(order.id)}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`
          p-6 rounded-xl border
          ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
        `}
      >
        <h3 className={`text-lg font-semibold mb-6 ${
          isDark ? 'text-white' : 'text-[#004D5A]'
        }`}>
          إجراءات سريعة
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <AdminQuickActionCard
                title={action.title}
                icon={action.icon}
                onClick={() => handleQuickAction(action.href)}
                disabled={loading}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;