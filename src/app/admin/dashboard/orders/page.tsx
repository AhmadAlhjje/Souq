"use client";
import React, { useState, useEffect } from "react";
import { Package, Check, X, AlertCircle } from "lucide-react";
import {
  ViewButton,
  EditButton,
  DeleteButton,
} from "../../../../components/common/ActionButtons";
import StatsCard from "../../../../components/molecules/StatsCard";
import DataTable, {
  TableColumn,
} from "../../../../components/organisms/DataTable";

// Sample data structure for orders
interface Order {
  id: string;
  customerName: string;
  productImage: string;
  status: "active" | "pending" | "cancelled" | "completed";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample data - replace with actual API call
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
        category: "فاست",
      },
      {
        id: "2",
        customerName: "Kristin Watson",
        productImage: "🍔",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "إيتل",
      },
      {
        id: "3",
        customerName: "Kristin Watson",
        productImage: "🥗",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "إيتل",
      },
      {
        id: "4",
        customerName: "Kristin Watson",
        productImage: "🌮",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "5",
        customerName: "Kristin Watson",
        productImage: "🍜",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "6",
        customerName: "Kristin Watson",
        productImage: "🍰",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "7",
        customerName: "Kristin Watson",
        productImage: "☕",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "8",
        customerName: "Kristin Watson",
        productImage: "🥤",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "9",
        customerName: "Kristin Watson",
        productImage: "🍪",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "10",
        customerName: "Kristin Watson",
        productImage: "🍓",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "12",
        customerName: "Kristin Watson",
        productImage: "🍕",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "فاست",
      },
      {
        id: "12",
        customerName: "Kristin Watson",
        productImage: "🍔",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "إيتل",
      },
      {
        id: "13",
        customerName: "Kristin Watson",
        productImage: "🥗",
        status: "active",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "إيتل",
      },
      {
        id: "14",
        customerName: "Kristin Watson",
        productImage: "🌮",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
      {
        id: "15",
        customerName: "Kristin Watson",
        productImage: "🍜",
        status: "pending",
        orderNumber: "#7712309",
        price: 1452.5,
        quantity: 1638,
        category: "قيد الانتظار",
      },
    ];

    // Simulate loading
    setTimeout(() => {
      setOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate statistics
  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (order) => order.status === "active"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  // Statistics data
  const stats = [
    {
      title: "إجمالي الطلبات",
      value: totalOrders,
      icon: Package,
      color: "blue" as const,
    },
    {
      title: "الطلبات النشطة",
      value: activeOrders,
      icon: Check,
      color: "green" as const,
    },
    {
      title: "الطلبات الملغاة",
      value: cancelledOrders,
      icon: X,
      color: "red" as const,
    },
    {
      title: "قيد الانتظار",
      value: pendingOrders,
      icon: AlertCircle,
      color: "yellow" as const,
    },
  ];

  // Table columns configuration
  const columns: TableColumn[] = [
    {
      key: "customerName",
      title: "المنتج",
      width: "200px",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
            {row.productImage}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "orderNumber",
      title: "رقم الطلب",
      width: "120px",
    },
    {
      key: "price",
      title: "السعر",
      width: "120px",
      render: (value) => `${value.toLocaleString()}`,
    },
    {
      key: "quantity",
      title: "الكمية",
      width: "100px",
      render: (value) => value.toLocaleString(),
    },
    {
      key: "category",
      title: "الحالة",
      width: "120px",
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          فاست: "bg-teal-100 text-teal-800",
          إيتل: "bg-teal-100 text-teal-800",
          "قيد الانتظار": "bg-yellow-100 text-yellow-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "الإجراءات",
      width: "120px",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <ViewButton
            size="sm"
            onClick={() => handleView(row)}
            tooltip="عرض التفاصيل"
          />
          <EditButton
            size="sm"
            onClick={() => handleEdit(row)}
            tooltip="تعديل الطلب"
          />
          <DeleteButton
            size="sm"
            onClick={() => handleDelete(row)}
            tooltip="حذف الطلب"
          />
        </div>
      ),
    },
  ];

  // Action handlers
  const handleView = (order: Order) => {
    console.log("عرض الطلب:", order);
  };

  const handleEdit = (order: Order) => {
    console.log("تعديل الطلب:", order);
  };

  const handleDelete = (order: Order) => {
    console.log("حذف الطلب:", order);
    // Add confirmation dialog here
  };

  const handleExport = () => {
    console.log("تصدير بيانات الطلبات...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">جميع الطلبات</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={loading}
            />
          ))}
        </div>

        {/* Orders Table */}
        <DataTable
          data={orders}
          columns={columns}
          loading={loading}
          searchable={true}
          exportable={true}
          onExport={handleExport}
          itemsPerPageOptions={[10, 25, 50]}
          className="shadow-sm"
        />
      </div>
    </div>
  );
};

export default OrdersPage;
