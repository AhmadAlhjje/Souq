"use client";

import React, { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { createReview, generateSessionId } from "@/api/stores";
import { useToast } from "@/hooks/useToast";

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

  const handleVisitStore = () => {
    onViewDetails(store);
  };

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full">
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
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-10">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium text-gray-700">
                {store.rating.toFixed(1)}
              </span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
      </div>

      {/* المحتوى مع flex-grow لجعل الزر في الأسفل دائماً */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
          {store.name}
        </h3>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 ml-1" />
          <span className="text-sm">{store.location}</span>
        </div>

        {/* التقييم الشخصي التفاعلي — 5 نجوم قابلة للنقر */}
        <div className="mb-3">
          <div
            className="flex items-center text-sm text-gray-600 cursor-pointer"
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
                  className="focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-full transition-all duration-150 disabled:cursor-not-allowed"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFilled
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } hover:fill-yellow-300 hover:text-yellow-300 ${
                      isSubmitting ? "opacity-50" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* عرض خطأ إذا وقع */}
          {submitError && (
            <p className="text-red-500 text-xs mt-1">{submitError}</p>
          )}

          {/* عرض تأكيد التقييم أثناء التحميل */}
          {isSubmitting && (
            <p className="text-teal-600 text-xs mt-1">جاري إرسال تقييمك...</p>
          )}
        </div>

        {/* المساحة المتمددة لدفع الزر للأسفل */}
        <div className="flex-grow"></div>

        {/* منطقة الزر والتقييم - مثبتة في الأسفل */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex-grow">
            {store.rating && store.rating > 0 ? (
              <span className="text-sm text-gray-500">
                ({store.reviewsCount} تقييم)
              </span>
            ) : (
              <span className="text-sm text-gray-400">
                لا يوجد تقييم بعد
              </span>
            )}
          </div>

          <button
            onClick={handleVisitStore}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-md active:scale-95 transform flex-shrink-0"
          >
            زيارة المتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;