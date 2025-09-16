// components/templates/ProductDetailsPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ArrowRight,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  MessageSquare,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useSessionContext } from '@/components/SessionProvider';
import { useToast } from '@/hooks/useToast';
import { createReview, generateSessionId } from "@/api/stores";

interface ProductDetailsPageProps {
  product: Product;
  onBackToProducts?: () => void;
  onBuyNow?: (pid: string | number, qty: number) => Promise<void>;
  loading?: boolean;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBackToProducts,
  onBuyNow,
  loading: externalLoading,
}) => {
  const router = useRouter();
  const { sessionId } = useSessionContext();
  const { showToast } = useToast();
  const { 
    addToCart, 
    cartData, 
    isLoading: cartLoading,
    fetchCart
  } = useCart();

  // State للمنتج والسلة
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // ✅ State مبسط للتقييم والتعليق
  const [reviewState, setReviewState] = useState({
    // التقييم السريع (النجوم العلوية)
    quickRating: getUserRating(product.id),
    isSubmittingQuickRating: false,
    quickRatingError: null as string | null,
    
    // نموذج التعليق البسيط
    reviewerName: '',
    comment: '',
    isSubmittingReview: false,
    reviewError: null as string | null,
  });

  // جلب التقييم السابق من localStorage
  function getUserRating(productId: number): number | null {
    if (typeof window === "undefined") return null;
    const key = `userProductReview_${productId}`;
    const saved = localStorage.getItem(key);
    return saved ? parseFloat(saved) : null;
  }

  // ✅ التقييم السريع (النجوم العلوية) - تقييم فقط بدون تعليق
  const handleQuickRating = async (rating: number) => {
    if (reviewState.isSubmittingQuickRating) return;
    
    setReviewState(prev => ({
      ...prev,
      isSubmittingQuickRating: true,
      quickRatingError: null
    }));

    try {
      await createReview({
        product_id: product.id,
        rating,
        session_id: sessionId || generateSessionId(),
      });
      
      setReviewState(prev => ({
        ...prev,
        quickRating: rating
      }));
      
      localStorage.setItem(`userProductReview_${product.id}`, rating.toString());
      showToast(`تم تقييم المنتج بـ ${rating} نجوم`, 'success');
      
    } catch (error: any) {
      console.error("فشل التقييم السريع:", error);
      setReviewState(prev => ({
        ...prev,
        quickRatingError: "فشل إرسال التقييم. حاول مرة أخرى."
      }));
      showToast("فشل إرسال التقييم. حاول مرة أخرى.", 'error');
    } finally {
      setReviewState(prev => ({
        ...prev,
        isSubmittingQuickRating: false
      }));
    }
  };

  // ✅ إرسال التعليق فقط (بدون تقييم داخلي)
  const handleSubmitReview = async () => {
    if (reviewState.isSubmittingReview) return;

    // التحقق من الحقول المطلوبة
    if (!reviewState.comment.trim()) {
      setReviewState(prev => ({
        ...prev,
        reviewError: "يرجى كتابة تعليق"
      }));
      return;
    }
    
    if (!reviewState.reviewerName.trim()) {
      setReviewState(prev => ({
        ...prev,
        reviewError: "يرجى إدخال اسمك"
      }));
      return;
    }

    setReviewState(prev => ({
      ...prev,
      isSubmittingReview: true,
      reviewError: null
    }));

    try {
      const reviewData: any = {
        product_id: product.id,
        session_id: sessionId || generateSessionId(),
        reviewer_name: reviewState.reviewerName.trim(),
        comment: reviewState.comment.trim(),
      };

      await createReview(reviewData);

      // إعادة تعيين النموذج
      setReviewState(prev => ({
        ...prev,
        reviewerName: '',
        comment: ''
      }));

      showToast("تم إرسال تعليقك بنجاح", 'success');
      
    } catch (error: any) {
      console.error("فشل إرسال التعليق:", error);
      setReviewState(prev => ({
        ...prev,
        reviewError: "فشل إرسال التعليق. حاول مرة أخرى."
      }));
      showToast("فشل إرسال التعليق. حاول مرة أخرى.", 'error');
    } finally {
      setReviewState(prev => ({
        ...prev,
        isSubmittingReview: false
      }));
    }
  };

  const renderQuickStars = () => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        const starIndex = i + 1;
        const isFilled = (reviewState.quickRating || 0) >= starIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => handleQuickRating(starIndex)}
            disabled={reviewState.isSubmittingQuickRating}
            aria-label={`تقييم بـ ${starIndex} نجوم`}
            className="focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-full transition-all duration-150 disabled:cursor-not-allowed"
          >
            <Star
              className={`w-4 h-4 ${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } hover:fill-yellow-300 hover:text-yellow-300 ${
                reviewState.isSubmittingQuickRating ? "opacity-50" : ""
              }`}
            />
          </button>
        );
      })}
    </div>
  );

  // باقي الدوال (معالجة الصور، السلة، إلخ) تبقى كما هي...
  const getProductImages = () => {
    if ((product as any).images) {
      try {
        const parsed = JSON.parse((product as any).images);
        const images = Array.isArray(parsed) ? parsed : [(product as any).images];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
        const imageUrls = images.map((img: string) => {
          const cleanImg = img.replace(/^\/uploads\//, "");
          return `${baseUrl}/uploads/${cleanImg}`;
        });
        return imageUrls;
      } catch (error) {
        console.error("خطأ في تحليل صور المنتج:", error);
      }
    }
    const mainImage = product.image || "/images/default-product.jpg";
    return [mainImage, mainImage, mainImage, mainImage];
  };

  const productImages = getProductImages();
  const isInCart = cartData?.items?.some(item => item.product_id === product.id) || false;
  const cartItem = cartData?.items?.find(item => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  // دوال السلة والشراء (تبقى كما هي)
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 20)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!sessionId) {
      showToast('يرجى تسجيل الدخول أولاً', 'error');
      return;
    }
    if (!product.inStock || (product.stock && product.stock <= 0)) {
      showToast('المنتج غير متوفر', 'error');
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(product.id, quantity);
      setShowSuccess(true);
      showToast(`تم إضافة ${quantity} من ${product.nameAr || product.name} للسلة`, 'success');
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error: any) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
      showToast( '  فشل في إضافة المنتج للسلة بسبب نفاد الكمية ', 'error');
    } finally {
      setIsAdding(false);
    }
  };

