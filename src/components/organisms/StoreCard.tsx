"use client";
import React from "react";
import { MapPin, Star } from "lucide-react";

interface Store {
  id: number;
  name: string;
  image: string; // ← فقط من الـ API
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
      <div className="relative overflow-hidden">
<img
  src={store.image}
  alt={store.name}
  onError={(e) => {
    console.warn("فشل تحميل الصورة:", store.image);
    (e.target as HTMLImageElement).src = 
      "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
  }}
/>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">
          {store.name}
        </h3>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 ml-1" />
          <span className="text-sm">{store.location}</span>
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