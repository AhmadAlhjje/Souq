"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check, AlertTriangle, Star } from "lucide-react";
import Card from "../atoms/Card";
import { SimpleStarRating } from "../molecules/StarRating";
import { SimplePriceDisplay } from "../molecules/PriceDisplay";
import { CompactQuantityCounter } from "../molecules/QuantityCounter";
import { Product } from "@/api/storeProduct";
import { useSessionContext } from "@/components/SessionProvider";
import { useToast } from "@/hooks/useToast";
import { createReview, generateSessionId } from "@/api/stores";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // حالات التقييم الجديدة
  const [userRating, setUserRating] = useState<number | null>(
    getUserRating(product.id)
  );
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const router = useRouter();
  const { sessionId } = useSessionContext();
  const { showToast } = useToast();

  // Constants
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // جلب التقييم الشخصي من localStorage
  function getUserRating(productId: number): number | null {
    if (typeof window === "undefined") return null;
    const key = `userProductReview_${productId}`;
    const saved = localStorage.getItem(key);
    return saved ? parseFloat(saved) : null;
  }

  // عند النقر على نجمة المنتج — إرسال التقييم للخادم
  const handleStarClick = async (rating: number) => {
    if (isSubmittingRating) return;

    setIsSubmittingRating(true);
    setRatingError(null);

    try {
      await createReview({
        product_id: product.id,
        rating,
        session_id: sessionId || generateSessionId(),
      });

      setUserRating(rating);
      localStorage.setItem(
        `userProductReview_${product.id}`,
        rating.toString()
      );

      showToast(`تم تقييم ${product.name} بـ ${rating} نجوم`, "success");
      console.log("تم إرسال تقييم المنتج بنجاح:", rating);
    } catch (error: any) {
      console.error("فشل إرسال تقييم المنتج:", error);
      setRatingError("فشل إرسال التقييم. حاول مرة أخرى.");
      showToast("فشل إرسال التقييم. حاول مرة أخرى.", "error");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // عند التمرير فوق النجمة
  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  // عند مغادرة النجوم
  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const handleQuantityIncrease = () => {
    setLocalQuantity((prev) => prev + 1);
  };

  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity((prev) => prev - 1);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }

    setIsLoadingDetail(true);

    setTimeout(() => {
      router.push(`/products/${product.id}`);
    }, 300);
  };

  const handleAddToCartClick = async () => {
    if (!sessionId) {
      showToast("جلسة غير صحيحة. يرجى إعادة تحميل الصفحة", "error");
      return;
    }

    if (!product.inStock || product.stock <= 0) {
      showToast("المنتج غير متوفر حالياً", "warning");
      return;
    }

    try {
      setIsAdding(true);

      console.log("Adding product to cart:", {
        productId: product.id,
        quantity: localQuantity,
        sessionId: sessionId,
      });

      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId,
        },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: product.id,
          quantity: localQuantity,
        }),
      });

      console.log("Add to cart response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Add to cart error:", errorData);
        throw new Error(` فشل في إضافة المنتج بسبب نفاد الكمية  `);
      }

      const result = await response.json();
      console.log("Add to cart success:", result);

      showToast(
        `تم إضافة ${localQuantity} من ${product.name} للسلة`,
        "success"
      );

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      setLocalQuantity(1);
    } catch (error) {
      console.error("خطأ في إضافة المنتج للسلة:", error);

      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ غير متوقع";

      showToast(errorMessage, "error");
    } finally {
      setIsAdding(false);
    }
  };

  // حل مشكلة الخصائص المفقودة - استخدام original_price بدلاً من originalPrice
  const calculateDiscountPercentage = (
    originalPrice?: number,
    salePrice?: number
  ): number => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const truncateText = (text: string, maxLength: number = 80): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const isOutOfStock =
    !product.inStock || product.stock <= 0 || product.status === "out_of_stock";
  const isLowStock =
    product.stock > 0 && (product.stock <= 5 || product.status === "low_stock");

  return (
    <Card hover className="overflow-hidden group relative">
      {isOutOfStock && (
        <div className="absolute inset-0 bg-gray-500/50 z-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-3 text-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <span className="text-sm font-bold text-red-600">غير متوفر</span>
          </div>
        </div>
      )}

      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover"
          onError={(e) => {
            console.warn("فشل تحميل الصورة:", product.image);
            (
              e.target as HTMLImageElement
            ).outerHTML = `<div style="padding:8px;color:red;font-size:12px">تعذر تحميل:<br>${product.image}</div>`;
          }}
        />

        {product.salePrice &&
          product.originalPrice &&
          calculateDiscountPercentage(
            product.originalPrice,
            product.salePrice
          ) > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{calculateDiscountPercentage(product.price, product.salePrice)}%
            </div>
          )}

        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            جديد
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            آخر {product.stock}
          </div>
        )}
      </div>

      <div className="p-2 text-right">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.nameAr || product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">
            {truncateText(product.descriptionAr || product.description, 60)}
          </p>
        )}

        {/* التقييم من الخادم + التقييم الشخصي التفاعلي في مكان واحد */}
        <div className="mb-2">
          <div
            className="flex items-center justify-end cursor-pointer"
            onMouseLeave={handleMouseLeave}
          >
            {[...Array(5)].map((_, i) => {
              const starIndex = i + 1;
              const isFilled =
                (hoverRating !== null ? hoverRating : userRating || 0) >=
                starIndex;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  disabled={isSubmittingRating}
                  aria-label={`تقييم بـ ${starIndex} نجوم`}
                  className="focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-full transition-all duration-150 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFilled
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } hover:fill-yellow-300 hover:text-yellow-300 ${
                      isSubmittingRating ? "opacity-50" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* عرض التقييم العام مع عدد المراجعات */}
          <div className="flex items-center justify-end mt-1">
            {product.rating && product.rating > 0 ? (
              <span className="text-xs text-gray-500">
                {product.rating.toFixed(1)} ({product.reviewCount} تقييم)
              </span>
            ) : (
              <span className="text-xs text-gray-400">لا يوجد تقييم بعد</span>
            )}
          </div>

          {/* عرض خطأ التقييم */}
          {ratingError && (
            <p className="text-red-500 text-xs mt-1">{ratingError}</p>
          )}

          {/* عرض تأكيد التقييم أثناء التحميل */}
          {isSubmittingRating && (
            <p className="text-teal-600 text-xs mt-1">جاري إرسال تقييمك...</p>
          )}
        </div>

        <div className="mb-2">
          <SimplePriceDisplay
            originalPrice={product.price || product.price}
            salePrice={product.salePrice}
          />
        </div>

        <div className="mb-2 text-xs text-center">
          {isOutOfStock ? (
            <span className="text-red-600 font-bold">غير متوفر</span>
          ) : isLowStock ? (
            <span className="text-orange-600 font-bold">
              كمية محدودة: {product.stock}
            </span>
          ) : (
            <span className="text-green-600">متوفر ({product.stock})</span>
          )}
        </div>

        {!isOutOfStock && (
          <div className="mb-2 flex items-center justify-end">
            <CompactQuantityCounter
              quantity={localQuantity}
              onIncrease={handleQuantityIncrease}
              onDecrease={handleQuantityDecrease}
              min={1}
              max={product.stock}
            />
          </div>
        )}

        <div className="flex space-x-1 gap-2">
          <button
            onClick={handleViewDetails}
            disabled={isLoadingDetail}
            className={`flex-1 border border-teal-800 text-teal-800 hover:bg-teal-50 text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1 ${
              isLoadingDetail ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoadingDetail ? (
              <>
                <div className="w-3 h-3 border border-teal-800 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>التفاصيل</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddToCartClick}
            disabled={isAdding || isOutOfStock}
            className={`flex-1 text-white text-xs py-1.5 rounded-md transition-colors flex items-center justify-center space-x-1 ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : showSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-teal-800 hover:bg-teal-900"
            } ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
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
