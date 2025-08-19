// components/atoms/ProductImage.tsx
import React from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  discount?: number;
  inStock?: boolean;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  discount,
  inStock = true,
  className = '' 
}) => {
  return (
    <div className={`relative w-20 h-20 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-200"
        sizes="80px"
      />
      
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-xs font-medium">نفد المخزون</span>
        </div>
      )}
      
      {discount && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
          -{discount}%
        </div>
      )}
    </div>
  );
};

export default ProductImage;