import React from "react";
import { Star, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { Product, ProductsTableProps } from "../../../../types/product";
import { DeleteButton, EditButton, ViewButton } from "@/components/common/ActionButtons";

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  loading = false,
  sorting,
  onSort,
}) => {
  const { t, i18n } = useTranslation("");
  const { isDark } = useTheme();
  const isRTL = i18n.language === "ar";

  // Theme-based classes
  const tableContainerClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-[#96EDD9]';

  const tableHeaderClasses = isDark
    ? 'bg-gray-700'
    : 'bg-[#CFF7EE]';

  const headerTextClasses = isDark
    ? 'text-gray-200'
    : 'text-[#004D5A]';

  const rowBorderClasses = isDark
    ? 'border-gray-700'
    : 'border-gray-100';

  const rowHoverClasses = isDark
    ? 'hover:bg-gray-700'
    : 'hover:bg-gray-50';

  const productTitleClasses = isDark
    ? 'text-gray-200'
    : 'text-[#004D5A]';

  const categoryTextClasses = isDark
    ? 'text-gray-400'
    : 'text-gray-500';

  const priceClasses = isDark
    ? 'text-gray-200'
    : 'text-[#004D5A]';

  const ratingTextClasses = isDark
    ? 'text-gray-300'
    : 'text-gray-900';

  const salesTextClasses = isDark
    ? 'text-gray-300'
    : 'text-gray-600';

  const skeletonClasses = isDark
    ? 'bg-gray-700'
    : 'bg-gray-200';

  const emptyStateClasses = {
    container: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#96EDD9]',
    icon: isDark ? 'text-gray-500' : 'text-gray-400',
    title: isDark ? 'text-gray-300' : 'text-gray-600',
    description: isDark ? 'text-gray-400' : 'text-gray-500'
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

  const getStatusClasses = (status: string) => {
    if (isDark) {
      switch (status) {
        case "active":
          return "bg-green-900/30 text-green-400 border-green-800";
        case "out_of_stock":
          return "bg-red-900/30 text-red-400 border-red-800";
        case "low_stock":
          return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
        default:
          return "bg-gray-800 text-gray-300 border-gray-700";
      }
    } else {
      switch (status) {
        case "active":
          return "bg-green-100 text-green-800 border-green-200";
        case "out_of_stock":
          return "bg-red-100 text-red-800 border-red-200";
        case "low_stock":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const getStockClasses = (stock: number) => {
    if (stock < 5) {
      return isDark ? 'text-red-400' : 'text-red-600';
    }
    return isDark ? 'text-gray-300' : 'text-gray-600';
  };

  if (loading) {
    return (
      <div className={`${tableContainerClasses} rounded-lg border shadow-sm overflow-hidden transition-colors duration-200`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${tableHeaderClasses} transition-colors duration-200`}>
              <tr>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.product')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.price')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.stock')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.status')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.rating')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.sales')}
                </th>
                <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                  {t('headers.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className={`border-b ${rowBorderClasses} animate-pulse transition-colors duration-200`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${skeletonClasses} rounded-lg`} />
                      <div>
                        <div className={`h-4 ${skeletonClasses} rounded w-32 mb-2`} />
                        <div className={`h-3 ${skeletonClasses} rounded w-20`} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`h-4 ${skeletonClasses} rounded w-16`} />
                  </td>
                  <td className="py-4 px-4">
                    <div className={`h-4 ${skeletonClasses} rounded w-8`} />
                  </td>
                  <td className="py-4 px-4">
                    <div className={`h-6 ${skeletonClasses} rounded w-20`} />
                  </td>
                  <td className="py-4 px-4">
                    <div className={`h-4 ${skeletonClasses} rounded w-12`} />
                  </td>
                  <td className="py-4 px-4">
                    <div className={`h-4 ${skeletonClasses} rounded w-10`} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${skeletonClasses} rounded`} />
                      <div className={`w-8 h-8 ${skeletonClasses} rounded`} />
                      <div className={`w-8 h-8 ${skeletonClasses} rounded`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`${emptyStateClasses.container} rounded-lg border shadow-sm p-12 text-center transition-colors duration-200`}>
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
    <div className={`${tableContainerClasses} rounded-lg border shadow-sm overflow-hidden transition-colors duration-200`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${tableHeaderClasses} transition-colors duration-200`}>
            <tr>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.product')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.price')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.stock')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.status')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.rating')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.sales')}
              </th>
              <th className={`py-4 px-4 text-left ${headerTextClasses} font-semibold transition-colors duration-200`}>
                {t('headers.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr
                key={product.id}
                className={`border-b ${rowBorderClasses} ${rowHoverClasses} transition-colors duration-200`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={isRTL ? product.nameAr : product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className={`font-medium ${productTitleClasses} transition-colors duration-200`}>
                        {isRTL ? product.nameAr : product.name}
                      </h3>
                      <p className={`text-sm ${categoryTextClasses} transition-colors duration-200`}>
                        {isRTL ? product.categoryAr : product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-semibold ${priceClasses} transition-colors duration-200`}>
                    ${product.price}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`${getStockClasses(product.stock)} transition-colors duration-200`}>
                    {product.stock}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border transition-colors duration-200 ${getStatusClasses(
                      product.status
                    )}`}
                  >
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className={`text-sm ${ratingTextClasses} transition-colors duration-200`}>
                      {product.rating}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`${salesTextClasses} transition-colors duration-200`}>
                    {product.sales}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <ViewButton
                      size="sm"
                      onClick={() => onViewProduct?.(product)}
                      tooltip={t('actions.view')}
                    />
                    <EditButton
                      size="sm"
                      onClick={() => onEditProduct?.(product)}
                      tooltip={t('actions.edit')}
                    />
                    <DeleteButton
                      size="sm"
                      onClick={() => onDeleteProduct?.(product)}
                      tooltip={t('actions.delete')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;