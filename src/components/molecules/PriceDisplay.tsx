
// components/molecules/PriceDisplay.tsx
import React from 'react';
import Badge from '../atoms/Badge';
import { StarVariant } from '@/types/product';

interface PriceDisplayProps {
  originalPrice: number;
  salePrice?: number;
  currency?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  originalPrice, 
  salePrice, 
  currency = "$" 
}) => (
  <div className="flex items-center space-x-2">
    {salePrice ? (
      <span className="text-xl font-bold text-teal-800">{salePrice} {currency}</span>
    ) : (
      <span className="text-xl font-bold text-teal-800">{originalPrice} {currency}</span>
    )}
  </div>
);

interface CarouselPriceDisplayProps {
  originalPrice: number;
  salePrice: number;
  currency?: string;
}

const CarouselPriceDisplay: React.FC<CarouselPriceDisplayProps> = ({ 
  originalPrice, 
  salePrice, 
  currency = "$" 
}) => (
  <div className="flex items-center space-x-2">
    <span className="text-lg font-bold text-[#004D5A]">{salePrice} {currency}</span>
    <span className="text-sm text-[#666666] line-through">{originalPrice} {currency}</span>
    <Badge variant="saleNew">
      {Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% خصم
    </Badge>
  </div>
);

interface SimplePriceDisplayProps extends PriceDisplayProps {
  variant?: StarVariant;
}

const SimplePriceDisplay: React.FC<SimplePriceDisplayProps> = ({ 
  originalPrice, 
  salePrice, 
  currency = "$", 
  variant = 'default' 
}) => {
  const textColor = variant === 'new' ? 'text-[#004D5A]' : 'text-teal-800';
  
  return (
    <span className={`text-base font-bold ${textColor}`}>
      {salePrice || originalPrice} {currency}
    </span>
  );
};

export { PriceDisplay, CarouselPriceDisplay, SimplePriceDisplay };
