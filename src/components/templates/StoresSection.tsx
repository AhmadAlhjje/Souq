import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import StoreCard from '../organisms/StoreCard';
import OffersSlider from '../organisms/OffersSlider';

interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
}

interface StoresSectionProps {
  stores: Store[];
  onViewDetails: (store: Store) => void;
}

const StoresSection: React.FC<StoresSectionProps> = ({
  stores,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // فلترة المتاجر حسب الاسم
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* العروض */}
      <OffersSlider />

    

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredStores.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <Typography variant="h3" className="text-gray-500 mb-4">
            لا توجد نتائج
          </Typography>
          <Typography variant="body" className="text-gray-400 mb-6">
            لم نجد أي متاجر تطابق بحثك عن 
          </Typography>
          <button 
            onClick={() => setSearchTerm('')}
            className="bg-teal-100 text-teal-700 px-6 py-2 rounded-lg hover:bg-teal-200 transition-colors"
          >
            إزالة الفلتر
          </button>
        </div>
      )}

      {/* Load More Button */}
      {filteredStores.length > 0 && (
        <div className="text-center">
          <button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-medium flex items-center gap-3 mx-auto transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <span>استكشف جميع المتاجر</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
      
        </div>
      )}

     
    </div>
  );
};

export default StoresSection;