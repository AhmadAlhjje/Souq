import React from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import StoreCard from '../organisms/StoreCard';

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
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <Typography variant="h2" className="mb-6">
          المتاجر المميزة ⭐
        </Typography>
        <Typography variant="body" className="text-xl">
          متاجر موثوقة تقبل الدفع بالشيكات والراتبات
        </Typography>
      </div>
      
      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stores.map((store) => (
          <StoreCard 
            key={store.id} 
            store={store} 
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

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