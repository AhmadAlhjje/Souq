import React from 'react';
import { User } from 'lucide-react';
import { Order } from '../../types/orders';

interface CustomerInfoProps {
  order: Order;
  isDark: boolean;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ order, isDark }) => {
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
          <p className="font-medium">{order.customerName}</p>
        </div>
        <div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            تاريخ الطلب:
          </span>
          <p className="font-medium">{order.orderDate}</p>
        </div>
        {order.customerPhone && (
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              الهاتف:
            </span>
            <p className="font-medium">{order.customerPhone}</p>
          </div>
        )}
        {order.customerAddress && (
          <div>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              العنوان:
            </span>
            <p className="font-medium">{order.customerAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;