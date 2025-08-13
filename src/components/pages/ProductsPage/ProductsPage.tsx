// pages/admin/products/ProductsPage.tsx
"use client";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import useTheme from '@/hooks/useTheme';
import AdminLayout from '../../templates/admin/products/AdminLayout';
import ProductsStats from '../../organisms/admin/products/ProductsStats';
import ProductsFilter from '../../organisms/admin/products/ProductsFilter';
import ProductsGrid from '../../organisms/admin/products/ProductsGrid';
import ProductsTable from '../../organisms/admin/products/ProductsTable';
import DeleteConfirmModal from '../../molecules/admin/products/DeleteConfirmModal';
import { mockProducts } from '../../../data/mockProducts';
import { Product, ViewMode } from '../../../types/product';

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation('products');
  const { isDark, isLight, themeClasses } = useTheme();
  const isRTL = i18n.language === 'ar';
  
  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // تحويل mockProducts لتتوافق مع Product interface الجديد
  const convertedProducts: Product[] = mockProducts.map((product: any) => ({
    ...product,
    reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 10, // إضافة قيمة افتراضية
    inStock: product.inStock !== undefined ? product.inStock : product.stock > 0, // تحديد حالة التوفر
    salePrice: product.salePrice || undefined, // الحفاظ على سعر العرض إذا كان موجود
    originalPrice: product.originalPrice || undefined, // الحفاظ على السعر الأصلي
    isNew: product.isNew || false, // تحديد المنتجات الجديدة
  }));

  // Filter products based on search criteria
  const filteredProducts: Product[] = convertedProducts.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.nameAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Event Handlers
  const handleDeleteProduct = (product: Product): void => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting product:', productToDelete);
      
      // Here you would make the actual API call to delete the product
      // await deleteProduct(productToDelete.id);
      
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product): void => {
    console.log('Viewing product:', product);
    // Navigate to product details page
    // router.push(`/admin/products/${product.id}`);
  };

  const handleEditProduct = (product: Product): void => {
    console.log('Editing product:', product);
    // Navigate to product edit page
    // router.push(`/admin/products/${product.id}/edit`);
  };

  const handleAddProduct = (): void => {
    console.log('Adding new product');
    // Navigate to add product page
    // router.push('/admin/products/add');
  };

  const handleViewModeChange = (mode: ViewMode): void => {
    if (mode === 'list') {
      setViewMode('grid');
    } else {
      setViewMode(mode);
    }
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string): void => {
    setSelectedCategory(value);
  };

  const handleStatusChange = (value: string): void => {
    setSelectedStatus(value);
  };

  const handleCloseModal = (): void => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // دالة لرندر المحتوى حسب نوع العرض
  const renderProductsContent = () => {
    switch (viewMode) {
      case 'table':
        return (
          <ProductsTable
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
      case 'list':
        return (
          <ProductsGrid
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
      case 'grid':
      default:
        return (
          <ProductsGrid
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
    }
  };

  // تكوين رسالة الحذف
  const getDeleteMessage = (): string => {
    if (!productToDelete) return '';
    
    const productName = isRTL ? productToDelete.nameAr : productToDelete.name;
    
    return t('deleteModal.message', { productName });
  };

  // Theme-based classes
  const containerClasses = isDark 
    ? 'bg-gray-900 min-h-screen' 
    : 'bg-gray-50 min-h-screen';

  const emptyStateClasses = {
    container: 'text-center py-16',
    icon: isDark ? 'bg-gray-700' : 'bg-gray-100',
    iconColor: isDark ? 'text-gray-400' : 'text-gray-400',
    title: isDark ? 'text-gray-200' : 'text-gray-700',
    description: isDark ? 'text-gray-400' : 'text-gray-500',
    button: isDark 
      ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500' 
      : 'bg-[#004D5A] hover:bg-[#003a44] text-white focus:ring-[#004D5A]',
    clearFilters: isDark
      ? 'text-blue-400 hover:text-blue-300'
      : 'text-[#004D5A] hover:text-[#003a44]'
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <AdminLayout
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <div className={containerClasses}>
        <div className={`p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
          {/* Stats Section */}
          <section aria-label={t('stats.totalProducts')}>
            <ProductsStats 
              products={convertedProducts} 
              loading={loading}
            />
          </section>

          {/* Filters Section */}
          <section aria-label={t('filters.search')}>
            <ProductsFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onAddProduct={handleAddProduct}
              loading={loading}
            />
          </section>

          {/* Products Display Section */}
          <section aria-label={t('page.title')}>
            {renderProductsContent()}
          </section>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <div className={emptyStateClasses.container}>
              <div className={`w-20 h-20 ${emptyStateClasses.icon} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Package className={`w-10 h-10 ${emptyStateClasses.iconColor}`} />
              </div>
              
              <h3 className={`text-xl font-semibold ${emptyStateClasses.title} mb-3`}>
                {t('emptyState.title')}
              </h3>
              
              <p className={`${emptyStateClasses.description} mb-6 max-w-md mx-auto leading-relaxed`}>
                {t('emptyState.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleAddProduct}
                  className={`
                    ${emptyStateClasses.button} 
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform hover:scale-105 active:scale-95
                  `}
                  aria-label={t('buttons.addProduct')}
                >
                  {hasActiveFilters ? t('emptyState.addProduct') : t('emptyState.addFirstProduct')}
                </button>
                
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                    }}
                    className={`
                      ${emptyStateClasses.clearFilters}
                      px-4 py-2 font-medium transition-colors duration-200
                      hover:underline focus:outline-none focus:underline
                    `}
                  >
                    {t('actions.reset')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={handleCloseModal}
            onConfirm={confirmDelete}
            title={t('deleteModal.title')}
            message={getDeleteMessage()}
            loading={loading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;