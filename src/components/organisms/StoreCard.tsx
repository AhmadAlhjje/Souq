"use client";
import React from "react";
import { MapPin, Star } from "lucide-react";

interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
  rating?: number;
  reviewsCount?: number;
}

interface StoreCardProps {
  store: Store;
  onViewDetails: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onViewDetails }) => {
  const handleVisitStore = () => {
    onViewDetails(store);
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
        {/* عرض التقييم فقط إذا كان موجود وأكبر من 0 */}
        {store.rating && store.rating > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                {store.rating.toFixed(1)}
              </span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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

        {/* المساحة المتمددة لدفع الزر للأسفل */}
        <div className="flex-grow"></div>

        {/* منطقة الزر والتقييم - مثبتة في الأسفل */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex-grow">
            {store.rating && store.rating > 0 ? (
              <span className="text-sm text-gray-500">
                ({store.reviewsCount || 0} تقييم)
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