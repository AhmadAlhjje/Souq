import React from 'react';
import OrdersStatsGrid from '../organisms/OrdersStatsGrid';
import TabsGroup from '../molecules/TabsGroup';
import OrdersTable from '../organisms/OrdersTable';
import ShippedOrdersTotal from '../molecules/ShippedOrdersTotal';
import OrderDetailsModal from '../organisms/OrderDetailsModal';
import ConfirmationModal, { ConfirmationVariant } from '../../components/common/ConfirmationModal';
import { Order, TabType, OrderStats } from '../../types/orders';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant: ConfirmationVariant;
  loading: boolean;
}

interface OrdersTemplateProps {
  orders: Order[];
  filteredOrders: Order[];
  loading: boolean;
  activeTab: TabType;
  selectedOrder: Order | null;
  isModalOpen: boolean;
  stats: OrderStats;
  confirmationModal: ConfirmationState;
  isDark: boolean;
  onTabChange: (tab: TabType) => void;
  onView: (order: Order) => void;
  onMarkAsShipped: (order: Order) => void;
  onResetTotal: () => void;
  onExport: () => void;
  onCloseModal: () => void;
  onCloseConfirmation: () => void;
}

const OrdersTemplate: React.FC<OrdersTemplateProps> = ({
  orders,
  filteredOrders,
  loading,
  activeTab,
  selectedOrder,
  isModalOpen,
  stats,
  confirmationModal,
  isDark,
  onTabChange,
  onView,
  onMarkAsShipped,
  onResetTotal,
  onExport,
  onCloseModal,
  onCloseConfirmation
}) => {
  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-teal-50 to-cyan-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">جميع الطلبات</h1>
        </div>

        {/* Statistics Cards */}
        <OrdersStatsGrid stats={stats} loading={loading} />

        {/* Tabs */}
        <TabsGroup
          activeTab={activeTab}
          onTabChange={onTabChange}
          stats={stats}
          isDark={isDark}
        />

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          activeTab={activeTab}
          loading={loading}
          onView={onView}
          onMarkAsShipped={onMarkAsShipped}
          onExport={onExport}
          isDark={isDark}
        />

        {/* Shipped Orders Total Section */}
        <ShippedOrdersTotal
          stats={stats}
          onResetTotal={onResetTotal}
          isDark={isDark}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        isDark={isDark}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={onCloseConfirmation}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        variant={confirmationModal.variant}
        isDark={isDark}
        loading={confirmationModal.loading}
        confirmText={
          confirmationModal.variant === "danger" 
            ? "تصفير" 
            : confirmationModal.variant === "success" 
            ? "تأكيد الشحن" 
            : "تأكيد"
        }
      />
    </div>
  );
};

export default OrdersTemplate;