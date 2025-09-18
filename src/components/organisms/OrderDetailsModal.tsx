import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!order) return null;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('title')}
        subtitle={order.orderNumber}
        isDark={isDark}
      >
        <div className="space-y-6">
          {/* معلومات العميل */}
          <section aria-label={t('sections.customerInfo')}>
            <CustomerInfo order={order} isDark={isDark} />
          </section>
          
          {/* قائمة المنتجات */}
          <section aria-label={t('sections.productsList')}>
            <ProductsList products={order.products || []} isDark={isDark} />
          </section>
          
          {/* معلومات الشحن */}
          <section aria-label={t('sections.shippingInfo')}>
            <ShippingInfoComponent shipping={order.shipping} isDark={isDark} />
          </section>
          
          {/* ملخص الطلب */}
          <section aria-label={t('sections.orderSummary')}>
            <OrderSummary order={order} isDark={isDark} />
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetailsModal;