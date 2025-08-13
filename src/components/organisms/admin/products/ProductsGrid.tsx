import React from 'react';
import ProductCard from '../../../molecules/admin/products/ProductCard';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useTheme from '@/hooks/useTheme';
import { Product, ProductsGridProps } from '../../../../types/product';

const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  loading = false,
}) => {
  const { t } = useTranslation('');
  const { isDark, isLight } = useTheme();

  // Theme-based classes for loading skeleton
  const skeletonCardClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-[#96EDD9]';

  const skeletonElementClasses = isDark
    ? 'bg-gray-700'
    : 'bg-gray-200';

  // Theme-based classes for empty state
  const emptyStateClasses = {
    container: 'text-center py-12',
    icon: isDark ? 'text-gray-500' : 'text-gray-400',
    title: isDark ? 'text-gray-300' : 'text-gray-600',
    description: isDark ? 'text-gray-400' : 'text-gray-500'
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className={`
              ${skeletonCardClasses} 
              rounded-lg shadow-sm border overflow-hidden animate-pulse
              transition-colors duration-200
            `}
          >
            <div className={`w-full h-48 ${skeletonElementClasses}`} />
            <div className="p-4">
              <div className={`h-4 ${skeletonElementClasses} rounded mb-2`} />
              <div className={`h-3 ${skeletonElementClasses} rounded mb-2 w-2/3`} />
              <div className={`h-4 ${skeletonElementClasses} rounded mb-3 w-1/3`} />
              <div className="flex gap-2">
                <div className={`flex-1 h-8 ${skeletonElementClasses} rounded`} />
                <div className={`w-8 h-8 ${skeletonElementClasses} rounded`} />
                <div className={`w-8 h-8 ${skeletonElementClasses} rounded`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={emptyStateClasses.container}>
        <Package className={`w-16 h-16 ${emptyStateClasses.icon} mx-auto mb-4 transition-colors duration-200`} />
        <h3 className={`text-lg font-semibold ${emptyStateClasses.title} mb-2 transition-colors duration-200`}>
          {t('emptyState.title')}
        </h3>
        <p className={`${emptyStateClasses.description} transition-colors duration-200`}>
          {t('emptyState.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onViewProduct}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;