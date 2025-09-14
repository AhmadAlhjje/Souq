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
  getFilteredOrders,
  requestSettlement,
} from "../../../../api/orders";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/useToast";

// نوع البيانات للفلاتر
interface SearchFilters {
  customerName: string;
  productName: string;
}

const OrdersPageComponent: React.FC = () => {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { showToast } = useToast();
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    customerName: "",
    productName: "",
  });
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

  // دالة محدثة لتحويل بيانات API لتشمل معلومات الشحن
  // دالة محدثة لتحويل بيانات API لتشمل معلومات الشحن
  const transformApiDataToOrders = (apiData: any): Order[] => {
    if (apiData?.allOrders?.orders && Array.isArray(apiData.allOrders.orders)) {
      return apiData.allOrders.orders.map((order: any) => ({
        id: order.order_id.toString(),
        customerName: order.Shipping?.customer_name || "غير محدد",
        orderNumber: `#${order.order_id}`,
        price: parseFloat(order.total_price),
        quantity:
          order.OrderItems?.reduce(
            (sum: number, item: any) => sum + (item.quantity || 0),
            0
          ) || 0,
        category:
          order.status === "monitored"
            ? "مرصود"
            : order.status === "shipped"
            ? "مشحون"
            : "غير مشحون",
        products:
          order.OrderItems && order.OrderItems.length > 0
            ? order.OrderItems.map((item: any) => ({
                id: item.order_item_id?.toString() || "",
                name: item.Product?.name || "منتج",
                image: "📦",
                quantity: item.quantity || 0,
                price: parseFloat(item.price_at_time || "0"),
                totalPrice:
                  parseFloat(item.price_at_time || "0") * (item.quantity || 0),
              }))
            : [
                {
                  id: "0",
                  name: "منتج افتراضي",
                  image: "📦",
                  quantity: 1,
                  price: parseFloat(order.total_price || "0"),
                  totalPrice: parseFloat(order.total_price || "0"),
                },
              ],
        isMonitored:
          order.status === "monitored" || order.is_programmatic || false,

        // إضافة تاريخ الطلب
        createdAt: order.created_at,

        // إضافة بيانات الشحن هنا
        shipping: order.Shipping
          ? {
              shipping_id: order.Shipping.shipping_id,
              customer_name: order.Shipping.customer_name,
              customer_phone: order.Shipping.customer_phone,
              customer_whatsapp: order.Shipping.customer_whatsapp,
              recipient_name: order.Shipping.recipient_name,
              shipping_address: order.Shipping.shipping_address,
              source_address: order.Shipping.source_address,
              destination: order.Shipping.destination,
              shipping_method: order.Shipping.shipping_method,
              shipping_status: order.Shipping.shipping_status,
              identity_images: order.Shipping.identity_images,
              tracking_number: order.Shipping.tracking_number,
              shipped_at: order.Shipping.shipped_at,
              delivered_at: order.Shipping.delivered_at,
              created_at: order.Shipping.created_at,
            }
          : undefined,
      }));
    }
    return [];
  };

  // Load initial data from API
  useEffect(() => {
    if (!isLoaded || !storeId) return;

    const loadOrdersData = async () => {
      try {
        setLoading(true);
        const data = await getStoreOrdersStats(storeId);
        console.log("جاتا",data);
        setApiStats(data);
        const transformedOrders = transformApiDataToOrders(data);
        setOrders(transformedOrders);
        setIsSearchMode(false);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrdersData();
  }, [storeId, isLoaded]);

  // دالة البحث عبر API
  const handleApiSearch = async (filters: SearchFilters) => {
    if (!storeId) return;

    try {
      setSearchLoading(true);
      setCurrentFilters(filters);

      if (!filters.customerName.trim() && !filters.productName.trim()) {
        const data = await getStoreOrdersStats(storeId);
        setApiStats(data);
        const transformedOrders = transformApiDataToOrders(data);
        setOrders(transformedOrders);
        setIsSearchMode(false);
      } else {
        const searchData = await getFilteredOrders(storeId, {
          customerName: filters.customerName.trim() || undefined,
          productName: filters.productName.trim() || undefined,
        });

        const transformedOrders = transformApiDataToOrders(searchData);
        setOrders(transformedOrders);
        setIsSearchMode(true);

        setApiStats({
          ...searchData,
          allOrders: { orders: transformedOrders },
          statistics: searchData.statistics,
        });
      }
    } catch (error) {
      console.error("Error searching orders:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Updated filtered orders logic
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "shipped":
        return order.category === "مشحون" && !order.isMonitored;
      case "unshipped":
        return order.category === "غير مشحون" && !order.isMonitored;
      case "monitored":
        return order.isMonitored;
      default:
        return true;
    }
  });

  // Calculate statistics using API response
  const stats: OrderStats = apiStats?.statistics
    ? {
        totalOrders: apiStats.statistics.totalOrders || 0,
        shippedOrders: apiStats.statistics.shippedCount || 0,
        unshippedOrders: apiStats.statistics.unshippedCount || 0,
        monitoredOrders: apiStats.statistics.monitoredCount || 0,
        totalShippedPrice: apiStats.statistics.shippedRevenue || 0,
        totalUnshippedPrice: apiStats.statistics.unshippedRevenue || 0,
        totalMonitoredPrice: apiStats.statistics.monitoredRevenue || 0,
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
        await updateProgrammaticShipped(storeId);
      } else {
        await updateOrderStatus(Number(order.id), "shipped");
      }

      // إعادة تحميل البيانات بناءً على الحالة الحالية
      if (
        isSearchMode &&
        (currentFilters.customerName || currentFilters.productName)
      ) {
        // إذا كنا في وضع البحث، نعيد البحث
        await handleApiSearch(currentFilters);
      } else {
        // إذا لم نكن في وضع البحث، نحمل البيانات العادية
        const data = await getStoreOrdersStats(storeId);
        setApiStats(data);
        setOrders(transformApiDataToOrders(data));
      }
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

      // استخدام requestSettlement بدلاً من updateProgrammaticShipped
      const response = await requestSettlement(storeId);

      // إعادة تحميل البيانات بناءً على الحالة الحالية
      if (
        isSearchMode &&
        (currentFilters.customerName || currentFilters.productName)
      ) {
        await handleApiSearch(currentFilters);
      } else {
        const data = await getStoreOrdersStats(storeId);
        setApiStats(data);
        setOrders(transformApiDataToOrders(data));
      }

      // عرض رسالة نجاح من الباك اند
      if (response?.data?.message) {
        showToast(response.data.message, "success");
      } else if (response?.message) {
        showToast(response.message, "success");
      } else {
        showToast("تم إرسال طلب التصفية بنجاح", "success");
      }

      console.log("✅ تم إرسال طلب التصفية بنجاح عبر requestSettlement");
    } catch (error: any) {
      console.error("❌ فشل في استدعاء requestSettlement:", error);

      // عرض رسالة خطأ من الباك اند أو رسالة افتراضية
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إرسال طلب التصفية";
      showToast(errorMessage, "error");
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
      loading={loading || searchLoading}
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
      onApiSearch={handleApiSearch}
    />
  );
};

export default OrdersPageComponent;
