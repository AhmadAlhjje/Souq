

// components/atoms/PriceDisplay.tsx
import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  originalPrice,
  currency = '$',
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <span className={`text-[#004D5A] font-bold ${sizeClasses[size]}`}>
        {currency}{price}
      </span>
      {originalPrice && (
        <div className="text-xs text-gray-400 line-through">
          {currency}{originalPrice}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
