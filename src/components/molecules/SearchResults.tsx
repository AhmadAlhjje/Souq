// SearchResults.tsx - نسخة محدثة مع إحصائيات التقييم
import React from 'react';
import Typography from '../atoms/Typography';
import { SearchStoreResponse } from '../../api/stores';

interface SearchResultsProps {
  searchResults: SearchStoreResponse | null;
  searchError: string | null;
  isSearching: boolean;
  searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = React.memo(({
  searchResults,
  searchError,
  isSearching,
  searchTerm
}) => {
  // عرض مؤشر التحميل فقط عند البحث الفعلي
  if (isSearching && searchTerm.trim()) {
    return (
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
          <Typography variant="body">جاري البحث...</Typography>
        </div>
      </div>
    );
  }

  // عرض رسالة الخطأ
  if (searchError && searchTerm.trim()) {
    return (
      <div className="mt-4 text-center">
        <Typography variant="body" className="text-red-600">
          {searchError}
        </Typography>
      </div>
    );
  }

  // ✅ عرض عداد النتائج المحدث مع معلومات التقييم
  if (searchResults && searchTerm.trim()) {
    const { searchStats, stores } = searchResults;
    
    return (
      <div className="mt-4">
        {/* الرسالة الأساسية */}
        <div className="text-center mb-3">
          <Typography variant="body" className="text-gray-600">
            {searchResults.message}
            <span className="text-teal-600 font-medium mr-1">
              للبحث: &quot;{searchTerm.trim()}&quot;
            </span>
          </Typography>
        </div>


      </div>
    );
  }

  return null;
});

SearchResults.displayName = 'SearchResults';

export default SearchResults;