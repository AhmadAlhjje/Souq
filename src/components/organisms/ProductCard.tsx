import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';
import Card from '../atoms/Card';
import { SimpleStarRating } from '../molecules/StarRating';
import { SimplePriceDisplay } from '../molecules/PriceDisplay';
import { CompactQuantityCounter } from '../molecules/QuantityCounter';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onQuantityChange: (productId: number, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails?: (product: Product) => void; // جعلناها اختيارية
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onQuantityChange, 
  onAddToCart, 
  onViewDetails 
}) => {
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  const router = useRouter();
  
  const handleQuantityIncrease = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(product.id, newQuantity);
  };
  
  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(product.id, newQuantity);
    }
  };

  const handleViewDetails = () => {
    // إذا كان هناك callback مخصص، استخدمه
    if (onViewDetails) {
      onViewDetails(product);
    }
    
    // التنقل إلى صفحة المنتج
    router.push(`/products/${product.id}`);
  };

  // دالة مساعدة لحساب نسبة الخصم بشكل آمن
  const calculateDiscountPercentage = (originalPrice?: number, salePrice?: number): number => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };
  
  return (
    <Card hover className="overflow-hidden group">
      <div className="relative overflow-hidden" style={{ backgroundColor: '#F6F8F9' }}>
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        
        {/* شارة الخصم - مع فحص للقيم */}
        {product.salePrice && product.originalPrice && calculateDiscountPercentage(product.originalPrice, product.salePrice) > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{calculateDiscountPercentage(product.originalPrice, product.salePrice)}%
          </div>
        )}
        
        {/* شارة جديد */}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            جديد
          </div>
        )}
      </div>
      
      <div className="p-2 text-right">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mb-1 flex justify-end">
          <SimpleStarRating rating={product.rating} />
        </div>
        
        <div className="mb-2">
          <SimplePriceDisplay 
            originalPrice={product.originalPrice || product.price} // إصلاح: استخدام price كبديل
            salePrice={product.salePrice}
          />
        </div>
        
        <div className="mb-2 flex items-center justify-end">
          <CompactQuantityCounter
            quantity={localQuantity}
            onIncrease={handleQuantityIncrease}
            onDecrease={handleQuantityDecrease}
            min={1}
          />
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={handleViewDetails}
            className="flex-1 border border-teal-800 text-teal-800 hover:bg-teal-50 text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>التفاصيل</span>
          </button>
          
          <button 
            onClick={() => onAddToCart(product, localQuantity)}
            className="flex-1 bg-teal-800 hover:bg-teal-900 text-white text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <ShoppingCart className="w-3 h-3" />
            <span>إضافة</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;