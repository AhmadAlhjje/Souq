"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { DashboardStats, Order, Product } from "@/types/admin";

const AdminDashboard = () => {
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

  const statsCards = [
    {
      title: "إجمالي الإيرادات",
      value: stats?.totalRevenue || 0,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "blue",
      format: "currency",
    },
    {
      title: "إجمالي الطلبات",
      value: stats?.totalOrders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingCart,
      color: "green",
      format: "number",
    },
    {
      title: "إجمالي المنتجات",
      value: stats?.totalProducts || 0,
      change: stats?.productsChange || 0,
      icon: Package,
      color: "purple",
      format: "number",
    },
    {
      title: "إجمالي العملاء",
      value: stats?.totalCustomers || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      color: "orange",
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

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-blue-900/20' : 'bg-[#CFF7EE]',
        icon: isDark ? 'bg-blue-600' : 'bg-[#004D5A]',
        text: 'text-[#004D5A]',
      },
      green: {
        bg: isDark ? 'bg-green-900/20' : 'bg-[#95EDD8]',
        icon: isDark ? 'bg-green-600' : 'bg-[#5CA9B5]',
        text: 'text-[#5CA9B5]',
      },
      purple: {
        bg: isDark ? 'bg-purple-900/20' : 'bg-[#BAF3E6]',
        icon: isDark ? 'bg-purple-600' : 'bg-[#004D5A]',
        text: 'text-[#004D5A]',
      },
      orange: {
        bg: isDark ? 'bg-orange-900/20' : 'bg-[#96EDD9]',
        icon: isDark ? 'bg-orange-600' : 'bg-[#5CA9B5]',
        text: 'text-[#5CA9B5]',
      },
    };
    return colors[color as keyof typeof colors];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`
                p-6 rounded-xl border animate-pulse
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}
            >
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
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
        <button className={`
          px-4 py-2 rounded-lg border transition-colors
          ${isDark 
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' 
            : 'bg-white border-[#96EDD9] text-[#004D5A] hover:bg-[#CFF7EE]'
          }
        `}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const colors = getColorClasses(card.color);
          const isPositive = card.change >= 0;
          
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-6 rounded-xl border transition-all duration-200 hover:shadow-lg
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-gray-400' : 'text-[#666666]'
                  }`}>
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-[#004D5A]'
                  }`}>
                    {formatValue(card.value, card.format)}
                  </p>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <ArrowUpRight size={16} className="text-green-500" />
                    ) : (
                      <ArrowDownRight size={16} className="text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {Math.abs(card.change)}%
                    </span>
                    <span className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-[#5CA9B5]'
                    }`}>
                      من الشهر الماضي
                    </span>
                  </div>
                </div>
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${colors.icon}
                `}>
                  <card.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
            <button className={`
              px-3 py-1 text-sm rounded-lg border transition-colors
              ${isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-[#96EDD9] text-[#004D5A] hover:bg-[#CFF7EE]'
              }
            `}>
              عرض التفاصيل
            </button>
          </div>
          <div className={`
            h-64 rounded-lg flex items-center justify-center
            ${isDark ? 'bg-gray-700' : 'bg-[#CFF7EE]'}
          `}>
            <p className={`${isDark ? 'text-gray-400' : 'text-[#5CA9B5]'}`}>
              مخطط المبيعات سيتم إضافته قريباً
            </p>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
            <button className={`text-sm ${
              isDark ? 'text-blue-400' : 'text-[#5CA9B5]'
            }`}>
              عرض الكل
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
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
                      طلب #{1000 + i}
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-[#666666]'
                    }`}>
                      منذ {i} ساعات
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`font-medium text-sm ${
                    isDark ? 'text-white' : 'text-[#004D5A]'
                  }`}>
                    {new Intl.NumberFormat('ar-SA', {
                      style: 'currency',
                      currency: 'SAR'
                    }).format(Math.random() * 1000 + 100)}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#95EDD8] text-[#004D5A]">
                    مكتمل
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
          {[
            { title: "إضافة منتج", icon: Package, href: "/admin/products/add" },
            { title: "عرض الطلبات", icon: ShoppingCart, href: "/admin/orders" },
            { title: "إدارة العملاء", icon: Users, href: "/admin/customers" },
            { title: "تقارير المبيعات", icon: TrendingUp, href: "/admin/analytics" },
          ].map((action, index) => (
            <button
              key={action.title}
              className={`
                p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                ${isDark 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-[#CFF7EE] border-[#96EDD9] hover:bg-[#BAF3E6]'
                }
              `}
            >
              <action.icon size={24} className={`
                mx-auto mb-2 ${isDark ? 'text-gray-300' : 'text-[#004D5A]'}
              `} />
              <p className={`text-sm font-medium ${
                isDark ? 'text-white' : 'text-[#004D5A]'
              }`}>
                {action.title}
              </p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;