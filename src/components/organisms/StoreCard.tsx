//s
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      {/* حاوي الصورة مع ارتفاع ثابت */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.warn("فشل تحميل الصورة:", store.image);
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
          }}
          loading="lazy"
        />
        
        {/* طبقة تدرج اختيارية للتحسين البصري */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* تقييم المتجر في الزاوية إذا كان متوفر */}
        {store.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-sm font-medium">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{store.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* محتوى الكارت */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">
          {store.name}
        </h3>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 ml-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{store.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            ({store.reviewsCount || 127} تقييم)
          </span>

          <button
            onClick={handleVisitStore}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-md active:scale-95 transform"
          >
            زيارة المتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;