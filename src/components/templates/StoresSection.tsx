import React, { useState } from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import StoreCard from '../organisms/StoreCard';
import OffersSlider from '../organisms/OffersSlider';
import SearchInput from '../molecules/SearchInput';

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

      {/* Section Header */}
      <div className="text-center mb-8 mt-12">
        <Typography variant="h2" className="mb-6">
          المتاجر المميزة ⭐
        </Typography>
        <Typography variant="body" className="text-xl text-gray-600">
          متاجر موثوقة تقبل الدفع بالشيكات والراتبات
        </Typography>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="ابحث عن متجر..."
        />
      </div>

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
          <Typography variant="h3" className="text-gray-500 mb-4">
            لا توجد نتائج
          </Typography>
          <Typography variant="body" className="text-gray-400">
            لم نجد أي متاجر تطابق بحثك "{searchTerm}"
          </Typography>
        </div>
      )}

      {/* Load More Button */}
      <div className="text-center">
        <Button
          text="استكشف جميع المتاجر"
          endIcon={<Icon name="chevron-right" size="sm" />}
        />
      </div>
    </div>
  );
};

export default StoresSection;