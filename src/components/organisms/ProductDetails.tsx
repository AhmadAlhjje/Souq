"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Check, AlertTriangle } from "lucide-react";
import ProductInfoo from "../molecules/ProductInfo";
import QuantityControl from "../atoms/QuantityControl";
import Button from "../atoms/Button";
import { useCart } from "@/hooks/useCart"; // استخدام الـ hook المتصل بالـ API
import { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  loading?: boolean;
  className?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBuyNow,
  loading = false,
  className = "",
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // استخدام الـ hook المتصل بالـ API
  const {
    cartData,
    addToCart,
    updateQuantity: updateCartQuantity,
    isLoading: cartLoading,
    fetchCart,
  } = useCart();

  const productId = Number(product.id);

  // البحث عن المنتج في السلة
  const cartItem = cartData?.items.find(
    (item) => item.product_id === productId
  );
  const isItemInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // مزامنة الكمية مع السلة عند تحميل البيانات
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    } else {
      setQuantity(1);
    }
  }, [cartQuantity]);

  // تحديث السلة عند تغيير المنتج
  useEffect(() => {
    fetchCart();
  }, [productId, fetchCart]);

  // معالج تغيير الكمية
  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      setQuantity(newQuantity);

      // إذا كان المنتج في السلة، قم بتحديث الكمية في الخادم
      if (isItemInCart && cartItem) {
        try {
          await updateCartQuantity(cartItem.cart_item_id, newQuantity);
        } catch (error) {
          console.error("خطأ في تحديث الكمية:", error);
          // إرجاع الكمية للقيمة السابقة في حالة الخطأ
          setQuantity(cartQuantity);
        }
      }
    },
    [isItemInCart, cartItem, cartQuantity, updateCartQuantity]
  );

  // معالج إضافة إلى السلة
  const handleAddToCart = useCallback(async () => {
    if (loading || isAdding || cartLoading) return;

    try {
      setIsAdding(true);

      if (isItemInCart && cartItem) {
        // تحديث الكمية إذا كان المنتج موجود في السلة
        await updateCartQuantity(cartItem.cart_item_id, quantity);
        console.log(`تم تحديث كمية المنتج إلى ${quantity}`);
      } else {
        // إضافة منتج جديد للسلة
        await addToCart(productId, quantity);
        console.log(`تمت إضافة ${quantity} من المنتج ${product.name} للسلة`);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // تحديث بيانات السلة
      await fetchCart();
    } catch (error) {
      console.error("خطأ في إضافة/تحديث المنتج:", error);

      // معالجة الأخطاء بناءً على نوعها
      if (error instanceof Error) {
        if (error.message.includes("الكمية المطلوبة غير متوفرة")) {
          // إرجاع الكمية للقيمة الآمنة
          const safeQuantity = Math.min(quantity, product.stock || 1);
          setQuantity(safeQuantity);
        }
      }
    } finally {
      setIsAdding(false);
    }
  }, [
    addToCart,
    updateCartQuantity,
    product,
    productId,
    quantity,
    isItemInCart,
    cartItem,
    loading,
    isAdding,
    cartLoading,
    fetchCart,
  ]);

  // معالج الشراء المباشر
  const handleBuyNow = useCallback(async () => {
    if (!onBuyNow || loading || isAdding || cartLoading) return;

    try {
      setIsAdding(true);

      // تأكد من وجود المنتج في السلة بالكمية المطلوبة
      if (!isItemInCart) {
        await addToCart(productId, quantity);
      } else if (cartItem && cartItem.quantity !== quantity) {
        await updateCartQuantity(cartItem.cart_item_id, quantity);
      }

      // الانتقال للدفع
      await onBuyNow(product.id!, quantity);
    } catch (error) {
      console.error("خطأ في الشراء المباشر:", error);
    } finally {
      setIsAdding(false);
    }
  }, [
    onBuyNow,
    addToCart,
    updateCartQuantity,
    product,
    productId,
    quantity,
    isItemInCart,
    cartItem,
    loading,
    isAdding,
    cartLoading,
  ]);

  // حسابات حالة الأزرار
  const isOutOfStock = !product.inStock;
  const maxQuantity = product.stock || 20;
  const isProcessing = isAdding || cartLoading;

  return (
    <div
      className={`space-y-3 ${className}`}
      dir="rtl"
      role="region"
      aria-label="تفاصيل المنتج"
    >
      {/* شارة المنتج في السلة */}
      {isItemInCart && (
        <div
          className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 w-fit"
          role="status"
          aria-live="polite"
        >
          <Check className="w-4 h-4 flex-shrink-0" />
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
        rating={product.rating ?? 0}
        reviewCount={product.reviewCount ?? 0}
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
        <div className="flex items-center gap-3 flex-wrap">
          <label
            className="text-sm font-medium whitespace-nowrap"
            htmlFor="quantity-control"
          >
            الكمية:
          </label>
          <QuantityControl
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            min={1}
            max={maxQuantity}
            disabled={isOutOfStock || isProcessing}
            aria-label={`تحديد كمية المنتج: ${product.nameAr || product.name}`}
          />
          {isItemInCart && (
            <span className="text-xs text-teal-600 whitespace-nowrap">
              (في السلة: {cartQuantity})
            </span>
          )}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="space-y-3 py-2">
        <Button
          onClick={handleAddToCart}
          disabled={isProcessing || isOutOfStock}
          loading={isProcessing}
          variant={showSuccess ? "success" : "primary"}
          size="lg"
          className="w-full"
          startIcon={
            showSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )
          }
          text={
            isOutOfStock
              ? "غير متوفر"
              : showSuccess
              ? "تمت الإضافة ✓"
              : isItemInCart
              ? "تحديث الكمية"
              : isProcessing
              ? "جاري الإضافة..."
              : "إضافة للسلة"
          }
          aria-label={
            isOutOfStock
              ? "هذا المنتج غير متوفر حالياً"
              : showSuccess
              ? "تمت إضافة المنتج للسلة بنجاح"
              : isItemInCart
              ? "تحديث كمية المنتج في السلة"
              : "إضافة هذا المنتج للسلة"
          }
        />

        {onBuyNow && (
          <Button
            onClick={handleBuyNow}
            disabled={isProcessing || isOutOfStock}
            loading={isProcessing}
            variant="outline"
            size="lg"
            className="w-full"
            text={
              isOutOfStock
                ? "غير متوفر"
                : isProcessing
                ? "جاري التحضير..."
                : "اشتري الآن"
            }
            aria-label={
              isOutOfStock
                ? "هذا المنتج غير متوفر حالياً"
                : "شراء هذا المنتج الآن والانتقال إلى صفحة الدفع"
            }
          />
        )}
      </div>

      {/* تحذيرات المخزون */}
      {product.stock !== undefined &&
        product.stock <= 5 &&
        product.stock > 0 && (
          <div
            className="bg-amber-100 text-amber-800 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            متبقي {product.stock} قطع فقط — اطلب الآن قبل نفاد الكمية!
          </div>
        )}

      {/* حالة نفاذ المخزون */}
      {isOutOfStock && (
        <div
          className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          هذا المنتج غير متوفر حاليًا. يمكنك إضافته إلى قائمة الرغبات أو مراجعته
          لاحقًا.
        </div>
      )}

      {/* حالة التحميل */}
      {cartLoading && (
        <div className="text-center text-sm text-gray-500">
          جاري تحديث بيانات السلة...
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
