"use client";
import React, { useState, useEffect } from "react";
import OrdersTemplate from "../../../../components/templates/OrdersTemplate";
import useTheme from "@/hooks/useTheme";
import { Order, TabType, OrderStats } from "../../../../types/orders";
import { ConfirmationVariant } from "../../../../components/common/ConfirmationModal";
import { getStoreOrdersStats, updateOrderStatus } from "../../../../api/orders";

const OrdersPageComponent: React.FC = () => {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null); // إضافة state للإحصائيات من API
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "warning" as ConfirmationVariant,
    loading: false,
  });

  const { isDark } = useTheme();

  // تحويل بيانات API إلى تنسيق Order
  const transformApiDataToOrders = (apiData: any): Order[] => {
    const allOrders = apiData.allOrders.orders || [];

    return allOrders.map((order: any) => ({
      id: order.order_id.toString(),
      customerName: order.Shipping?.customer_name || "غير محدد",
      productImage: "📦", // يمكن تحسينه لاحقاً بناءً على صور المنتجات
      status: order.status === "shipped" ? "active" : "pending", // ✅ تمييز الحالة بناءً على status
      orderNumber: `#${order.order_id}`,
      price: parseFloat(order.total_price),
      quantity: order.OrderItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
      category: order.status === "shipped" ? "مشحون" : "غير مشحون", // ✅ التحقق من status مباشرة
      orderDate: new Date(order.created_at).toISOString().split("T")[0],
      customerPhone: order.Shipping?.customer_phone || "",
      customerAddress: order.Shipping?.shipping_address || "",
      products: order.OrderItems.map((item: any) => ({
        id: item.order_item_id.toString(),
        name: item.Product.name,
        image: "📦", // يمكن تحسينه لاحقاً
        quantity: item.quantity,
        price: parseFloat(item.price_at_time),
        totalPrice: parseFloat(item.price_at_time) * item.quantity,
      })),
    }));
  };

  // Load data from API
  useEffect(() => {
    const loadOrdersData = async () => {
      try {
        // استبدل 8 برقم المتجر الفعلي أو احصل عليه من context/props
        const storeId = 8;
        const data = await getStoreOrdersStats(storeId);

        setApiStats(data);
        const transformedOrders = transformApiDataToOrders(data);
        setOrders(transformedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error loading orders:", error);
        setLoading(false);
      }
    };

    loadOrdersData();
  }, []);

  // Computed values
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "shipped":
        return order.category === "مشحون";
      case "unshipped":
        return order.category === "غير مشحون";
      default:
        return true;
    }
  });

  // حساب الإحصائيات باستخدام البيانات من API فقط
  const stats: OrderStats = apiStats
    ? {
        totalOrders: apiStats.statistics.totalOrders,
        shippedOrders: apiStats.statistics.shippedCount,
        unshippedOrders: apiStats.statistics.unshippedCount,
        totalShippedPrice: apiStats.statistics.shippedRevenue, // 💡 استخدام مبلغ المشحونة
        totalUnshippedPrice: apiStats.statistics.unshippedRevenue, // 💡 إضافة مبلغ الغير مشحونة
      }
    : {
        totalOrders: 0,
        shippedOrders: 0,
        unshippedOrders: 0,
        totalShippedPrice: 0,
        totalUnshippedPrice: 0,
      };

  // Event handlers
  const handleMarkAsShipped = (order: Order) => {
    setConfirmationModal({
      isOpen: true,
      title: "تأكيد الشحن",
      message: `هل أنت متأكد من أنه تم شحن الطلب ${order.orderNumber} للزبون ${order.customerName}؟`,
      variant: "success",
      loading: false,
      onConfirm: () => confirmShipOrder(order),
    });
  };

  const confirmShipOrder = async (order: Order) => {
    console.log("🚀 Starting confirmShipOrder for order:", order);

    setConfirmationModal((prev) => ({ ...prev, loading: true }));

    try {
      // استدعاء API لتحديث حالة الطلب
      const updateResponse = await updateOrderStatus(
        Number(order.id),
        "confirmed"
      );
      console.log("✅ Order status updated successfully:", updateResponse);

      // تحديث الطلب محلياً (لتشوف التغيير مباشرة)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, category: "مشحون", status: "active" } : o
        )
      );
      console.log("🔄 Orders state updated locally");

      // إعادة جلب البيانات من السيرفر للتأكد
      const storeId = apiStats?.storeId || 8;
      console.log("📡 Reloading store stats after update...");
      const data = await getStoreOrdersStats(storeId);
      setApiStats(data);

      const transformedOrders = transformApiDataToOrders(data);
      setOrders(transformedOrders);
      console.log("✅ Orders reloaded from server:", transformedOrders);
    } catch (error) {
      console.error("❌ Failed to update order status:", error);
    } finally {
      setConfirmationModal({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        variant: "warning" as ConfirmationVariant,
        loading: false,
      });
      console.log("📌 Confirmation modal closed");
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleResetShippedTotal = () => {
    setConfirmationModal({
      isOpen: true,
      title: "تصفير المبلغ",
      message:
        "هل أنت متأكد من تصفير مجموع الطلبات المشحونة؟ هذا الإجراء لا يمكن التراجع عنه.",
      variant: "danger",
      loading: false,
      onConfirm: confirmResetTotal,
    });
  };

  const confirmResetTotal = () => {
    setConfirmationModal((prev) => ({ ...prev, loading: true }));

    setTimeout(() => {
      console.log("تم تصفير مجموع الطلبات المشحونة");
      // هنا يجب استدعاء API لتصفير المبلغ

      // تحديث الإحصائيات محلياً
      if (apiStats) {
        setApiStats({
          ...apiStats,
          statistics: {
            ...apiStats.statistics,
            shippedRevenue: 0,
          },
        });
      }

      setConfirmationModal({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        variant: "warning" as ConfirmationVariant,
        loading: false,
      });
    }, 1000);
  };

  const handleExport = () => {
    console.log("تصدير بيانات الطلبات...");
    // يمكن إضافة منطق تصدير البيانات هنا
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Render using template
  return (
    <OrdersTemplate
      orders={orders}
      filteredOrders={filteredOrders}
      loading={loading}
      activeTab={activeTab}
      selectedOrder={selectedOrder}
      isModalOpen={isModalOpen}
      stats={stats}
      confirmationModal={confirmationModal}
      isDark={isDark}
      onTabChange={setActiveTab}
      onView={handleView}
      onMarkAsShipped={handleMarkAsShipped}
      onResetTotal={handleResetShippedTotal}
      onExport={handleExport}
      onCloseModal={handleCloseModal}
      onCloseConfirmation={handleCloseConfirmation}
    />
  );
};

export default OrdersPageComponent;
