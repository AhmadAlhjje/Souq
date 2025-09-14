import React from 'react';
import { User } from 'lucide-react';
import { Order } from '../../types/orders';

interface CustomerInfoProps {
  order: Order;
  isDark: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ order, isDark }) => {
  // دالة تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    
    try {
      return new Date(dateString).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return 'تاريخ غير صحيح';
    }
  };

  return (
    <div className={`p-4 rounded-xl ${
      isDark ? 'bg-gray-700/50' : 'bg-gray-50'
    }`}>
      <h3 className="flex items-center gap-2 font-semibold mb-3">
        <User size={18} />
        معلومات الزبون
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            الاسم:
          </span>
          <p className="font-medium">{order.customerName || 'غير محدد'}</p>
        </div>
        <div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            تاريخ الطلب:
          </span>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
        {order.shipping?.customer_phone && (
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              الهاتف:
            </span>
            <p className="font-medium">{order.shipping.customer_phone}</p>
          </div>
        )}
        {order.shipping?.shipping_address && (
          <div className="md:col-span-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              العنوان:
            </span>
            <p className="font-medium">{order.shipping.shipping_address}</p>
          </div>
        )}
        {order.shipping?.recipient_name && order.shipping.recipient_name !== order.customerName && (
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              اسم المستلم:
            </span>
            <p className="font-medium">{order.shipping.recipient_name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;