// components/molecules/ImageThumbnails.tsx
'use client';

import React, { useState } from 'react';

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
  maxVisible = 12,
  className = '',
  thumbnailClassName = '',
  fallbackSrc = '/images/default-product.jpg'
}) => {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
    if (imageErrors[index]) {
      return fallbackSrc;
    }
    return images[index] || fallbackSrc;
  };

  const handleThumbnailClick = (index: number) => {
    onImageSelect(index);
    if (onImageClick) {
      onImageClick(index);
    }
  };

  const visibleImages = images.slice(0, Math.min(images.length, maxVisible));
  const gridCols = visibleImages.length <= 4 
    ? 'grid-cols-4' 
    : visibleImages.length <= 6 
    ? 'grid-cols-3' 
    : 'grid-cols-4';

  return (
    <div className={`grid gap-2 ${gridCols} ${className}`}>
      {visibleImages.map((img: string, idx: number) => (
        <button
          key={idx}
          onClick={() => handleThumbnailClick(idx)}
          className={`
            w-full h-16 rounded-lg overflow-hidden border-2 
            hover:border-teal-400 transition-all duration-200 
            transform hover:scale-105 
            ${selectedIndex === idx 
              ? 'border-teal-500 ring-2 ring-teal-200' 
              : 'border-gray-200'
            }
            ${thumbnailClassName}
          `}
          type="button"
          aria-label={`عرض الصورة ${idx + 1}`}
        >
          <img
            src={getImageSrc(idx)}
            alt={`صورة مصغرة ${idx + 1}`}
            className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-90"
            onError={() => handleImageError(idx)}
            loading="lazy"
          />
        </button>
      ))}
      
      {/* مؤشر للصور الإضافية */}
      {images.length > maxVisible && (
        <div className="w-full h-16 rounded-lg border-2 border-gray-200 flex items-center justify-center bg-gray-100 text-gray-600 text-xs font-medium">
          +{images.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default ImageThumbnails;