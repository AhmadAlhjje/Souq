// components/organisms/ImageGalleryModal.tsx
'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelectImage: (index: number) => void;
  productName: string;
  className?: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onSelectImage,
  productName,
  className = ''
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        onNext();
        break;
      case 'ArrowRight':
        onPrevious();
        break;
    }
  }, [onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center ${className}`}
      onClick={handleBackdropClick}
    >
      {/* أزرار التحكم العلوية */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {currentIndex + 1} من {images.length}
          </span>
          <span className="text-sm opacity-75 max-w-md truncate">
            {productName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="إغلاق المعرض"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* الصورة الرئيسية */}
      <div className="flex items-center justify-center w-full h-full px-20 py-20">
        <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`${productName} - صورة ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-opacity duration-300"
            style={{ userSelect: 'none' }}
            draggable={false}
          />
          
          {/* أيقونة التكبير */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* أزرار التنقل */}
      {images.length > 1 && (
        <>
          <button
            onClick={onNext}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            disabled={currentIndex === images.length - 1}
            aria-label="الصورة التالية"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={onPrevious}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            disabled={currentIndex === 0}
            aria-label="الصورة السابقة"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* الصور المصغرة في الأسفل */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto p-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectImage(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                idx === currentIndex 
                  ? 'border-white ring-2 ring-white ring-opacity-50' 
                  : 'border-gray-400 opacity-70 hover:opacity-100 hover:border-gray-200'
              }`}
              aria-label={`عرض الصورة ${idx + 1}`}
            >
              <img
                src={img}
                alt={`صورة مصغرة ${idx + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* مؤشر النقاط */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => onSelectImage(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              idx === currentIndex ? 'bg-white' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`الانتقال للصورة ${idx + 1}`}
          />
        ))}
      </div>

      {/* تعليمات التنقل */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-50 text-center">
        <div>استخدم الأسهم للتنقل • اضغط Esc للإغلاق</div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;