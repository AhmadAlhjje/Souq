import React from 'react';
import { DollarSign, RotateCcw } from 'lucide-react';
import { OrderStats } from '../../types/orders';

interface ShippedOrdersTotalProps {
  stats: OrderStats;
  onResetTotal: () => void;
  isDark: boolean;
}

const ShippedOrdersTotal: React.FC<ShippedOrdersTotalProps> = ({
  stats,
  onResetTotal,
  isDark
}) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm ${
      isDark 
        ? 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50' 
        : 'bg-white/80 backdrop-blur-sm border border-gray-200/50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            isDark ? 'bg-teal-500/20' : 'bg-teal-100'
          }`}>
            <DollarSign className="text-teal-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">مجموع الطلبات المشحونة</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              إجمالي قيمة الطلبات التي تم شحنها
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-teal-600">
              {stats.totalShippedPrice.toLocaleString()} ر.س
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              من {stats.shippedOrders} طلب مشحون
            </p>
          </div>
          <button
            onClick={onResetTotal}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              isDark
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title="تصفير المبلغ"
          >
            <RotateCcw size={16} />
            <span>تصفير</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippedOrdersTotal;