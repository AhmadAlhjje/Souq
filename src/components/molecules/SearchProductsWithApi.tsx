// SearchProductsWithApi.tsx - مكون البحث في المنتجات مع دعم Dark/Light Mode المحسن
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchProductsInStore, ProductSearchResponse } from '../../api/stores';
import { useThemeContext } from '@/contexts/ThemeContext';

interface SearchProductsWithApiProps {
  storeId: number;
  onSearchResults: (results: ProductSearchResponse | null) => void;
  onSearchError: (error: string | null) => void;
  onSearchLoading: (loading: boolean) => void;
  onSearchTermChange?: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchProductsWithApi: React.FC<SearchProductsWithApiProps> = ({
  storeId,
  onSearchResults,
  onSearchError,
  onSearchLoading,
  onSearchTermChange,
  placeholder = "ابحث في المنتجات...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchRef = useRef<string>('');
  const { theme, isDark, isLight } = useThemeContext();

  // دالة للحصول على ألوان وأنماط الثيم
  const getThemeClasses = () => {
    return {
      // الحقل الرئيسي
      inputField: isDark 
        ? "bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:bg-gray-750" 
        : "bg-white border-2 border-teal-300 text-gray-900 placeholder-gray-500 focus:border-teal-500",
      
      // أيقونة البحث
      searchIcon: isDark 
        ? "text-gray-400" 
        : "text-gray-400",
      
      // زر المسح
      clearButton: isDark 
        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
      
      // الحاوية الرئيسية
      container: isDark 
        ? "bg-gray-800/20 border border-gray-700 rounded-xl" 
        : "bg-white/20 border border-gray-200 rounded-xl",
      
      // ظلال وتأثيرات
      containerShadow: isDark 
        ? "shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/30" 
        : "shadow-md shadow-gray-500/10 hover:shadow-lg hover:shadow-gray-500/15",
      
      // تأثيرات التركيز
      focusRing: isDark 
        ? "focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800" 
        : "focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white",
      
      // خلفية متحركة عند التركيز
      focusOverlay: isDark 
        ? "bg-gradient-to-r from-teal-500/10 to-transparent" 
        : "bg-gradient-to-r from-teal-100/50 to-transparent",
    };
  };

  const themeClasses = getThemeClasses();

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

      const results = await searchProductsInStore(storeId, term.trim());
      
      // التحقق مرة أخيرة قبل إرسال النتائج
      if (currentSearchRef.current === term) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('خطأ في البحث عن المنتجات:', error);
      if (currentSearchRef.current === term) {
        onSearchError('لم يتم العثور على منتجات بهذا الاسم');
        onSearchResults(null);
      }
    } finally {
      if (currentSearchRef.current === term) {
        onSearchLoading(false);
      }
    }
  }, [storeId, onSearchResults, onSearchError, onSearchLoading]);

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
    <div className={`relative ${className} transition-all duration-300`}>
      {/* الحاوية الرئيسية مع تأثيرات محسنة */}
      <div className={`relative ${themeClasses.container} ${themeClasses.containerShadow} transition-all duration-300 overflow-hidden backdrop-blur-sm`}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 pl-12 pr-12 text-right ${themeClasses.inputField} ${themeClasses.focusRing} rounded-xl focus:outline-none transition-all duration-300`}
        />
        
        {/* خلفية متحركة عند التركيز */}
        <div className={`absolute inset-0 ${themeClasses.focusOverlay} opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl`}></div>
        
        {/* Search Icon on the right مع تحسينات */}
        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.searchIcon} transition-all duration-300`}>
          <svg 
            className="w-5 h-5 transition-transform duration-300 hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        {/* Clear Search Button on the left مع تحسينات */}
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.clearButton} transition-all duration-200 p-1 rounded-full hover:scale-110 active:scale-95`}
            title="مسح البحث"
            aria-label="مسح البحث"
          >
            <svg 
              className="w-4 h-4 transition-transform duration-200" 
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

        {/* مؤشر حالة البحث */}
        {searchTerm && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 transition-all duration-300">
            <div 
              className={`h-0.5 ${isDark ? 'bg-teal-400' : 'bg-teal-500'} rounded-full transition-all duration-500`} 
              style={{ 
                width: Math.min(searchTerm.length * 3, 120) + 'px'
              }}
            ></div>
          </div>
        )}

        {/* تأثير النبضات أثناء الكتابة */}
        {searchTerm && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 rounded-xl ${isDark ? 'border-teal-400/20' : 'border-teal-500/20'} border animate-pulse`}></div>
          </div>
        )}
      </div>

      {/* مؤشر الثيم (اختياري) */}
      <div className="absolute -top-2 -right-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200'} transition-colors duration-300 backdrop-blur-sm`}>
          {isDark ? "🌙" : "☀️"}
        </div>
      </div>

      {/* تأثير توهج خفيف للوضع المظلم */}
      {isDark && searchTerm && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/5 to-transparent opacity-50 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default SearchProductsWithApi;