"use client";

import React, { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { createReview, generateSessionId } from "@/api/stores";
import { useToast } from "@/hooks/useToast";
import { useThemeContext } from "@/contexts/ThemeContext";

interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
  rating?: number; // المتوسط العام من الخادم
  reviewsCount?: number;
}

interface StoreCardProps {
  store: Store;
  onViewDetails: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onViewDetails }) => {
  const { showToast } = useToast();
  const { theme, isDark, isLight } = useThemeContext();

  const handleVisitStore = () => {
    onViewDetails(store);
  };

  // دالة للحصول على ألوان وأنماط الثيم
  const getThemeClasses = () => {
    return {
      // خلفية البطاقة الرئيسية
      cardBg: isDark 
        ? "bg-gray-800 border border-gray-700" 
        : "bg-white border border-gray-100",
      
      // خلفية البطاقة مع الظلال
      cardShadow: isDark 
        ? "shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/40" 
        : "shadow-sm hover:shadow-lg shadow-gray-500/10",
      
      // نص العنوان
      titleText: isDark 
        ? "text-white group-hover:text-teal-400" 
        : "text-gray-800 group-hover:text-teal-600",
      
      // النص الثانوي
      secondaryText: isDark 
        ? "text-gray-300" 
        : "text-gray-500",
      
      // النص المكتوم
      mutedText: isDark 
        ? "text-gray-400" 
        : "text-gray-400",
      
      // خلفية شارة التقييم
      ratingBadge: isDark 
        ? "bg-gray-800/95 border border-gray-600 backdrop-blur-sm" 
        : "bg-white/95 backdrop-blur-sm",
      
      // نص شارة التقييم
      ratingText: isDark 
        ? "text-gray-200" 
        : "text-gray-700",
      
      // زر زيارة المتجر
      visitButton: isDark 
        ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25" 
        : "bg-teal-500 hover:bg-teal-600 text-white shadow-md",
      
      // النجوم غير المملوءة
      emptyStar: isDark 
        ? "text-gray-500 hover:text-yellow-300" 
        : "text-gray-300 hover:text-yellow-300",
      
      // النجوم المملوءة
      filledStar: "fill-yellow-400 text-yellow-400",
      
      // نص رسائل الحالة
      errorText: "text-red-500",
      successText: isDark 
        ? "text-teal-400" 
        : "text-teal-600",
      
      // حدود التركيز
      focusRing: isDark 
        ? "focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800" 
        : "focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white",
    };
  };

  const themeClasses = getThemeClasses();

  // جلب التقييم الشخصي من localStorage
  const getUserRating = (storeId: number): number | null => {
    if (typeof window === "undefined") return null;
    const key = `userReview_${storeId}`;
    const saved = localStorage.getItem(key);
    return saved ? parseFloat(saved) : null;
  };

  const [userRating, setUserRating] = useState<number | null>(getUserRating(store.id));
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // عند النقر على نجمة — إرسال التقييم للخادم مع session_id فقط
  const handleStarClick = async (rating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createReview({
        store_id: store.id,
        rating,
        session_id: generateSessionId(),
      });

      setUserRating(rating);
      localStorage.setItem(`userReview_${store.id}`, rating.toString());

      showToast(`تم تقييم ${store.name} بـ ${rating} نجوم`, 'success');
      console.log("✅ تم إرسال التقييم بنجاح:", rating);
    } catch (error: any) {
      console.error("❌ فشل إرسال التقييم:", error);
      setSubmitError("فشل إرسال التقييم. حاول مرة أخرى.");
      showToast("فشل إرسال التقييم. حاول مرة أخرى.", 'error');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className={`${themeClasses.cardBg} ${themeClasses.cardShadow} rounded-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full backdrop-blur-sm`}>
      <div className="relative overflow-hidden">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.warn("فشل تحميل الصورة:", store.image);
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
          }}
        />

        {/* المتوسط العام في الزاوية اليمنى العليا */}
        {store.rating && store.rating > 0 && (
          <div className={`absolute top-3 right-3 ${themeClasses.ratingBadge} px-2 py-1 rounded-full shadow-md z-10 transition-colors duration-300`}>
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${themeClasses.ratingText}`}>
                {store.rating.toFixed(1)}
              </span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {/* مؤشر الثيم في الزاوية اليسرى */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`${themeClasses.ratingBadge} px-2 py-1 rounded-full shadow-md`}>
            <span className={`text-xs ${themeClasses.ratingText}`}>
              {isDark ? "🌙" : "☀️"}
            </span>
          </div>
        </div>
      </div>

      {/* المحتوى مع flex-grow لجعل الزر في الأسفل دائماً */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`text-xl font-bold ${themeClasses.titleText} mb-2 transition-colors duration-300`}>
          {store.name}
        </h3>

        <div className={`flex items-center ${themeClasses.secondaryText} mb-4 transition-colors duration-300`}>
          <MapPin className="w-4 h-4 ml-1" />
          <span className="text-sm">{store.location}</span>
        </div>

        {/* التقييم الشخصي التفاعلي — 5 نجوم قابلة للنقر */}
        <div className="mb-3">
          <div
            className={`flex items-center text-sm ${themeClasses.secondaryText} cursor-pointer transition-colors duration-300`}
            onMouseLeave={handleMouseLeave}
          >
            {[...Array(5)].map((_, i) => {
              const starIndex = i + 1;
              const isFilled =
                (hoverRating !== null ? hoverRating : userRating || 0) >= starIndex;
              const isEmpty = !isFilled;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  disabled={isSubmitting}
                  aria-label={`تقييم بـ ${starIndex} نجوم`}
                  className={`${themeClasses.focusRing} focus:outline-none rounded-full transition-all duration-150 disabled:cursor-not-allowed hover:scale-110 active:scale-95`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFilled
                        ? themeClasses.filledStar
                        : themeClasses.emptyStar
                    } transition-all duration-200 ${
                      isSubmitting ? "opacity-50" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* عرض خطأ إذا وقع */}
          {submitError && (
            <p className={`${themeClasses.errorText} text-xs mt-1 transition-colors duration-300`}>
              {submitError}
            </p>
          )}

          {/* عرض تأكيد التقييم أثناء التحميل */}
          {isSubmitting && (
            <div className="flex items-center mt-1">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-500 mr-2"></div>
              <p className={`${themeClasses.successText} text-xs transition-colors duration-300`}>
                جاري إرسال تقييمك...
              </p>
            </div>
          )}
        </div>

        {/* المساحة المتمددة لدفع الزر للأسفل */}
        <div className="flex-grow"></div>

        {/* منطقة الزر والتقييم - مثبتة في الأسفل */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex-grow">
            {store.rating && store.rating > 0 ? (
              <span className={`text-sm ${themeClasses.mutedText} transition-colors duration-300`}>
                ({store.reviewsCount} تقييم)
              </span>
            ) : (
              <span className={`text-sm ${themeClasses.mutedText} transition-colors duration-300`}>
                لا يوجد تقييم بعد
              </span>
            )}
          </div>

          <button
            onClick={handleVisitStore}
            className={`${themeClasses.visitButton} px-6 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-lg active:scale-95 transform flex-shrink-0 hover:scale-105`}
          >
            زيارة المتجر
          </button>
        </div>
      </div>

      {/* تأثير توهج خفيف عند hover في الوضع المظلم */}
      {isDark && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      )}
    </div>
  );
};

export default StoreCard;