// components/organisms/ProductsSection.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import Badge from '../atoms/Badge';
import ProductCard from './ProductCard';
import { Product } from '@/types/Product';

interface ProductsSectionProps {
  products: Product[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  products, 
  onQuantityChange, 
  onAddToCart, 
  onViewDetails 
}) => {
  return (
    <div className="lg:col-span-3">
      {/* خلفية القسم الكاملة */}
      <div 
        className="p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: '#CFF7EE ' }}
      >
        {/* العنوان والشارة */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span>جميع المنتجات</span>
            </h2>
            <Badge variant="defaultNew">
              لديك {products.length} منتج متاح
            </Badge>
          </div>
        </div>
        
          <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuantityChange={onQuantityChange}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

      
      </div>
    </div>
  );
};

export default ProductsSection;