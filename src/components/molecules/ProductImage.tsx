// components/molecules/ProductImage.tsx
'use client';

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import Badge from '../atoms/Badge';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeType?: 'sale' | 'new' | 'outOfStock';
  badgeText?: string;
  discountPercentage?: number;
  aspectRatio?: 'square' | 'wide' | 'tall';
  showZoomIcon?: boolean;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  onClick,
  showBadge = false,
  badgeType,
  badgeText,
  discountPercentage,
  aspectRatio = 'square',
  showZoomIcon = false,
  loading = 'lazy',
  fallbackSrc = '/images/default-product.jpg'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
    tall: 'aspect-[3/4]'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    return imageError ? fallbackSrc : src;
  };

  const getBadgeContent = () => {
    if (badgeText) return badgeText;
    
    switch (badgeType) {
      case 'sale':
        return discountPercentage ? `-${discountPercentage}%` : 'خصم';
      case 'new':
        return 'جديد';
      case 'outOfStock':
        return 'نفد المخزون';
      default:
        return '';
    }
  };

  const getBadgeVariant = () => {
    switch (badgeType) {
      case 'sale':
        return 'sale';
      case 'new':
        return 'new';
      case 'outOfStock':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div 
      className={`relative bg-gray-100 overflow-hidden ${aspectRatioClasses[aspectRatio]} ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={getImageSrc()}
        alt={alt}
        loading={loading}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          onClick ? 'group-hover:scale-105' : ''
        }`}
        onError={handleImageError}
      />
      
      {/* تأثير التكبير */}
      {onClick && showZoomIcon && (
        <div className={`absolute inset-0 bg-black transition-all duration-300 flex items-center justify-center ${
          isHovered ? 'bg-opacity-30' : 'bg-opacity-0'
        }`}>
          <ZoomIn className={`w-8 h-8 text-white transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      )}
      
      {/* الشارات */}
      {showBadge && badgeType && (
        <div className="absolute top-2 right-2">
          <Badge variant={getBadgeVariant()} text={getBadgeContent()} />
        </div>
      )}
      
      {/* غطاء نفاد المخزون */}
      {badgeType === 'outOfStock' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium">
            نفد المخزون
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;