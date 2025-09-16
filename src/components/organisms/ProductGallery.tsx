// components/organisms/ProductGallery.tsx
'use client';

import React, { useState, useCallback } from 'react';
import ProductImage from '../molecules/ProductImage';
import ImageThumbnails from '../molecules/ImageThumbnails';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  selectedIndex?: number;
  onImageClick?: (index: number) => void;
  showBadge?: boolean;
  badgeType?: 'sale' | 'new' | 'outOfStock';
  badgeText?: string;
  discountPercentage?: number;
  inStock?: boolean;
  isNew?: boolean;
  className?: string;
  mainImageClassName?: string;
  thumbnailsClassName?: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  maxThumbnails?: number;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  selectedIndex: externalSelectedIndex,
  onImageClick,
  showBadge = true,
  badgeType,
  badgeText,
  discountPercentage,
  inStock = true,
  isNew = false,
  className = '',
  mainImageClassName = '',
  thumbnailsClassName = '',
  aspectRatio = 'square',
  maxThumbnails = 8 // تم تغييرها إلى 8 كما طُلب
}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  
  const selectedIndex = externalSelectedIndex !== undefined 
    ? externalSelectedIndex 
    : internalSelectedIndex;

  const handleImageSelect = useCallback((index: number) => {
    console.log('تم اختيار الصورة:', index);
    if (externalSelectedIndex === undefined) {
      setInternalSelectedIndex(index);
    }
    if (onImageClick) {
      onImageClick(index);
    }
  }, [externalSelectedIndex, onImageClick]);

  const handleMainImageClick = useCallback(() => {
    if (onImageClick) {
      console.log('نقر على الصورة الرئيسية:', selectedIndex);
      onImageClick(selectedIndex);
    }
  }, [onImageClick, selectedIndex]);

  const getBadgeType = () => {
    if (!inStock) return 'outOfStock';
    if (badgeType) return badgeType;
    if (discountPercentage && discountPercentage > 0) return 'sale';
    if (isNew) return 'new';
    return undefined;
  };

  const getBadgeText = () => {
    if (badgeText) return badgeText;
    if (!inStock) return 'نفد المخزون';
    if (discountPercentage && discountPercentage > 0) return `-${discountPercentage}%`;
    if (isNew) return 'جديد';
    return undefined;
  };

  const currentBadgeType = getBadgeType();
  const currentBadgeText = getBadgeText();

  // معلومات التشخيص
  console.log('ProductGallery - عدد الصور:', images?.length || 0);
  console.log('ProductGallery - الصورة المحددة:', selectedIndex);

  if (!images || images.length === 0) {
    console.log('لا توجد صور، عرض الصورة الافتراضية');
    return (
      <div className={`space-y-6 ${className}`}>
        <ProductImage
          src="/images/default-product.jpg"
          alt={productName}
          className={`bg-white rounded-xl overflow-hidden shadow-lg w-full ${mainImageClassName}`}
          aspectRatio={aspectRatio}
          showBadge={showBadge}
          badgeType={currentBadgeType}
          badgeText={currentBadgeText}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* الصورة الرئيسية */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
        <ProductImage
          src={images[selectedIndex] || images[0]}
          alt={`${productName} - صورة ${selectedIndex + 1}`}
          className={`w-full ${mainImageClassName}`}
          onClick={onImageClick ? handleMainImageClick : undefined}
          aspectRatio={aspectRatio}
          showBadge={showBadge}
          badgeType={currentBadgeType}
          badgeText={currentBadgeText}
          showZoomIcon={!!onImageClick}
        />
      </div>

      {/* الصور المصغرة - تظهر دائماً مع محلات للصور الفارغة */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <ImageThumbnails
          images={images}
          selectedIndex={selectedIndex}
          onImageSelect={handleImageSelect}
          onImageClick={onImageClick}
          maxVisible={maxThumbnails}
          className={thumbnailsClassName}
        />
      </div>

    </div>
  );
};

export default ProductGallery;