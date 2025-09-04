"use client";
import React, { useState, useEffect } from "react";
import OrdersTemplate from "../../../../components/templates/OrdersTemplate";
import useTheme from "@/hooks/useTheme";
import { Order, TabType, OrderStats } from "../../../../types/orders";
import { ConfirmationVariant } from "../../../../components/common/ConfirmationModal";
import {
  getStoreOrdersStats,
  updateOrderStatus,
  updateProgrammaticShipped,
} from "../../../../api/orders";
import { useStore } from "@/contexts/StoreContext";

const OrdersPageComponent: React.FC = () => {
  // Statesx
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "warning" as ConfirmationVariant,
    loading: false,
  });

  const { isDark } = useTheme();
  const { storeId, isLoaded } = useStore();

  // Transform API data to Orders with updated status logic
  const transformApiDataToOrders = (apiData: any): Order[] => {
    const allOrders = apiData.allOrders.orders || [];

    return allOrders.map((order: any) => ({
      id: order.order_id.toString(),
      customerName: order.Shipping?.customer_name || "غير محدد",
      productImage: "📦",
      status: order.status === "shipped" ? "active" : "pending",
      orderNumber: `#${order.order_id}`,
      price: parseFloat(order.total_price),
      quantity: order.OrderItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ),
      category: order.is_programmatic
        ? "مرصود"
        : order.status === "shipped"
        ? "مشحون"
        : "غير مشحون",
      orderDate: new Date(order.created_at).toISOString().split("T")[0],
      customerPhone: order.Shipping?.customer_phone || "",
      customerAddress: order.Shipping?.shipping_address || "",
      isMonitored: order.is_programmatic || false,
      products: order.OrderItems.map((item: any) => ({
        id: item.order_item_id.toString(),
        name: item.Product.name,
        image: "📦",
        quantity: item.quantity,
        price: parseFloat(item.price_at_time),
        totalPrice: parseFloat(item.price_at_time) * item.quantity,
      })),
    }));
  };

  // Load data from API
  useEffect(() => {
    if (!isLoaded || !storeId) return;

    const loadOrdersData = async () => {
      try {
        const data = await getStoreOrdersStats(storeId);
        setApiStats(data);
        const transformedOrders = transformApiDataToOrders(data);
        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrdersData();
  }, [storeId, isLoaded]);

  // Updated filtered orders logic
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "shipped":
        // Only show orders that are shipped and not monitored
        return order.category === "مشحون" && !order.isMonitored;
      case "unshipped":
        // Only show orders that are not shipped and not monitored
        return order.category === "غير مشحون" && !order.isMonitored;
      case "monitored":
        // Only show monitored orders
        return order.isMonitored;
      default:
        return true;
    }
  });

  // Calculate statistics with updated logic
  const stats: OrderStats = apiStats
    ? {
        totalOrders: apiStats.statistics.totalOrders,
        // Count only non-monitored shipped orders
        shippedOrders: orders.filter(
          (order) => order.category === "مشحون" && !order.isMonitored
        ).length,
        // Count only non-monitored unshipped orders
        unshippedOrders: orders.filter(
          (order) => order.category === "غير مشحون" && !order.isMonitored
        ).length,
        // Count monitored orders
        monitoredOrders: orders.filter((order) => order.isMonitored).length,
        // Revenue calculations
        totalShippedPrice: orders
          .filter((order) => order.category === "مشحون" && !order.isMonitored)
          .reduce((sum, order) => sum + order.price, 0),
        totalUnshippedPrice: orders
          .filter(
            (order) => order.category === "غير مشحون" && !order.isMonitored
          )
          .reduce((sum, order) => sum + order.price, 0),
        totalMonitoredPrice: orders
          .filter((order) => order.isMonitored)
          .reduce((sum, order) => sum + order.price, 0),
      }
    : {
        totalOrders: 0,
        shippedOrders: 0,
        unshippedOrders: 0,
        monitoredOrders: 0,
        totalShippedPrice: 0,
        totalUnshippedPrice: 0,
        totalMonitoredPrice: 0,
      };

  // Event handlers
  const handleMarkAsShipped = (order: Order) => {
    // Don't allow shipping monitored orders
    if (order.isMonitored) {
      return;
    }

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
      if (!storeId) throw new Error("⚠️ StoreId is not available");

      if (order.isMonitored) {
        // ✅ إذا كان الطلب مرصود
        await updateProgrammaticShipped(storeId);
      } else {
        // ✅ إذا كان طلب عادي
        await updateOrderStatus(Number(order.id), "shipped");
      }

      // إعادة تحميل البيانات
      const data = await getStoreOrdersStats(storeId);
      setApiStats(data);
      setOrders(transformApiDataToOrders(data));
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

  const confirmResetTotal = async () => {
    setConfirmationModal((prev) => ({ ...prev, loading: true }));

    try {
      if (!storeId) throw new Error("⚠️ StoreId is not available");

      // ✅ استدعاء التابع الموجود
      await updateProgrammaticShipped(storeId);

      // ✅ إعادة تحميل البيانات بعد التصفير
      const data = await getStoreOrdersStats(storeId);
      setApiStats(data);
      setOrders(transformApiDataToOrders(data));

      console.log(
        "✅ تم تحديث (تصفير) مجموع الطلبات المشحونة عبر updateProgrammaticShipped"
      );
    } catch (error) {
      console.error("❌ فشل في استدعاء updateProgrammaticShipped:", error);
    } finally {
      setConfirmationModal({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        variant: "warning" as ConfirmationVariant,
        loading: false,
      });
    }
  };

  const handleExport = () => {
    console.log("تصدير بيانات الطلبات...");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  };

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
