// components/molecules/ProductInfo.tsx
import React from 'react';

interface ProductInfoProps {
  name: string;
  description?: string;
  inStock?: boolean;
  className?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  name, 
  description,
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default ProductInfo;