const handleBuyNow = async () => {
  try {
    if (onBuyNow) {
      await onBuyNow(product.id, quantity);
      return;
    }
    if (!isInCart) {
      await handleAddToCart();
    }
    setTimeout(() => {
      router.push('/shipping'); // ✅ تغيير من /Shipping إلى /shipping
    }, 500);
  } catch (error) {
    console.error("خطأ في الشراء المباشر:", error);
    showToast('حدث خطأ أثناء تحضير الطلب', 'error');
  }
};

  const handleBackToProducts = () => {
    if (onBackToProducts) {
      onBackToProducts();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen mt-10 text-gray-800 font-cairo" dir="rtl">
      <div className="mx-auto px-6 py-12 max-w-6xl">
        <div className="rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          
          {/* العودة للخلف */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToProducts}
              className="text-teal-600 flex items-center gap-2 text-lg hover:text-teal-700 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للخلف
            </button>
            {isInCart && (
              <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                المنتج في السلة ({cartQuantity} قطعة)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
            
            {/* خط فاصل */}
            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block w-px bg-gradient-to-b from-transparent via-teal-600 to-transparent" />
            
            {/* القسم 1: التفاصيل */}
            <div className="space-y-3 lg:order-1 pr-4">
              
              {/* اسم المنتج */}
              <div className="flex items-start justify-between">
                <h1 className="font-bold text-gray-900 text-lg leading-relaxed flex-1">
                  {product.nameAr || product.name}
                </h1>
              </div>
              
              {/* ✅ التقييم السريع المحسن */}
              <div className="py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">تقييمك السريع:</span>
                  {renderQuickStars()}
                  {reviewState.isSubmittingQuickRating && (
                    <span className="text-xs text-teal-600">جاري الإرسال...</span>
                  )}
                </div>
                {reviewState.quickRatingError && (
                  <p className="text-red-500 text-xs mt-1">{reviewState.quickRatingError}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  انقر على النجوم للتقييم السريع
                </p>
              </div>

              {/* السعر */}
              <div className="font-bold text-teal-600 py-2 text-base">
                <span>
                  {product.salePrice ? product.salePrice : product.originalPrice || product.price}
                </span>
                <span className="text-gray-500 mr-1">ر.س</span>
                {product.salePrice && product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-sm mr-2">
                      {product.originalPrice} ر.س
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">
                      وفر {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* الوصف */}
              <div className="py-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">وصف المنتج</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.descriptionAr || product.description}
                </p>
              </div>

              {/* المخزون */}
              {product.stock && product.stock > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">المتوفر في المخزون:</span>
                    <span className={`font-medium ${
                      product.stock > 10 ? "text-green-600" :
                      product.stock > 5 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {product.stock} قطعة
                    </span>
                  </div>
                </div>
              )}

              {/* الكمية */}
              <div className="py-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">الكمية:</label>
                  <div className="flex items-center border border-gray-300 rounded text-center w-24">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 bg-gray-50 w-8 text-sm">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 20)}
                      className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {isInCart && (
                    <span className="text-xs text-teal-600">(في السلة: {cartQuantity})</span>
                  )}
                </div>
              </div>

              {/* أزرار الشراء */}
              <div className="space-y-3 py-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !product.inStock || cartLoading}
                  className={`w-full py-3 rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 ${
                    !product.inStock
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : showSuccess
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  } ${isAdding || cartLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {!product.inStock ? (
                    "غير متوفر"
                  ) : showSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      تمت الإضافة
                    </>
                  ) : isAdding || cartLoading ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {isInCart ? "تحديث الكمية" : "إضافة للسلة"}
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={isAdding || !product.inStock || cartLoading}
                  className="w-full border-2 border-teal-600 text-teal-600 py-2.5 rounded text-sm font-medium hover:bg-teal-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!product.inStock
                    ? "غير متوفر"
                    : isAdding || cartLoading
                    ? "جاري التحضير..."
                    : "اشتري الآن"}
                </button>
              </div>

              {/* ✅ قسم التعليق المبسط */}
              <div className="py-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">اترك تعليقاً</h3>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="الاسم"
                    value={reviewState.reviewerName}
                    onChange={(e) => setReviewState(prev => ({ 
                      ...prev, 
                      reviewerName: e.target.value 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                <textarea
                  placeholder="اكتب تعليقك هنا..."
                  value={reviewState.comment}
                  onChange={(e) => setReviewState(prev => ({ 
                    ...prev, 
                    comment: e.target.value 
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 mb-3"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewState.isSubmittingReview || !reviewState.comment.trim() || !reviewState.reviewerName.trim()}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {reviewState.isSubmittingReview ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      إضافة التعليق
                    </>
                  )}
                </button>

                {reviewState.reviewError && (
                  <p className="text-red-500 text-xs mt-2">{reviewState.reviewError}</p>
                )}
              </div>
            </div>

            {/* القسم 2: الصور */}
            <div className="space-y-6 lg:order-2 pl-4">
              {/* الصورة الرئيسية */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
                <div
                  className="aspect-square relative bg-gray-100 w-full cursor-pointer group"
                  style={{ minHeight: "250px", maxHeight: "250px" }}
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <img
                    src={productImages[selectedImage] || "/images/default-product.jpg"}
                    alt={product.nameAr || product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(prev => ({ ...prev, [selectedImage]: true }))}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* الشارات */}
                  {product.salePrice && product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
                      -{Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {product.isNew && !product.salePrice && (
                    <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded">
                      جديد
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium">
                        نفد المخزون
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* الصور المصغرة */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const hasImage = idx < productImages.length;
                    const isSelected = selectedImage === idx;
                    if (!hasImage) {
                      return (
                        <div
                          key={`placeholder-${idx}`}
                          className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-default"
                        >
                        </div>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 hover:border-teal-400 transition-all duration-200 transform hover:scale-105 ${
                          isSelected ? "border-teal-500 ring-2 ring-teal-200" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={productImages[idx] || "/images/default-product.jpg"}
                          alt={`صورة ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(prev => ({ ...prev, [idx]: true }))}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المتجر:</span>
                  <span className="font-medium">{product.brandAr || product.brand || "غير محدد"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التصنيف:</span>
                  <span className="font-medium">{product.categoryAr || product.category}</span>
                </div>
                {product.sales && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد المبيعات:</span>
                    <span className="font-medium">{product.sales}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد التقييمات:</span>
                  <span className="font-medium">{product.reviewCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;