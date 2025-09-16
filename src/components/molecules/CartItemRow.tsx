// components/molecules/CartProductInfo.tsx
'use client';

import React from 'react';

interface CartProductInfoProps {
  name: string;
  description?: string;
  inStock?: boolean;
  className?: string;
}

const CartProductInfo: React.FC<CartProductInfoProps> = ({
  name,
  description,
  inStock = true,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {/* اسم المنتج */}
      <h3 className={`font-medium text-gray-900 leading-tight ${
        !inStock ? 'text-gray-500' : ''
      }`}>
        {name}
      </h3>
      
      {/* الوصف */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
      
      {/* حالة المخزون */}
      {!inStock && (
        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
          غير متوفر
        </span>
      )}
    </div>
  );
};

export default CartProductInfo;