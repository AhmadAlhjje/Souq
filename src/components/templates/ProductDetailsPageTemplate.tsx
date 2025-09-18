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
  ZoomIn,
  MessageSquare,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import { useSessionContext } from '@/components/SessionProvider';
import { useToast } from '@/hooks/useToast';
import { createReview, generateSessionId } from "@/api/stores";
import { useThemeContext } from '@/contexts/ThemeContext'; // ✅ استيراد الثيم

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
  const { isDark } = useThemeContext(); // ✅ استخدام الثيم

  // State للمنتج والسلة
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // جلب التقييم السابق من localStorage
  function getUserRating(productId: number | undefined): number | null {
    if (typeof window === "undefined" || !productId) return null;
    const key = `userProductReview_${productId}`;
    const saved = localStorage.getItem(key);
    return saved ? parseFloat(saved) : null;
  }

  // دالة لجلب التعليقات
  const getProductComments = () => {
    const comments = (product as any)?.reviewsData?.comments || [];
    console.log('📝 التعليقات المجلبة:', comments);
    return comments
      .filter((comment: any) => comment.comment && comment.comment.trim() !== '')
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // State مبسط للتقييم والتعليق
  const [reviewState, setReviewState] = useState({
    quickRating: getUserRating(product.id),
    isSubmittingQuickRating: false,
    quickRatingError: null as string | null,
    reviewerName: '',
    comment: '',
    isSubmittingReview: false,
    reviewError: null as string | null,
  });

  const productComments = getProductComments();
  const displayedComments = showAllComments ? productComments : productComments.slice(0, 3);

  // التقييم السريع (النجوم العلوية)
  const handleQuickRating = async (rating: number) => {
    if (reviewState.isSubmittingQuickRating || !product.id) return;
    
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

  // إرسال التعليق مع إعادة تحميل البيانات
  const handleSubmitReview = async () => {
    if (reviewState.isSubmittingReview || !product.id) return;

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

      console.log('🔄 إرسال التعليق:', reviewData);
      await createReview(reviewData);

      setReviewState(prev => ({
        ...prev,
        reviewerName: '',
        comment: ''
      }));

      showToast("تم إرسال تعليقك بنجاح، جاري تحديث الصفحة...", 'success');
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
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
                  : isDark
                    ? "text-gray-600" 
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

  // معالجة الصور
  const getProductImages = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
    
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => {
        if (img.startsWith("http")) return img;
        else if (img.startsWith("/uploads")) return `${baseUrl}${img}`;
        else return `${baseUrl}/uploads/${img}`;
      });
    }
    
    if (typeof (product as any).images === 'string') {
      try {
        const parsed = JSON.parse((product as any).images);
        const images = Array.isArray(parsed) ? parsed : [parsed];
        return images.map((img: string) => {
          if (img.startsWith("http")) return img;
          else if (img.startsWith("/uploads")) return `${baseUrl}${img}`;
          else return `${baseUrl}/uploads/${img}`;
        });
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

  // دوال السلة والشراء
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
    if (!product.id) {
      showToast('خطأ في بيانات المنتج', 'error');
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
      showToast('فشل في إضافة المنتج للسلة بسبب نفاد الكمية', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product.id) {
      showToast('خطأ في بيانات المنتج', 'error');
      return;
    }

    try {
      if (onBuyNow) {
        await onBuyNow(product.id, quantity);
        return;
      }
      if (!isInCart) {
        await handleAddToCart();
      }
      setTimeout(() => {
        router.push('/shipping');
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
    <div 
      className={`min-h-screen mt-10 font-cairo ${isDark ? 'text-gray-200' : 'text-gray-800'}`} 
      dir="rtl"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)' 
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #F1F3F4 100%)',
      }}
    >
      <div className="mx-auto px-6 py-12 max-w-6xl">
        <div 
          className={`rounded-2xl p-8 ${
            isDark 
              ? 'bg-gray-900 shadow-lg shadow-black/30 border border-gray-800' 
              : 'bg-white shadow-lg shadow-gray-200/50'
          }`}
        >
          
          {/* العودة للخلف */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToProducts}
              className={`flex items-center gap-2 text-lg transition-colors duration-200 ${
                isDark ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'
              }`}
            >
              <ArrowRight className="w-5 h-5" />
              العودة للخلف
            </button>
            {isInCart && (
              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                isDark 
                  ? 'bg-teal-900/50 text-teal-300 border border-teal-800' 
                  : 'bg-teal-100 text-teal-800'
              }`}>
                <Check className="w-4 h-4" />
                المنتج في السلة ({cartQuantity} قطعة)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
            
            {/* خط فاصل */}
            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block w-px bg-gradient-to-b from-transparent via-teal-500 to-transparent" />
            
            {/* القسم 1: التفاصيل */}
            <div className="space-y-3 lg:order-1 pr-4">
              
              {/* اسم المنتج */}
              <div className="flex items-start justify-between">
                <h1 className={`font-bold text-lg leading-relaxed flex-1 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.nameAr || product.name}
                </h1>
              </div>
              
              {/* التقييم السريع المحسن */}
              <div className={`py-3 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>تقييمك السريع:</span>
                  {renderQuickStars()}
                  {reviewState.isSubmittingQuickRating && (
                    <span className="text-xs text-teal-400">جاري الإرسال...</span>
                  )}
                </div>
                {reviewState.quickRatingError && (
                  <p className="text-red-500 text-xs mt-1">{reviewState.quickRatingError}</p>
                )}
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  انقر على النجوم للتقييم السريع
                </p>
              </div>

              {/* السعر */}
              <div className={`font-bold py-2 text-base ${
                isDark ? 'text-teal-400' : 'text-teal-600'
              }`}>
                <span>
                  {product.salePrice ? product.salePrice : product.originalPrice || product.price}
                </span>
                <span className={`mr-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>$</span>
                {product.salePrice && product.originalPrice && (
                  <>
                    <span className={`line-through text-sm mr-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {product.originalPrice} $
                    </span>
                    <span className={`text-xs px-2 py-1 rounded mr-2 ${
                      isDark ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-red-100 text-red-600'
                    }`}>
                      وفر {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* الوصف */}
              <div className={`py-3 ${
                isDark ? 'border-t border-gray-700' : ''
              }`}>
                <h3 className={`font-semibold mb-2 text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>وصف المنتج</h3>
                <p className={`leading-relaxed text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {product.descriptionAr || product.description}
                </p>
              </div>

              {/* المخزون */}
              {product.stock && product.stock > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>المتوفر في المخزون:</span>
                    <span className={`font-medium ${
                      product.stock > 10 
                        ? isDark ? "text-green-400" : "text-green-600"
                        : product.stock > 5 
                          ? isDark ? "text-yellow-400" : "text-yellow-600" 
                          : isDark ? "text-red-400" : "text-red-600"
                    }`}>
                      {product.stock} قطعة
                    </span>
                  </div>
                </div>
              )}

              {/* الكمية */}
              <div className="py-2">
                <div className="flex items-center gap-3">
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>الكمية:</label>
                  <div className={`flex items-center rounded text-center w-24 ${
                    isDark ? 'border border-gray-700' : 'border border-gray-300'
                  }`}>
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className={`p-1 transition-colors duration-200 ${
                        isDark 
                          ? 'disabled:opacity-50 hover:bg-gray-800' 
                          : 'disabled:opacity-50 hover:bg-gray-100'
                      }`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={`px-2 py-1 w-8 text-sm ${
                      isDark ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
                    }`}>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.stock || 20)}
                      className={`p-1 transition-colors duration-200 ${
                        isDark 
                          ? 'disabled:opacity-50 hover:bg-gray-800' 
                          : 'disabled:opacity-50 hover:bg-gray-100'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {isInCart && (
                    <span className={`text-xs ${
                      isDark ? 'text-teal-400' : 'text-teal-600'
                    }`}>
                      (في السلة: {cartQuantity})
                    </span>
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
                      ? isDark 
                        ? "bg-gray-700 cursor-not-allowed text-gray-400" 
                        : "bg-gray-400 cursor-not-allowed text-white"
                      : showSuccess
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : isDark
                        ? "bg-teal-700 hover:bg-teal-600 text-white"
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
                  className={`w-full py-2.5 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? 'border-2 border-teal-500 text-teal-400 hover:bg-teal-900/30'
                      : 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {!product.inStock
                    ? "غير متوفر"
                    : isAdding || cartLoading
                    ? "جاري التحضير..."
                    : "اشتري الآن"}
                </button>
              </div>

              {/* قسم التعليق المبسط */}
              <div className={`py-4 ${
                isDark ? 'border-t border-gray-700' : 'border-t border-gray-100'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className={`w-4 h-4 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`} />
                  <h3 className={`font-semibold text-sm ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>اترك تعليقاً</h3>
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
                    className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-teal-500'
                        : 'border border-gray-300 focus:ring-teal-400'
                    }`}
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
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    isDark
                      ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-teal-500'
                      : 'border border-gray-300 focus:ring-teal-400'
                  } mb-3`}
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewState.isSubmittingReview || !reviewState.comment.trim() || !reviewState.reviewerName.trim()}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                    isDark
                      ? 'bg-teal-700 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
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

              {/* قسم عرض التعليقات */}
              {productComments.length > 0 && (
                <div className={`py-6 ${
                  isDark ? 'border-t border-gray-700' : 'border-t border-gray-100'
                }`}>
                  <h3 className={`font-semibold text-lg mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    التعليقات ({productComments.length})
                  </h3>

                  <div className="space-y-4">
                    {displayedComments.map((comment: any) => (
                      <div key={comment.review_id} className={`rounded-lg p-4 ${
                        isDark ? 'bg-gray-800' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-400 text-lg font-medium">
                              {(comment.reviewer_name || 'م').charAt(0)}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {comment.reviewer_name || 'مستخدم مجهول'}
                              </h4>
                              <span className={`text-sm ${
                                isDark ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {comment.time_ago}
                              </span>
                            </div>
                            
                            <p className={`leading-relaxed ${
                              isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {productComments.length > 3 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          isDark
                            ? 'bg-teal-700 hover:bg-teal-600 text-white'
                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                      >
                        {showAllComments 
                          ? 'عرض أقل' 
                          : `عرض المزيد `
                        }
                      </button>
                    </div>
                  )}
                </div>
              )}
              
            </div>

            {/* القسم 2: الصور */}
            <div className="space-y-6 lg:order-2 pl-4">
              {/* الصورة الرئيسية */}
              <div className={`rounded-xl overflow-hidden shadow-lg w-full ${
                isDark ? 'shadow-black/30' : 'shadow-lg'
              }`}>
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
              <div className={`rounded-xl p-4 shadow-sm ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
              }`}>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const hasImage = idx < productImages.length;
                    const isSelected = selectedImage === idx;
                    if (!hasImage) {
                      return (
                        <div
                          key={`placeholder-${idx}`}
                          className={`aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-default ${
                            isDark 
                              ? 'bg-gray-900 border-gray-700' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                        </div>
                      );
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 hover:border-teal-400 transition-all duration-200 transform hover:scale-105 ${
                          isSelected 
                            ? isDark 
                              ? "border-teal-400 ring-2 ring-teal-900/50" 
                              : "border-teal-500 ring-2 ring-teal-200"
                            : isDark 
                              ? "border-gray-700" 
                              : "border-gray-200"
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
              <div className={`rounded-lg p-4 space-y-2 text-sm ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>المتجر:</span>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{product.brandAr || product.brand || "غير محدد"}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>التصنيف:</span>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{product.categoryAr || product.category}</span>
                </div>
                {product.sales && (
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>عدد المبيعات:</span>
                    <span className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{product.sales}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>عدد التقييمات:</span>
                  <span className={`font-medium ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{product.reviewCount}</span>
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