// components/organisms/ProductDetails.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import ProductInfoo from '../molecules/ProductInfo';
import QuantityControl from '../atoms/QuantityControl';
import Button from '../atoms/Button';

interface ProductDetailsProps {
  product: {
    id: string | number;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    originalPrice?: number;
    salePrice?: number;
    rating: number;
    reviewCount: number;
    brand?: string;
    brandAr?: string;
    category?: string;
    categoryAr?: string;
    stock?: number;
    sales?: number;
    inStock?: boolean;
    isNew?: boolean;
  };
  onAddToCart?: (productId: string | number, quantity: number) => void;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  isItemInCart?: boolean;
  cartQuantity?: number;
  onQuantityUpdate?: (productId: string | number, quantity: number) => void;
  loading?: boolean;
  className?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  isItemInCart = false,
  cartQuantity = 0,
  onQuantityUpdate,
  loading = false,
  className = ''
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    } else {
      setQuantity(1);
    }
  }, [product.id, cartQuantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (isItemInCart && onQuantityUpdate) {
      onQuantityUpdate(product.id, newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!onAddToCart) return;
    
    try {
      setIsAdding(true);
      await onAddToCart(product.id, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!onBuyNow) return;
    
    try {
      setIsAdding(true);
      await onBuyNow(product.id, quantity);
    } catch (error) {
      console.error('خطأ في الشراء المباشر:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const isMaxQuantityReached = quantity >= (product.stock || 20);
  const isMinQuantityReached = quantity <= 1;
  const isOutOfStock = product.inStock === false;

  return (
    <div className={`space-y-3 ${className}`} dir="rtl">
      {/* شارة المنتج في السلة */}
      {isItemInCart && (
        <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 w-fit">
          <Check className="w-4 h-4" />
          المنتج في السلة ({cartQuantity} قطعة)
        </div>
      )}

      {/* معلومات المنتج */}
      <ProductInfoo
        name={product.name}
        nameAr={product.nameAr}
        description={product.description}
        descriptionAr={product.descriptionAr}
        price={product.price}
        originalPrice={product.originalPrice}
        salePrice={product.salePrice}
        rating={product.rating}
        reviewCount={product.reviewCount}
        brand={product.brand}
        brandAr={product.brandAr}
        category={product.category}
        categoryAr={product.categoryAr}
        stock={product.stock}
        sales={product.sales}
        inStock={product.inStock}
        isNew={product.isNew}
        showFullDescription={true}
      />

      {/* التحكم في الكمية */}
      <div className="py-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">الكمية:</label>
          <QuantityControl
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            min={1}
            max={product.stock || 20}
            disabled={isOutOfStock || loading}
          />
          {isItemInCart && (
            <span className="text-xs text-teal-600">
              (في السلة: {cartQuantity})
            </span>
          )}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="space-y-3 py-2">
        {onAddToCart && (
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock || loading}
            loading={isAdding}
            variant={showSuccess ? 'success' : 'primary'}
            size="lg"
            className="w-full"
            startIcon={showSuccess ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            text={
              isOutOfStock
                ? "غير متوفر"
                : showSuccess
                ? "تمت الإضافة"
                : isItemInCart
                ? "تحديث الكمية"
                : "إضافة للسلة"
            }
          />
        )}

        {onBuyNow && (
          <Button
            onClick={handleBuyNow}
            disabled={isAdding || isOutOfStock || loading}
            loading={isAdding}
            variant="outline"
            size="lg"
            className="w-full"
            text={
              isOutOfStock
                ? "غير متوفر"
                : isAdding
                ? "جاري التحضير..."
                : "اشتري الآن"
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;