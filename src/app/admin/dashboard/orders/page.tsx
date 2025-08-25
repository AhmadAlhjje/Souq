"use client";
import React, { useState, useEffect } from "react";
import OrdersTemplate from "../../../../components/templates/OrdersTemplate";
import useTheme from "@/hooks/useTheme";
import { Order, TabType, OrderStats } from "../../../../types/orders";
import { ConfirmationVariant } from "../../../../components/common/ConfirmationModal";

const OrdersPageComponent: React.FC = () => {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "warning" as ConfirmationVariant,
    loading: false,
  });

  const { isDark } = useTheme();

  // Load sample data
  useEffect(() => {
    const sampleOrders: Order[] = [
      {
        id: "1",
        customerName: "Kristin Watson",
        productImage: "🍕",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "مشحون",
        orderDate: "2025-08-20",
        customerPhone: "+966501234567",
        customerAddress: "الرياض، حي النرجس",
        products: [
          {
            id: "p1",
            name: "بيتزا مارجريتا",
            image: "🍕",
            quantity: 2,
            price: 45.0,
            totalPrice: 90.0,
          },
          {
            id: "p2",
            name: "كوكا كولا",
            image: "🥤",
            quantity: 3,
            price: 8.5,
            totalPrice: 25.5,
          },
        ],
      },
      {
        id: "2",
        customerName: "Ahmed Ali",
        productImage: "🍔",
        status: "active",
        orderNumber: "#7712310",
        price: 850.0,
        quantity: 950,
        category: "مشحون",
        orderDate: "2025-08-21",
        customerPhone: "+966507654321",
        products: [
          {
            id: "p3",
            name: "برجر دجاج",
            image: "🍔",
            quantity: 1,
            price: 35.0,
            totalPrice: 35.0,
          },
          {
            id: "p4",
            name: "بطاطس مقلية",
            image: "🍟",
            quantity: 2,
            price: 12.0,
            totalPrice: 24.0,
          },
        ],
      },
      {
        id: "3",
        customerName: "Sara Mohammed",
        productImage: "🌮",
        status: "pending",
        orderNumber: "#7712311",
        price: 1200.0,
        quantity: 750,
        category: "غير مشحون",
        orderDate: "2025-08-22",
        products: [
          {
            id: "p5",
            name: "تاكو لحم",
            image: "🌮",
            quantity: 3,
            price: 28.0,
            totalPrice: 84.0,
          },
        ],
      },
      {
        id: "4",
        customerName: "Omar Hassan",
        productImage: "🥗",
        status: "pending",
        orderNumber: "#7712312",
        price: 650.0,
        quantity: 400,
        category: "غير مشحون",
        orderDate: "2025-08-23",
        products: [
          {
            id: "p6",
            name: "سلطة خضار",
            image: "🥗",
            quantity: 2,
            price: 22.0,
            totalPrice: 44.0,
          },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
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

  const stats: OrderStats = {
    totalOrders: orders.length,
    shippedOrders: orders.filter((order) => order.category === "مشحون").length,
    unshippedOrders: orders.filter((order) => order.category === "غير مشحون")
      .length,
    totalShippedPrice: orders
      .filter((order) => order.category === "مشحون")
      .reduce((sum, order) => sum + order.price, 0),
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

  const confirmShipOrder = (order: Order) => {
    setConfirmationModal((prev) => ({ ...prev, loading: true }));

    setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, category: "مشحون", status: "active" } : o
        )
      );

      setConfirmationModal({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        variant: "warning" as ConfirmationVariant,
        loading: false,
      });
    }, 1500);
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
