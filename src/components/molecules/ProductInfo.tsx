// components/molecules/ProductInfo.tsx
'use client';

import React from 'react';
import StarRating from '../atoms/StarRating';
import Badge from '../atoms/Badge';

interface ProductInfoProps {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  brandAr?: string;
  category?: string;
  categoryAr?: string;
  stock?: number;
  sales?: number;
  inStock?: boolean;
  isNew?: boolean;
  showFullDescription?: boolean;
  className?: string;
  compact?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  nameAr,
  description,
  descriptionAr,
  price,
  originalPrice,
  salePrice,
  rating,
  reviewCount,
  brand,
  brandAr,
  category,
  categoryAr,
  stock,
  sales,
  inStock = true,
  isNew = false,
  showFullDescription = true,
  className = '',
  compact = false
}) => {
  const currentPrice = salePrice || originalPrice || price;
  const hasDiscount = salePrice && originalPrice && salePrice < originalPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice! - salePrice!) / originalPrice!) * 100)
    : 0;

  return (
    <div className={`space-y-3 ${className}`} dir="rtl">
      {/* العنوان */}
      <div className="flex items-start justify-between">
        <h1 className={`font-bold text-gray-900 leading-relaxed flex-1 ${
          compact ? 'text-base' : 'text-lg'
        }`}>
          {nameAr || name}
        </h1>
        
        {/* شارة جديد */}
        {isNew && !hasDiscount && (
          <Badge variant="new" text="جديد" />
        )}
      </div>

      {/* التقييم */}
      <div className="flex items-center gap-2">
        <StarRating 
          rating={rating} 
          size={compact ? 'sm' : 'md'}
          showValue={false}
        />
        <span className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>
          ({rating}) - {reviewCount} تقييم
        </span>
      </div>

      {/* السعر */}
      <div className={`font-bold text-teal-600 py-2 ${compact ? 'text-sm' : 'text-base'}`}>
        <span>{currentPrice}</span>
        <span className="text-gray-500 mr-1">$</span>
        
        {hasDiscount && (
          <>
            <span className={`text-gray-400 line-through mr-2 ${
              compact ? 'text-xs' : 'text-sm'
            }`}>
              {originalPrice} $
            </span>
            <Badge 
              variant="sale" 
              text={`وفر ${discountPercentage}%`}
              className="mr-2"
            />
          </>
        )}
      </div>

      {/* الوصف */}
      {showFullDescription && (description || descriptionAr) && (
        <div className="py-3">
          <h3 className={`font-semibold text-gray-900 mb-2 ${
            compact ? 'text-xs' : 'text-sm'
          }`}>
            وصف المنتج
          </h3>
          <p className={`text-gray-600 leading-relaxed ${
            compact ? 'text-xs' : 'text-sm'
          }`}>
            {descriptionAr || description}
          </p>
        </div>
      )}

      {/* المخزون */}
      {stock !== undefined && stock > 0 && (
        <div className="py-2">
          <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
            <span className="text-gray-600">المتوفر في المخزون:</span>
            <span className={`font-medium ${
              stock > 10
                ? 'text-green-600'
                : stock > 5
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              {stock} قطعة
            </span>
          </div>
        </div>
      )}

      {/* معلومات إضافية */}
      {!compact && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          {(brand || brandAr) && (
            <div className="flex justify-between">
              <span className="text-gray-600">المتجر:</span>
              <span className="font-medium">
                {brandAr || brand}
              </span>
            </div>
          )}
          
          {(category || categoryAr) && (
            <div className="flex justify-between">
              <span className="text-gray-600">التصنيف:</span>
              <span className="font-medium">
                {categoryAr || category}
              </span>
            </div>
          )}
          
          {sales && (
            <div className="flex justify-between">
              <span className="text-gray-600">عدد المبيعات:</span>
              <span className="font-medium">{sales}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600">عدد التقييمات:</span>
            <span className="font-medium">{reviewCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;