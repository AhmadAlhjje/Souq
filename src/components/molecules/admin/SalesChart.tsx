import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import useTheme from "@/hooks/useTheme";
import AdminSkeleton from "@/components/atoms/admin/AdminSkeleton";

interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
  formattedDate: string;
  month: string;
  day: number;
}

interface SalesChartProps {
  ordersStats: any;
  loading: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ ordersStats, loading }) => {
  const { isDark } = useTheme();

  // معالجة البيانات من API لآخر شهر مع الأشهر الإنجليزية
  const processSalesData = (): SalesDataPoint[] => {
    if (!ordersStats?.allOrders?.orders) return [];

    const salesByDate: { [key: string]: { revenue: number; orders: number } } =
      {};

    // تجميع الطلبات حسب التاريخ
    ordersStats.allOrders.orders.forEach((order: any) => {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];
      const revenue = parseFloat(order.total_price);

      if (salesByDate[orderDate]) {
        salesByDate[orderDate].revenue += revenue;
        salesByDate[orderDate].orders += 1;
      } else {
        salesByDate[orderDate] = {
          revenue: revenue,
          orders: 1,
        };
      }
    });

    // إنشاء البيانات لآخر 30 يوم
    const salesData: SalesDataPoint[] = [];
    const today = new Date();

    // إنشاء آخر 30 يوم للمخطط
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayData = salesByDate[dateString] || { revenue: 0, orders: 0 };

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      salesData.push({
        date: dateString,
        revenue: dayData.revenue,
        orders: dayData.orders,
        formattedDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
        month: monthNames[date.getMonth()],
        day: date.getDate(),
      });
    }

    return salesData;
  };

  const salesData = processSalesData();
  const hasData = salesData.some((item) => item.revenue > 0);

  // Custom Tooltip محسن
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            p-4 rounded-xl shadow-2xl border backdrop-blur-sm
            ${
              isDark
                ? "bg-gray-800/95 border-gray-600 text-white shadow-black/20"
                : "bg-white/95 border-gray-200 text-gray-900 shadow-gray-500/20"
            }
          `}
        >
          <p className="font-semibold mb-2 text-sm">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm">
                  {entry.dataKey === "revenue" ? "الإيرادات" : "الطلبات"}:
                  <span className="font-semibold ml-1">
                    {entry.dataKey === "revenue"
                      ? `${entry.value.toLocaleString("ar-SA")} $`
                      : entry.value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // حساب إحصائيات إضافية لآخر شهر
  const calculateMonthlyStats = () => {
    const today = new Date();
    const lastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );

    // تصفية الطلبات لآخر شهر
    const lastMonthOrders =
      ordersStats?.allOrders?.orders?.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= lastMonth;
      }) || [];

    const monthlyRevenue = lastMonthOrders.reduce(
      (sum: number, order: any) => sum + parseFloat(order.total_price),
      0
    );

    const monthlyOrders = lastMonthOrders.length;
    const avgOrderValue =
      monthlyOrders > 0 ? monthlyRevenue / monthlyOrders : 0;

    // حساب النمو مقارنة بالشهر السابق
    const twoMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      today.getDate()
    );
    const previousMonthOrders =
      ordersStats?.allOrders?.orders?.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= twoMonthsAgo && orderDate < lastMonth;
      }) || [];

    const previousMonthRevenue = previousMonthOrders.reduce(
      (sum: number, order: any) => sum + parseFloat(order.total_price),
      0
    );

    const revenueGrowth =
      previousMonthRevenue > 0
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

    return {
      monthlyRevenue,
      monthlyOrders,
      avgOrderValue,
      revenueGrowth,
    };
  };

  const monthlyStats = calculateMonthlyStats();

  // تحديد أقصى قيمة للمخطط لتحسين المقياس
  const maxRevenue = Math.max(...salesData.map((item) => item.revenue));
  const maxOrders = Math.max(...salesData.map((item) => item.orders));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        lg:col-span-2 rounded-2xl border backdrop-blur-sm relative overflow-hidden
        ${
          isDark
            ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50"
            : "bg-gradient-to-br from-white/90 to-gray-50/90 border-[#96EDD9]/30"
        }
      `}
    >
      {/* خلفية تزيينية */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${
            isDark ? "bg-blue-500" : "bg-[#5CA9B5]"
          }`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl ${
            isDark ? "bg-purple-500" : "bg-[#96EDD9]"
          }`}
        />
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-[#004D5A]"
              }`}
            >
              تطور المبيعات
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-[#666666]"
              }`}
            >
              نظرة عامة على آخر 30 يوم
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isDark ? "bg-gray-700/50" : "bg-[#CFF7EE]/50"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                monthlyStats.revenueGrowth >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-[#5CA9B5]"
              }`}
            >
              {monthlyStats.revenueGrowth >= 0 ? "+" : ""}
              {monthlyStats.revenueGrowth.toFixed(1)}%
            </span>
          </div>
        </div>

        {loading ? (
          <AdminSkeleton variant="rectangle" height={320} />
        ) : hasData ? (
          <div className="space-y-6">
            {/* المخطط البياني المحسن */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#5CA9B5" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#5CA9B5"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="ordersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#96EDD9" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#96EDD9"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                    strokeOpacity={0.5}
                  />

                  <XAxis
                    dataKey="formattedDate"
                    tick={{
                      fontSize: 12,
                      fill: isDark ? "#9CA3AF" : "#6B7280",
                      fontWeight: 500,
                    }}
                    axisLine={{
                      stroke: isDark ? "#4B5563" : "#D1D5DB",
                      strokeWidth: 1,
                    }}
                    tickLine={{ stroke: isDark ? "#4B5563" : "#D1D5DB" }}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    tick={{
                      fontSize: 12,
                      fill: isDark ? "#9CA3AF" : "#6B7280",
                      fontWeight: 500,
                    }}
                    axisLine={{ stroke: isDark ? "#4B5563" : "#D1D5DB" }}
                    tickLine={{ stroke: isDark ? "#4B5563" : "#D1D5DB" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />

                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{
                      fontSize: 12,
                      fill: isDark ? "#9CA3AF" : "#6B7280",
                      fontWeight: 500,
                    }}
                    axisLine={{ stroke: isDark ? "#4B5563" : "#D1D5DB" }}
                    tickLine={{ stroke: isDark ? "#4B5563" : "#D1D5DB" }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#5CA9B5"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{ fill: "#5CA9B5", strokeWidth: 2, r: 4 }}
                    activeDot={{
                      r: 6,
                      stroke: "#5CA9B5",
                      strokeWidth: 3,
                      fill: "#5CA9B5",
                    }}
                  />

                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    stroke="#96EDD9"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#96EDD9", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#96EDD9", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* إحصائيات محسنة */}
            <div
              className={`
              grid grid-cols-3 gap-4 p-4 rounded-xl border
              ${
                isDark
                  ? "bg-gray-700/30 border-gray-600/50"
                  : "bg-white/50 border-gray-200/50"
              }
            `}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center space-y-1"
              >
                <div
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  الإيرادات الشهرية
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {monthlyStats.monthlyRevenue.toLocaleString("ar-SA")}
                  <span className="text-sm font-normal ml-1">$</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center space-y-1"
              >
                <div
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  إجمالي الطلبات
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {monthlyStats.monthlyOrders}
                  <span className="text-sm font-normal ml-1">طلب</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center space-y-1"
              >
                <div
                  className={`text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  متوسط قيمة الطلب
                </div>
                <div
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {monthlyStats.avgOrderValue.toFixed(0)}
                  <span className="text-sm font-normal ml-1">$</span>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`
              h-80 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden
              ${
                isDark
                  ? "bg-gradient-to-br from-gray-700/50 to-gray-800/50"
                  : "bg-gradient-to-br from-[#CFF7EE]/30 to-[#E6FFFE]/30"
              }
            `}
          >
            {/* خلفية تزيينية للحالة الفارغة */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute top-4 left-4 w-24 h-24 rounded-full ${
                  isDark ? "bg-blue-400" : "bg-[#5CA9B5]"
                }`}
              />
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  rotate: [5, 0, 5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute bottom-6 right-6 w-20 h-20 rounded-full ${
                  isDark ? "bg-green-400" : "bg-[#96EDD9]"
                }`}
              />
            </div>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`
                  w-24 h-24 rounded-2xl flex items-center justify-center mb-6 mx-auto
                  ${
                    isDark
                      ? "bg-gradient-to-br from-gray-600 to-gray-700 shadow-xl"
                      : "bg-gradient-to-br from-white to-gray-50 shadow-2xl"
                  }
                `}
              >
                <svg
                  className={`w-12 h-12 ${
                    isDark ? "text-gray-300" : "text-[#5CA9B5]"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </motion.div>

              <h4
                className={`text-2xl font-bold mb-3 ${
                  isDark ? "text-gray-200" : "text-[#5CA9B5]"
                }`}
              >
                ابدأ رحلة المبيعات
              </h4>

              <p
                className={`text-sm mb-4 max-w-xs ${
                  isDark ? "text-gray-400" : "text-[#5CA9B5]"
                }`}
              >
                ستظهر تحليلات المبيعات هنا عند بدء استقبال الطلبات
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs
                  ${
                    isDark
                      ? "bg-gray-600/50 text-gray-300"
                      : "bg-white/60 text-gray-600"
                  }
                `}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                المخطط يعرض آخر 30 يوم من البيانات
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SalesChart;
