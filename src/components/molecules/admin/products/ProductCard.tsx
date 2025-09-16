import React from "react";
import { Star, Package, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { ProductCardProps } from "../../../../types/product";
import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/common/ActionButtons";

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

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation("");
  const { isDark } = useTheme();
  const isRTL = i18n.language === "ar";

  const cardClasses = isDark
    ? "bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50"
    : "bg-white border-[#96EDD9] hover:shadow-md";

  const titleClasses = isDark ? "text-gray-100" : "text-[#004D5A]";
  const categoryClasses = isDark ? "text-gray-400" : "text-gray-600";
  const priceClasses = isDark ? "text-gray-100" : "text-[#004D5A]";
  const ratingTextClasses = isDark ? "text-gray-300" : "text-gray-700";
  const iconClasses = isDark ? "text-gray-500" : "text-gray-500";
  const salesClasses = isDark
    ? "text-gray-400 font-medium"
    : "text-gray-600 font-medium";
  const stockWarningClasses = isDark
    ? "bg-yellow-600 text-yellow-100"
    : "bg-yellow-500 text-white";

  const stockClasses = (stock: number) => {
    if (stock <= 5)
      return isDark ? "text-red-400 font-medium" : "text-red-600 font-medium";
    return isDark ? "text-gray-400" : "text-gray-600";
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
        return t("status.active");
      case "out_of_stock":
        return t("status.out_of_stock");
      case "low_stock":
        return t("status.low_stock");
      default:
        return status;
    }
  };

  // const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  //   e.currentTarget.src = "/api/placeholder/300/300";
  // };

  // Use fallback string for undefined
  const productName = isRTL ? product.nameAr || "" : product.name || "";
  const productCategory = isRTL
    ? product.categoryAr || ""
    : product.category || "";
  const productImage = product.image?.trim();

  return (
    <div
      className={`${cardClasses} rounded-lg shadow-sm border transition-all duration-200 overflow-hidden group`}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          // onError={handleImageError}
        />

        <div className="absolute top-2 right-2">
          <Badge
            variant={getStatusVariant(product.status ?? "")}
            isDark={isDark}
          >
            {getStatusText(product.status ?? "")}
          </Badge>
        </div>

        {/* Discount Badge */}
        {product.has_discount && product.discount_percentage && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
              -{product.discount_percentage}%
            </span>
          </div>
        )}

        {/* Stock warning overlay */}
        {(product.stock_quantity ?? 0) <= 5 &&
          product.status !== "out_of_stock" && (
            <div className="absolute bottom-2 left-2">
              <div
                className={`${stockWarningClasses} px-2 py-1 rounded text-xs font-medium transition-colors duration-200`}
              >
                {t("stockWarning", { count: product.stock_quantity ?? 0 })}
              </div>
            </div>
          )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="mb-3">
          <h3
            className={`font-semibold ${titleClasses} mb-1 line-clamp-2 leading-tight transition-colors duration-200`}
          >
            {productName}
          </h3>
          <p
            className={`text-sm ${categoryClasses} transition-colors duration-200`}
          >
            {productCategory}
          </p>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col gap-1">
            {/* Current Price */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xl font-bold ${priceClasses} transition-colors duration-200`}
              >
                $
                {product.has_discount && product.discounted_price
                  ? product.discounted_price.toFixed(2)
                  : product.price?.toFixed(2) || "0.00"}
              </span>

              {/* Original Price (crossed out) */}
              {product.has_discount && product.originalPrice && (
                <span
                  className={`text-sm line-through ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Discount Savings */}
            {product.has_discount && product.discount_amount && (
              <span className="text-xs text-green-600 font-medium">
                توفر ${product.discount_amount.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span
              className={`text-sm font-medium ${ratingTextClasses} transition-colors duration-200`}
            >
              {product.rating ?? 0}
            </span>
          </div>
        </div>

        {/* Stock and Sales Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Package
              className={`w-4 h-4 ${iconClasses} transition-colors duration-200`}
            />
            <span
              className={`${stockClasses(
                product.stock_quantity ?? 0
              )} transition-colors duration-200`}
            >
              {t("info.stock")} {product.stock_quantity ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={`${salesClasses} transition-colors duration-200`}>
              {product.sales ?? 0}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <ViewButton
            onClick={() => onView?.(product)}
            size="md"
            tooltip={t("actions.view")}
          />
          <EditButton
            onClick={() => onEdit?.(product)}
            size="md"
            tooltip={t("actions.edit")}
          />
          <DeleteButton
            onClick={() => onDelete?.(product)}
            size="md"
            tooltip={t("actions.delete")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
