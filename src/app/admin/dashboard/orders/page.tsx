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
  const transformApiDataToOrders = (apiData: any): Order[] => {
    let sourceData = [];

    if (apiData.Products && Array.isArray(apiData.Products)) {
      // بيانات البحث - Products array
      sourceData = apiData.Products;
      console.log(
        "🔍 Processing search results from Products array:",
        sourceData.length
      );

      return sourceData.map((product: any) => ({
        id: product.order_id?.toString() || product.product_id?.toString(),
        customerName: product.customer_name || "غير محدد",
        productImage: "📦",
        status: product.order_status === "shipped" ? "active" : "pending",
        orderNumber: `#${product.order_id || product.product_id}`,
        price: parseFloat(product.total_price || product.price || "0"),
        quantity: product.quantity_ordered || 1,
        category: product.order_status === "shipped" ? "مشحون" : "غير مشحون",
        orderDate: new Date(product.created_at).toISOString().split("T")[0],
        customerPhone: "",
        customerAddress: "",
        isMonitored: false,
        products: [
          {
            id: product.product_id?.toString(),
            name: product.name,
            image: "📦",
            quantity: product.quantity_ordered || 1,
            price: parseFloat(product.price || "0"),
            totalPrice: parseFloat(product.total_price || product.price || "0"),
          },
        ],
        // معلومات الشحن للبحث قد تكون محدودة
        shipping: undefined,
      }));
    } else if (apiData.allOrders?.orders) {
      // البيانات العادية - allOrders.orders
      sourceData = apiData.allOrders.orders;
      console.log("📊 Processing regular orders data:", sourceData.length);

      return sourceData.map((order: any) => ({
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
        // إضافة معلومات الشحن
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
              tracking_number: order.Shipping.tracking_number,
              shipping_status: order.Shipping.shipping_status,
              shipped_at: order.Shipping.shipped_at,
              delivered_at: order.Shipping.delivered_at,
              identity_images: order.Shipping.identity_images,
              created_at: order.Shipping.created_at,
            }
          : undefined,
      }));
    }

    console.warn("⚠️ Unknown data structure:", apiData);
    return [];
  };

  // Load initial data from API
  useEffect(() => {
    if (!isLoaded || !storeId) return;

    const loadOrdersData = async () => {
      try {
        setLoading(true);
        const data = await getStoreOrdersStats(storeId);
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

  // Calculate statistics with updated logic
  const stats: OrderStats = apiStats
    ? {
        totalOrders: isSearchMode
          ? orders.length
          : apiStats.statistics.totalOrders,
        shippedOrders: orders.filter(
          (order) => order.category === "مشحون" && !order.isMonitored
        ).length,
        unshippedOrders: orders.filter(
          (order) => order.category === "غير مشحون" && !order.isMonitored
        ).length,
        monitoredOrders: orders.filter((order) => order.isMonitored).length,
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
