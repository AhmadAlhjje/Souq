import React from 'react';
import { Order } from '../../types/orders';

interface OrderSummaryProps {
  order: Order;
  isDark: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, isDark }) => {
  return (
    <div className={`p-4 rounded-xl border-2 border-dashed ${
      isDark ? 'border-gray-600 bg-gray-700/20' : 'border-gray-300 bg-gray-50/50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold">السعر الكلي:</span>
        <span className="text-xl font-bold text-teal-600">
          {order.price.toLocaleString()} ر.س
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          حالة الشحن:
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.category === "مشحون"
            ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
        }`}>
          {order.category}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;