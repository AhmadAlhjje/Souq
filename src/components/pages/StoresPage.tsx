"use client"
import React, { useState } from 'react';
import PageHeader from '../templates/PageHeader';
import StoresSection from '../templates/StoresSection';

import { Store } from '../../types/store';
import { SAMPLE_STORES } from '../../utils/constants';

const StoresPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (store: Store) => {
    alert(`زيارة متجر ${store.name}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white">
      
      <PageHeader 
        title="تسوق بالشيكات والراتبات"
        subtitle="اكتشف أفضل المتاجر التي تقبل الدفع بالشيكات والراتبات واحصل على أفضل العروض الحصرية"
        searchProps={{
          placeholder: "ابحث عن منتج أو متجر...",
          value: searchQuery,
          onChange: handleSearchChange
        }}
      />

      
      <StoresSection stores={SAMPLE_STORES} onViewDetails={handleViewDetails} />
      
      
      
    </div>
  );
};

export default StoresPage;