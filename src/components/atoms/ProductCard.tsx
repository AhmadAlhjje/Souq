// components/atoms/ProductCard.tsx

'use client';

import Image from 'next/image';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Image
        src={imageSrc}
        alt={title}
        width={200}
        height={200}
        className="w-full h-auto object-cover rounded-lg mb-3"
      />
      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ProductCard;