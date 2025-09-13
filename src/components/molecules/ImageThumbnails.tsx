// components/molecules/ImageThumbnails.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageThumbnailsProps {
  images: string[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick?: (index: number) => void;
  maxVisible?: number;
  className?: string;
  thumbnailClassName?: string;
  fallbackSrc?: string;
}

const ImageThumbnails: React.FC<ImageThumbnailsProps> = ({
  images,
  selectedIndex,
  onImageSelect,
  onImageClick,
  maxVisible = 8, // تم تغييرها إلى 8 كما طُلب
  className = '',
  thumbnailClassName = '',
  fallbackSrc = '/images/default-product.jpg'
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [startIndex, setStartIndex] = useState(0);

  const handleImageError = (index: number) => {
    console.error(`❌ فشل في تحميل الصورة المصغرة ${index}:`, images[index]);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
    if (imageErrors[index]) {
      return fallbackSrc;
    }
    return images[index] || fallbackSrc;
  };

  const handleThumbnailClick = (index: number) => {
    const actualIndex = startIndex + index;
    onImageSelect(actualIndex);
    if (onImageClick) {
      onImageClick(actualIndex);
    }
  };

  // التحكم في التمرير
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + maxVisible < images.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setStartIndex(prev => Math.max(0, prev - 1));
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setStartIndex(prev => Math.min(images.length - maxVisible, prev + 1));
    }
  };

  // التأكد من أن الصورة المحددة مرئية
  React.useEffect(() => {
    if (selectedIndex < startIndex) {
      setStartIndex(selectedIndex);
    } else if (selectedIndex >= startIndex + maxVisible) {
      setStartIndex(Math.max(0, selectedIndex - maxVisible + 1));
    }
  }, [selectedIndex, startIndex, maxVisible]);

  // الحصول على الصور المرئية
  const visibleImages = images.slice(startIndex, startIndex + maxVisible);

  if (!images || images.length <= 1) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* عداد الصور */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>صور المنتج ({images.length})</span>
        <span>{selectedIndex + 1} من {images.length}</span>
      </div>

      {/* منطقة الصور المصغرة مع أزرار التمرير */}
      <div className="relative">
        {/* زر التمرير الأيسر */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="عرض الصور السابقة"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* زر التمرير الأيمن */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-1.5 hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="عرض الصور التالية"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* شبكة الصور المصغرة - دائماً 8 مساحات في 2 صفوف */}
        <div className={`grid grid-cols-4 gap-2 ${canScrollLeft || canScrollRight ? 'mx-8' : ''}`}>
          {Array.from({ length: 8 }).map((_, idx) => {
            const actualIndex = startIndex + idx;
            const hasImage = actualIndex < images.length;
            const isSelected = actualIndex === selectedIndex;

            if (!hasImage) {
              // محل فارغ للصور غير الموجودة
              return (
                <div
                  key={`placeholder-${idx}`}
                  className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-default"
                >
                  <div className="flex flex-col items-center text-gray-300">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-xs">إضافة صورة</span>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={actualIndex}
                onClick={() => handleThumbnailClick(idx)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 
                  hover:border-teal-400 transition-all duration-200 
                  transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-300
                  ${isSelected 
                    ? 'border-teal-500 ring-2 ring-teal-200 shadow-md' 
                    : 'border-gray-200 hover:shadow-sm'
                  }
                  ${thumbnailClassName}
                `}
                type="button"
                aria-label={`عرض الصورة ${actualIndex + 1}`}
              >
                <img
                  src={getImageSrc(actualIndex)}
                  alt={`صورة مصغرة ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-90"
                  onError={() => handleImageError(actualIndex)}
                  loading="lazy"
                  draggable={false}
                />
                
                {/* مؤشر الصورة المحددة */}
                {isSelected && (
                  <div className="absolute inset-0 bg-teal-500 bg-opacity-20 flex items-center justify-center">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* مؤشر الصفحة إذا كان هناك صور إضافية */}
        {images.length > maxVisible && (
          <div className="flex justify-center mt-2 space-x-1">
            {Array.from({ length: Math.ceil(images.length / maxVisible) }).map((_, pageIdx) => {
              const isCurrentPage = Math.floor(startIndex / maxVisible) === pageIdx;
              return (
                <button
                  key={pageIdx}
                  onClick={() => setStartIndex(pageIdx * maxVisible)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isCurrentPage ? 'bg-teal-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`الانتقال للصفحة ${pageIdx + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ImageThumbnails;