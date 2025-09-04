//p
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import Card from '../atoms/Card';
import { SimpleStarRating } from '../molecules/StarRating';
import { SimplePriceDisplay } from '../molecules/PriceDisplay';
import { CompactQuantityCounter } from '../molecules/QuantityCounter';
import { Product } from '@/types/product';
import { useCart, useCartNotifications } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product,
  onViewDetails 
}) => {
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const router = useRouter();
  const { 
    addToCart, 
    isItemInCart, 
    getItemQuantity, 
    updateQuantity 
  } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();
  
  // تحديث الكمية المحلية عند تغيير المنتج أو كمية السلة
  useEffect(() => {
    const cartQuantity = getItemQuantity(product.id);
    if (cartQuantity > 0) {
      setLocalQuantity(cartQuantity);
    }
  }, [product.id, getItemQuantity]);
  
  const handleQuantityIncrease = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    
    if (isItemInCart(product.id)) {
      updateQuantity(product.id, newQuantity);
    }
  };
  
  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      
      if (isItemInCart(product.id)) {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      console.log('Adding product to cart:', product);
      
      if (isItemInCart(product.id)) {
        updateQuantity(product.id, localQuantity);
        showAddToCartSuccess(product.name, localQuantity);
      } else {
        addToCart(product, localQuantity);
        showAddToCartSuccess(product.name, localQuantity);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const calculateDiscountPercentage = (originalPrice?: number, salePrice?: number): number => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const handleImageError = () => {
    setImageError(true);
  };


  return (
    <Card hover className="overflow-hidden group">
      <div className="relative overflow-hidden" style={{ backgroundColor: '#F6F8F9' }}>
<img
  src={product.image || 'https://placehold.co/400x250/00C8B8/FFFFFF?text=منتج'}
  alt={product.name}
  className="w-full h-44 object-cover"
/>



        
        {product.salePrice && product.originalPrice && calculateDiscountPercentage(product.originalPrice, product.salePrice) > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{calculateDiscountPercentage(product.originalPrice, product.salePrice)}%
          </div>
        )}
        
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
            originalPrice={product.originalPrice || product.price}
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
        
        <div className="flex space-x-1 gap-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 border border-teal-800 text-teal-800 hover:bg-teal-50 text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>التفاصيل</span>
          </button>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 text-white text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1 ${
              showSuccess 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-teal-800 hover:bg-teal-900'
            } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {showSuccess ? (
              <>
                <Check className="w-3 h-3" />
                <span>تمت الإضافة</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;