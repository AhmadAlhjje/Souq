// StoresSection.tsx - محدث لعرض العروض العامة مع دعم Toast
import React, { useState, useCallback } from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import StoreCard from '../organisms/StoreCard';
import OffersSlider from '../organisms/OffersSlider';
import SearchWithApi from '../molecules/SearchWithApi';
import SearchResults from '../molecules/SearchResults';
import { SearchStoreResponse } from '../../api/stores';
import { ToastProvider } from '@/hooks/useToast'; // ✅ إضافة ToastProvider

// نفس interface المحلي بدون تغيير
interface Store {
  id: number;
  name: string;
  image: string;
  location: string;
  rating?: number;
  reviewsCount?: number;
}

interface StoresSectionProps {
  stores: Store[];
  onViewDetails: (store: Store) => void;
}

const StoresSection: React.FC<StoresSectionProps> = ({
  stores,
  onViewDetails
}) => {
  const [searchResults, setSearchResults] = useState<SearchStoreResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  // استخدام useCallback لمنع إعادة إنشاء الدوال
  const handleSearchResults = useCallback((results: SearchStoreResponse | null) => {
    setSearchResults(results);
  }, []);

  const handleSearchError = useCallback((error: string | null) => {
    setSearchError(error);
  }, []);

  const handleSearchLoading = useCallback((loading: boolean) => {
    setIsSearching(loading);
  }, []);

  const handleSearchTermChange = useCallback((term: string) => {
    setCurrentSearchTerm(term);
  }, []);

  // تحويل متجر API إلى متجر محلي
  const convertApiStoreToLocal = useCallback((apiStore: any): Store => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
    
    let imageUrl = "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    
    // أولاً جرب الصور العادية (images) - الأولوية الأولى
    if (apiStore.images) {
      try {
        let images;
        if (typeof apiStore.images === 'string') {
          images = JSON.parse(apiStore.images);
        } else {
          images = apiStore.images;
        }
        
        if (Array.isArray(images) && images.length > 0) {
          const firstImage = images[0];
          if (firstImage && firstImage !== 'null' && firstImage !== '') {
            if (firstImage.startsWith('/uploads')) {
              imageUrl = `${baseUrl}${firstImage}`;
            } else if (firstImage.startsWith('http')) {
              imageUrl = firstImage;
            } else {
              imageUrl = `${baseUrl}/${firstImage}`;
            }
            // إذا وجدنا صورة صالحة، استخدمها ولا تكمل
            return {
              id: apiStore.store_id,
              name: apiStore.store_name,
              image: imageUrl,
              location: apiStore.store_address,
              rating: apiStore.averageRating || undefined,
              reviewsCount: apiStore.reviewsCount || undefined
            };
          }
        }
      } catch (error) {
        console.error('خطأ في تحليل صور المتجر:', error);
      }
    }
    
    // إذا لم توجد صور عادية، استخدم الشعار كبديل
    if (apiStore.logo_image && apiStore.logo_image !== 'null' && apiStore.logo_image !== '') {
      if (apiStore.logo_image.startsWith('/uploads')) {
        imageUrl = `${baseUrl}${apiStore.logo_image}`;
      } else if (apiStore.logo_image.startsWith('http')) {
        imageUrl = apiStore.logo_image;
      } else {
        imageUrl = `${baseUrl}/${apiStore.logo_image}`;
      }
    }

    return {
      id: apiStore.store_id,
      name: apiStore.store_name,
      image: imageUrl,
      location: apiStore.store_address,
      rating: apiStore.averageRating || undefined,
      reviewsCount: apiStore.reviewsCount || undefined
    };
  }, []);

  // تحديد المتاجر المعروضة (نتائج البحث أو المتاجر الأصلية)
  const displayedStores = searchResults 
    ? searchResults.stores.map(convertApiStoreToLocal)
    : stores;

  return (
    <ToastProvider> {/* ✅ تغليف StoresSection بـ ToastProvider */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* العروض العامة من جميع المتاجر - بدون تمرير storeId */}
        <OffersSlider />

        {/* Search Section */}
        <div className="my-8">
          <div className="max-w-2xl mx-auto">
            <SearchWithApi
              onSearchResults={handleSearchResults}
              onSearchError={handleSearchError}
              onSearchLoading={handleSearchLoading}
              onSearchTermChange={handleSearchTermChange}
              placeholder="ابحث عن المتاجر..."
              className="w-full"
            />
            
            <SearchResults
              searchResults={searchResults}
              searchError={searchError}
              isSearching={isSearching}
              searchTerm={currentSearchTerm}
            />
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* No Results Message */}
        {displayedStores.length === 0 && currentSearchTerm && !isSearching && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <Typography variant="h3" className="text-gray-500 mb-4">
              لا توجد نتائج
            </Typography>
            <Typography variant="body" className="text-gray-400 mb-6">
              لم نجد أي متاجر تطابق بحثك عن &quot;{currentSearchTerm}&quot;
            </Typography>
          </div>
        )}

       
      </div>
    </ToastProvider>
  );
};

export default StoresSection;