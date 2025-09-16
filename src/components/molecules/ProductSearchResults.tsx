// ProductSearchResults.tsx - عرض نتائج البحث للمنتجات
import React from "react";
import Typography from "../atoms/Typography";
import { ProductSearchResponse } from "../../api/stores";

interface ProductSearchResultsProps {
  searchResults: ProductSearchResponse | null;
  searchError: string | null;
  isSearching: boolean;
  searchTerm: string;
}

const ProductSearchResults: React.FC<ProductSearchResultsProps> = React.memo(
  ({ searchResults, searchError, isSearching, searchTerm }) => {
    // عرض مؤشر التحميل فقط عند البحث الفعلي
    if (isSearching && searchTerm.trim()) {
      return (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-600 border-t-transparent"></div>
            <Typography variant="body">جاري البحث في المنتجات...</Typography>
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

    // عرض عداد النتائج مع الإحصائيات
    if (searchResults && searchTerm.trim()) {
      const { statistics, Products } = searchResults;

      return (
        <div className="mt-4">
          {/* الرسالة الأساسية */}
          <div className="text-center mb-3">
            <Typography variant="body" className="text-gray-600">
              تم العثور على
              <span className="text-teal-600 font-bold mx-1">
                {Products.length}
              </span>
              منتج
              <span className="text-teal-600 font-medium mr-1">
                للبحث: &quot;{searchTerm.trim()}&quot;
              </span>
            </Typography>
          </div>

          {/* إحصائيات مفصلة */}
          {statistics && Products.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center text-sm">
              {statistics.availableProducts > 0 && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✅ {statistics.availableProducts} متوفر
                </span>
              )}

              {statistics.outOfStockProducts > 0 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  ❌ {statistics.outOfStockProducts} نفذ
                </span>
              )}

              {statistics.lowStockProducts > 0 && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  ⚠️ {statistics.lowStockProducts} كمية قليلة
                </span>
              )}

              {statistics.products.averageRating > 0 && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  ⭐ {statistics.products.averageRating.toFixed(1)} متوسط
                  التقييم
                </span>
              )}

              {statistics.products.totalReviews > 0 && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  💬 {statistics.products.totalReviews} مراجعة
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);

ProductSearchResults.displayName = "ProductSearchResults";

export default ProductSearchResults;
