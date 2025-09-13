// components/organisms/ProductCard.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Eye, Check, AlertTriangle } from 'lucide-react';
import Card from '../atoms/Card';
import { SimpleStarRating } from '../molecules/StarRating';
import { SimplePriceDisplay } from '../molecules/PriceDisplay';
import { CompactQuantityCounter } from '../molecules/QuantityCounter';
import { Product } from '@/api/storeProduct';
import { useSessionContext } from '@/components/SessionProvider';
import { useToast } from '@/hooks/useToast';

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
  
  const router = useRouter();
  const { sessionId } = useSessionContext();
  const { showToast } = useToast();
  
  // Constants
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127';
  
  const handleQuantityIncrease = () => {
    setLocalQuantity(prev => prev + 1);
  };
  
  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity(prev => prev - 1);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
    router.push(`/products/${product.id}`);
  };

  const handleAddToCartClick = async () => {
    // التحقق من sessionId
    if (!sessionId) {
      showToast('جلسة غير صحيحة. يرجى إعادة تحميل الصفحة', 'error');
      return;
    }

    // التحقق من توفر المنتج
    if (!product.inStock || product.stock <= 0) {
      showToast('المنتج غير متوفر حالياً', 'warning');
      return;
    }

    try {
      setIsAdding(true);
      
      console.log('Adding product to cart:', {
        productId: product.id,
        quantity: localQuantity,
        sessionId: sessionId
      });
      
      // استدعاء API مباشرة
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: product.id,
          quantity: localQuantity
        }),
      });

      console.log('Add to cart response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Add to cart error:', errorData);
        throw new Error(`فشل في إضافة المنتج`);
      }

      const result = await response.json(); 
      console.log('Add to cart success:', result);
      
      // إظهار رسالة النجاح
      showToast(`تم إضافة ${localQuantity} من ${product.name} للسلة`, 'success');
      
      // إظهار أيقونة النجاح
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // إعادة تعيين الكمية
      setLocalQuantity(1);
      
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'حدث خطأ غير متوقع';
      
      showToast(errorMessage, 'error');
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

  // دالة لقطع النص مع النقاط
  const truncateText = (text: string, maxLength: number = 80): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // التحقق من حالة المنتج
  const isOutOfStock = !product.inStock || product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card hover className="overflow-hidden group relative">
      {/* Overlay للمنتجات غير المتوفرة */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-gray-500/50 z-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 text-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <span className="text-sm font-bold text-red-600">غير متوفر</span>
          </div>
        </div>
      )}
      
      <div className="relative overflow-hidden" style={{ backgroundColor: '#F6F8F9' }}>
        <img
          src={product.image || 'https://placehold.co/400x250/00C8B8/FFFFFF?text=منتج'}
          alt={product.name}
          className="w-full h-44 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x250/00C8B8/FFFFFF?text=منتج';
          }}
        />
        
        {/* شارة الخصم */}
        {product.salePrice && product.originalPrice && calculateDiscountPercentage(product.originalPrice, product.salePrice) > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{calculateDiscountPercentage(product.originalPrice, product.salePrice)}%
          </div>
        )}
        
        {/* شارة المنتج الجديد */}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            جديد
          </div>
        )}
        
        {/* تحذير المخزون المنخفض */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            آخر {product.stock}
          </div>
        )}
      </div>
      
      <div className="p-2 text-right">
        {/* اسم المنتج */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* وصف المنتج - الإضافة الجديدة */}
        {product.description && (
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">
            {truncateText(product.descriptionAr || product.description, 60)}
          </p>
        )}
        
        <div className="mb-1 flex justify-end">
          <SimpleStarRating rating={product.rating} />
        </div>
        
        <div className="mb-2">
          <SimplePriceDisplay 
            originalPrice={product.originalPrice || product.price}
            salePrice={product.salePrice}
          />
          {/* عرض حالة المخزون */}
        <div className="mb-2 text-xs text-center">
          {isOutOfStock ? (
            <span className="text-red-600 font-bold">غير متوفر</span>
          ) : isLowStock ? (
            <span className="text-orange-600 font-bold">كمية محدودة: {product.stock}</span>
          ) : (
            <span className="text-green-600">متوفر ({product.stock})</span>
          )}
        </div>
        </div>
        
        
        
        {/* عداد الكمية - فقط إذا كان المنتج متوفر */}
        {!isOutOfStock && (
          <div className="mb-2 flex items-center justify-end">
            <CompactQuantityCounter
              quantity={localQuantity}
              onIncrease={handleQuantityIncrease}
              onDecrease={handleQuantityDecrease}
              min={1}
              max={product.stock} // تحديد الحد الأقصى حسب المخزون
            />
          </div>
        )}
        
        <div className="flex space-x-1 gap-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 border border-teal-800 text-teal-800 hover:bg-teal-50 text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>التفاصيل</span>
          </button>
          
          <button 
            onClick={handleAddToCartClick}
            disabled={isAdding || isOutOfStock}
            className={`flex-1 text-white text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1 ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed'
                : showSuccess 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-teal-800 hover:bg-teal-900'
            } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isOutOfStock ? (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>غير متوفر</span>
              </>
            ) : showSuccess ? (
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