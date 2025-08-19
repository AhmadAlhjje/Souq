
import React from 'react';

interface CartStatsProps {
  totalItems: number;
  className?: string;
}

const CartStats: React.FC<CartStatsProps> = ({ 
  totalItems,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-3xl p-8 shadow-lg border border-gray-200 ${className}`}>
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-900 mb-2">{totalItems}</div>
        <div className="text-gray-600 font-medium text-lg">منتجات مختلفة</div>
      </div>
    </div>
  );
};

export default CartStats;
