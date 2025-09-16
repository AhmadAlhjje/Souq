// SearchWithApi.tsx - إصلاح مشكلة الاهتزاز
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchStores, SearchStoreResponse } from '../../api/stores';

interface SearchWithApiProps {
  onSearchResults: (results: SearchStoreResponse | null) => void;
  onSearchError: (error: string | null) => void;
  onSearchLoading: (loading: boolean) => void;
  onSearchTermChange?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchWithApi: React.FC<SearchWithApiProps> = ({
  onSearchResults,
  onSearchError,
  onSearchLoading,
  onSearchTermChange,
  placeholder = "ابحث...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchRef = useRef<string>('');

  // استخدام useCallback لمنع إعادة إنشاء الدالة
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      onSearchResults(null);
      onSearchError(null);
      onSearchLoading(false);
      return;
    }

    // التحقق من أن هذا هو آخر بحث مطلوب
    if (currentSearchRef.current !== term) {
      return;
    }

    onSearchLoading(true);
    onSearchError(null);

    try {
      // التحقق مرة أخرى قبل البحث
      if (currentSearchRef.current !== term) {
        return;
      }

      const results = await searchStores(term.trim());
      
      // التحقق مرة أخيرة قبل إرسال النتائج
      if (currentSearchRef.current === term) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('خطأ في البحث:', error);
      if (currentSearchRef.current === term) {
        onSearchError('لم يتم العثور على متاجر بهذا الاسم');
        onSearchResults(null);
      }
    } finally {
      if (currentSearchRef.current === term) {
        onSearchLoading(false);
      }
    }
  }, [onSearchResults, onSearchError, onSearchLoading]);

  // التعامل مع تغيير مصطلح البحث
  useEffect(() => {
    // إلغاء البحث السابق
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // تحديث المرجع
    currentSearchRef.current = searchTerm;

    // إرسال مصطلح البحث للخارج فوراً
    onSearchTermChange?.(searchTerm);

    // إذا كان فارغاً، امسح النتائج فوراً
    if (!searchTerm.trim()) {
      onSearchResults(null);
      onSearchError(null);
      onSearchLoading(false);
      return;
    }

    // إعداد البحث المؤجل
    timeoutRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);

    // تنظيف عند إلغاء المكون
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, performSearch, onSearchTermChange, onSearchResults, onSearchError, onSearchLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    currentSearchRef.current = '';
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full px-4 py-3 pl-12 pr-12 text-right border-2 border-teal-300 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
      />
      
      {/* Search Icon on the right */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {/* Clear Search Button on the left */}
      {searchTerm && (
        <button
          onClick={handleClearSearch}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          title="مسح البحث"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchWithApi;