// components/molecules/admin/products/ProductViewModal.tsx
import React from 'react';
import { X, Package, Star, TrendingUp, Calendar, DollarSign, Tag, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useTheme from '@/hooks/useTheme';
import { Product } from '../../../../types/product';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const Badge: React.FC<{
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
}> = ({ variant, children, className = "", isDark = false }) => {
  const variantClasses = {
    success: isDark 
      ? "bg-green-900/30 text-green-400 border-green-800" 
      : "bg-green-100 text-green-800 border-green-200",
    warning: isDark 
      ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: isDark 
      ? "bg-red-900/30 text-red-400 border-red-800" 
      : "bg-red-100 text-red-800 border-red-200",
    info: isDark 
      ? "bg-teal-900/30 text-teal-400 border-teal-800" 
      : "bg-[#CFF7EE] text-[#004D5A] border-[#96EDD9]",
    neutral: isDark 
      ? "bg-gray-800 text-gray-300 border-gray-700" 
      : "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const ProductViewModal: React.FC<ProductViewModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { t, i18n } = useTranslation('');
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';

  if (!isOpen || !product) return null;

  // Theme-based classes
  const modalClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-300';

  const overlayClasses = isDark
    ? 'bg-black/60'
    : 'bg-black/50';

  const titleClasses = isDark
    ? 'text-gray-100'
    : 'text-[#004D5A]';

  const textClasses = isDark
    ? 'text-gray-300'
    : 'text-gray-700';

  const labelClasses = isDark
    ? 'text-gray-400'
    : 'text-gray-600';

  const valueClasses = isDark
    ? 'text-gray-200'
    : 'text-gray-800';

  const priceClasses = isDark
    ? 'text-green-400'
    : 'text-green-600';

  const stockClasses = (stock: number) => {
    if (stock <= 5) {
      return isDark ? 'text-red-400 font-medium' : 'text-red-600 font-medium';
    }
    return isDark ? 'text-gray-300' : 'text-gray-700';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "out_of_stock":
        return "danger";
      case "low_stock":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return t('status.active');
      case "out_of_stock":
        return t('status.out_of_stock');
      case "low_stock":
        return t('status.low_stock');
      default:
        return status;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/api/placeholder/400/400";
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClasses}`} onClick={handleOverlayClick}>
      <div className={`
        ${modalClasses} 
        rounded-lg shadow-xl border max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto
        transition-colors duration-200
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${titleClasses} flex items-center gap-3`}>
            <Eye className="w-6 h-6" />
            {t('productDetails.title')}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.image}
                  alt={isRTL ? product.nameAr : product.name}
                  className="w-full h-80 object-cover rounded-lg border border-gray-200"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={getStatusVariant(product.status)} isDark={isDark}>
                    {getStatusText(product.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h3 className={`text-3xl font-bold ${titleClasses} mb-2`}>
                    {isRTL ? product.nameAr : product.name}
                  </h3>
                  <p className={`text-lg ${textClasses}`}>
                    {isRTL ? product.categoryAr : product.category}
                  </p>
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h4 className={`text-lg font-semibold ${labelClasses} mb-2`}>
                      {t('productDetails.description')}
                    </h4>
                    <p className={`${textClasses} leading-relaxed`}>
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Price and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={`w-5 h-5 ${labelClasses}`} />
                    <span className={`text-sm font-medium ${labelClasses}`}>
                      {t('productDetails.price')}
                    </span>
                  </div>
                  <span className={`text-2xl font-bold ${priceClasses}`}>
                    ${product.price.toLocaleString()}
                  </span>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className={`w-5 h-5 ${labelClasses}`} />
                    <span className={`text-sm font-medium ${labelClasses}`}>
                      {t('productDetails.rating')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${valueClasses}`}>
                      {product.rating}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {product.reviewCount && (
                    <span className={`text-sm ${labelClasses}`}>
                      ({product.reviewCount} {t('productDetails.reviews')})
                    </span>
                  )}
                </div>
              </div>

              {/* Stock and Sales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className={`w-5 h-5 ${labelClasses}`} />
                    <span className={`text-sm font-medium ${labelClasses}`}>
                      {t('productDetails.stock')}
                    </span>
                  </div>
                  <span className={`text-xl font-bold ${stockClasses(product.stock)}`}>
                    {product.stock} {t('productDetails.units')}
                  </span>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className={`w-5 h-5 ${labelClasses}`} />
                    <span className={`text-sm font-medium ${labelClasses}`}>
                      {t('productDetails.sales')}
                    </span>
                  </div>
                  <span className={`text-xl font-bold text-green-500`}>
                    {product.sales}
                  </span>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className={`font-medium ${labelClasses}`}>
                    {t('productDetails.sku')}
                  </span>
                  <span className={`${valueClasses}`}>
                    {product.id}
                  </span>
                </div>

                {product.brand && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className={`font-medium ${labelClasses}`}>
                      {t('productDetails.brand')}
                    </span>
                    <span className={`${valueClasses}`}>
                      {product.brand}
                    </span>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="py-2">
                    <span className={`font-medium ${labelClasses} block mb-2`}>
                      {t('productDetails.tags')}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="info" isDark={isDark}>
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <span className={`font-medium ${labelClasses}`}>
                    {t('productDetails.createdAt')}
                  </span>
                  <span className={`${valueClasses}`}>
                    {new Date(product.createdAt || Date.now()).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex justify-end p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('actions.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;