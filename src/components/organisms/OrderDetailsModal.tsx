import React from 'react';
import Modal from '../atoms/Modal';
import CustomerInfo from '../molecules/CustomerInfo';
import ProductsList from '../molecules/ProductsList';
import OrderSummary from '../molecules/OrderSummary';
import ShippingInfoComponent from '../molecules/ShippingInfoComponent';
import { Order } from '../../types/orders';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  isDark 
}) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل الطلب"
      subtitle={order.orderNumber}
      isDark={isDark}
    >
      <div className="space-y-6">
        {/* معلومات العميل */}
        <CustomerInfo order={order} isDark={isDark} />
        
        {/* قائمة المنتجات */}
        <ProductsList products={order.products || []} isDark={isDark} />
        
        {/* معلومات الشحن */}
        <ShippingInfoComponent shipping={order.shipping} isDark={isDark} />
        
        {/* ملخص الطلب */}
        <OrderSummary order={order} isDark={isDark} />
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;