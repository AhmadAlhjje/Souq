import React from 'react';
import { MapPin, Star } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative overflow-hidden">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-gray-700">
              {store.rating || 4.5}
            </span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
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
            onClick={() => onViewDetails(store)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            زيارة المتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;