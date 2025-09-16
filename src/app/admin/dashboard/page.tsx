"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import AdminButton from "@/components/atoms/admin/AdminButton";
import AdminSkeleton from "@/components/atoms/admin/AdminSkeleton";
import AdminDashboardStats from "@/components/organisms/admin/AdminDashboardStats";
import AdminRecentOrderItem from "@/components/molecules/admin/AdminRecentOrderItem";
import { getStore } from "@/api/stores";
import { useStore } from "@/contexts/StoreContext";
import { DashboardStats } from "@/types/admin";
import { getStoreOrdersStats } from "@/api/orders";
import SalesChart from "@/components/molecules/admin/SalesChart";

interface RecentOrder {
  id: number;
  timeAgo: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

// تحديث نوع ApiStore للتوافق مع البنية الجديدة
interface StoreWithStats {
  success: boolean;
  store: {
    store_id: number;
    user_id: number;
    store_name: string;
    store_address: string;
    description: string;
    images: string;
    logo_image: string;
    is_blocked: boolean;
    created_at: string;
    User: {
      username: string;
      whatsapp_number: string;
      role: string;
    };
    reviews: any[];
    averageRating: number;
    reviewsCount: number;
    totalRevenue: number;
    totalOrders: number;
    thisMonthRevenue: number;
    discountStats: {
      totalProductsWithDiscount: number;
      totalProducts: number;
      totalDiscountValue: number;
      discountPercentage: number;
    };
    products: Array<{
      product_id: number;
      store_id: number;
      name: string;
      description: string;
      price: string;
      discount_percentage: string | null;
      stock_quantity: number;
      images: string;
      created_at: string;
      discounted_price: number;
      discount_amount: number;
      has_discount: boolean;
      averageRating: number;
      reviewsCount: number;
      original_price: number;
    }>;
  };
}

const AdminDashboardPage = () => {
  const { isDark } = useTheme();
  const { storeId, isLoaded } = useStore(); // استخدام StoreContext
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ordersStats, setOrdersStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // دالة لتحويل التاريخ إلى وقت نسبي بالعربية
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `منذ ${days} يوم`;
    }
  };

  // دالة لتحويل حالة الطلب
  const getOrderStatus = (status: string): 'completed' | 'pending' | 'cancelled' => {
    switch (status) {
      case 'shipped':
      case 'delivered':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      // التحقق من أن storeId محمل ومتاح
      if (!isLoaded || !storeId) {
        console.log('Store not loaded yet or storeId is null:', { isLoaded, storeId });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // إعادة تعيين البيانات قبل جلب البيانات الجديدة
        setStats(null);
        setRecentOrders([]);
        setOrdersStats(null);
        
        console.log('🏪 Dashboard fetching data for store:', storeId);
        
        // جلب بيانات المتجر والإحصائيات
        const [storeData, ordersStatsData] = await Promise.all([
          getStore(storeId),
          getStoreOrdersStats(storeId)
        ]);

        // تعيين بيانات الطلبات للاستخدام في SalesChart
        setOrdersStats(ordersStatsData);

        // استخدام Type Assertion للوصول إلى البيانات الجديدة
        const storeWithStats = storeData as unknown  as StoreWithStats;

        // التحقق من وجود البيانات والنجاح
        if (!storeWithStats.success || !storeWithStats.store) {
          console.warn('⚠️ لم يتم العثور على بيانات المتجر أو فشل في جلب البيانات');
          return;
        }

        const storeInfo = storeWithStats.store;

        // حساب إحصائيات المنتجات
        const totalProducts = storeInfo.products?.length || 0;
        const availableProducts = storeInfo.products?.filter(product => product.stock_quantity > 0)?.length || 0;
        const outOfStockProducts = storeInfo.products?.filter(product => product.stock_quantity === 0)?.length || 0;
        const lowStockProducts = storeInfo.products?.filter(product => product.stock_quantity > 0 && product.stock_quantity <= 5)?.length || 0;
        const productsWithDiscount = storeInfo.products?.filter(product => product.has_discount)?.length || 0;

        // إعداد الإحصائيات للوحة التحكم
        const dashboardStats: DashboardStats = {
          totalRevenue: storeInfo.totalRevenue || 0,
          totalOrders: storeInfo.totalOrders || 0,
          totalProducts: totalProducts,
          totalCustomers: 0, // سيتم إلغاؤه من العرض
          revenueChange: 0, // يمكن حسابه لاحقاً إذا توفرت بيانات الفترة السابقة
          ordersChange: 0,
          productsChange: 0,
          customersChange: 0,
          topProducts: [],
          recentOrders: [],
          salesData: [],
        };

        // إضافة console.log للتحقق من البيانات
        console.log('🔍 Store Data:', storeInfo);
        console.log('📊 Dashboard Stats:', dashboardStats);
        console.log('📈 Orders Stats:', ordersStatsData);
        console.log('🏪 Store ID:', storeId);
        console.log('📦 Products Stats:', {
          totalProducts,
          availableProducts,
          outOfStockProducts,
          lowStockProducts,
          productsWithDiscount,
          discountStats: storeInfo.discountStats
        });

        // إعداد أحدث 4 طلبات (إذا كانت متوفرة)
        let latestOrders: RecentOrder[] = [];
        if (ordersStatsData?.allOrders?.orders) {
          latestOrders = ordersStatsData.allOrders.orders
            .slice(0, 4) // أخذ أول 4 طلبات
            .map((order: any) => ({
              id: order.order_id,
              timeAgo: getTimeAgo(order.created_at),
              amount: parseFloat(order.total_price),
              status: getOrderStatus(order.status)
            }));
        }

        setStats(dashboardStats);
        setRecentOrders(latestOrders);
        
      } catch (error) {
        console.error('خطأ في جلب بيانات لوحة التحكم:', error);
        // يمكنك إضافة إشعار خطأ هنا
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [storeId, isLoaded]); // إضافة dependencies

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
        {/* Sales Chart - تحديث لآخر شهر */}
        <SalesChart 
          ordersStats={ordersStats}
          loading={loading}
        />

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
            {/* <AdminButton
              variant="ghost"
              size="sm"
            >
              عرض الكل
            </AdminButton> */}
          </div>
          
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => (
                <AdminSkeleton key={i} variant="rectangle" height={60} />
              ))
            ) : recentOrders.length > 0 ? (
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
            ) : (
              <div className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-[#5CA9B5]'
              }`}>
                لا توجد طلبات حالياً
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      {/* <motion.div
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
      </motion.div> */}
    </div>
  );
};

export default AdminDashboardPage;