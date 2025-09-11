// components/molecules/admin/products/ProductViewModal.tsx
import React from "react";
import {
  X,
  Package,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Tag,
  Eye,
  Percent,
  ShoppingCart,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { Product } from "../../../../types/product";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const Badge: React.FC<{
  variant: "success" | "warning" | "danger" | "info" | "neutral" | "discount";
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
    discount: isDark
      ? "bg-orange-900/30 text-orange-400 border-orange-800"
      : "bg-orange-100 text-orange-800 border-orange-200",
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
  product,
}) => {
  const { t, i18n } = useTranslation("");
  const { isDark } = useTheme();
  const isRTL = i18n.language === "ar";

  if (!isOpen || !product) return null;

  let images: string[] = [];

  try {
    if (product.images) {
      // product.images قد يكون string (JSON) أو array
      images =
        typeof product.images === "string"
          ? JSON.parse(product.images).map((img: string) =>
              img.replace(/^['"]|['"]$/g, "")
            )
          : product.images;
    }
    console.log("images[0]", images[0]);
  } catch (e) {
    images = ["/api/placeholder/400/400"]; // fallback
  }

  // إذا لم يكن هناك أي صورة
  if (!images || images.length === 0) {
    images = ["/api/placeholder/400/400"];
  }

  // معالجة الخصم
  const hasDiscount =
    product.discount_percentage != null && product.discount_percentage > 0;
  const originalPrice = parseFloat(product.price?.toString() || "0");
  const discountPercentage =
    hasDiscount && product.discount_percentage != null
      ? parseFloat(product.discount_percentage.toString())
      : 0;
  const discountAmount = hasDiscount
    ? (originalPrice * discountPercentage) / 100
    : 0;
  const finalPrice = hasDiscount
    ? originalPrice - discountAmount
    : originalPrice;

  // Theme-based classes
  const modalClasses = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-300";

  const overlayClasses = isDark ? "bg-black/60" : "bg-black/50";

  const titleClasses = isDark ? "text-gray-100" : "text-[#004D5A]";

  const textClasses = isDark ? "text-gray-300" : "text-gray-700";

  const labelClasses = isDark ? "text-gray-400" : "text-gray-600";

  const valueClasses = isDark ? "text-gray-200" : "text-gray-800";

  const priceClasses = isDark ? "text-green-400" : "text-green-600";

  const stockClasses = (stock: number) => {
    if (stock <= 5) {
      return isDark ? "text-red-400 font-medium" : "text-red-600 font-medium";
    }
    return isDark ? "text-gray-300" : "text-gray-700";
  };

  const getStatusVariant = (stock: number) => {
    if (stock <= 0) return "danger";
    if (stock <= 5) return "warning";
    return "success";
  };

  const getStatusText = (stock: number) => {
    if (stock <= 0) return "نفدت الكمية";
    if (stock <= 5) return "كمية قليلة";
    return "متوفر";
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClasses}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`
        ${modalClasses} 
        rounded-lg shadow-xl border max-w-5xl w-full mx-4 max-h-[90vh] overflow-auto
        transition-colors duration-200
      `}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${titleClasses} flex items-center gap-3`}
          >
            <Eye className="w-6 h-6" />
            تفاصيل المنتج
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${images[0]}`}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg border border-gray-200"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge
                    variant={getStatusVariant(product.stock_quantity || 0)}
                    isDark={isDark}
                  >
                    {getStatusText(product.stock_quantity || 0)}
                  </Badge>
                  {hasDiscount && (
                    <Badge variant="discount" isDark={isDark}>
                      <Percent className="w-3 h-3 mr-1" />
                      خصم {discountPercentage}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-20 object-cover rounded border border-gray-200"
                      onError={handleImageError}
                    />
                  ))}
                  {images.length > 4 && (
                    <div
                      className={`w-full h-20 rounded border border-gray-200 flex items-center justify-center ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h3 className={`text-3xl font-bold ${titleClasses} mb-2`}>
                    {product.name}
                  </h3>
                  <p className={`text-lg ${textClasses}`}>
                    رقم المنتج: {product.product_id}
                  </p>
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h4
                      className={`text-lg font-semibold ${labelClasses} mb-2`}
                    >
                      الوصف
                    </h4>
                    <p className={`${textClasses} leading-relaxed`}>
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Stock and Store Info */}
              <div className="grid grid-cols-1 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Package className={`w-5 h-5 ${labelClasses}`} />
                    <span className={`text-sm font-medium ${labelClasses}`}>
                      الكمية المتوفرة
                    </span>
                  </div>
                  <span
                    className={`text-xl font-bold ${stockClasses(
                      product.stock_quantity || 0
                    )}`}
                  >
                    {product.stock_quantity || 0} قطعة
                  </span>
                </div>

                {product.Store && (
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className={`w-5 h-5 ${labelClasses}`} />
                      <span className={`text-sm font-medium ${labelClasses}`}>
                        المتجر
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {product.Store.logo_image && (
                        <img
                          src={product.Store.logo_image}
                          alt={product.Store.store_name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          onError={handleImageError}
                        />
                      )}
                      <div>
                        <p className={`font-medium ${valueClasses}`}>
                          {product.Store.store_name}
                        </p>
                        {product.Store.description && (
                          <p className={`text-sm ${labelClasses}`}>
                            {product.Store.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className={`font-medium ${labelClasses}`}>
                    تاريخ الإنشاء
                  </span>
                  <span className={`${valueClasses}`}>
                    {new Date(
                      product.created_at || Date.now()
                    ).toLocaleDateString("ar-SA")}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className={`font-medium ${labelClasses}`}>
                    رقم المتجر
                  </span>
                  <span className={`${valueClasses}`}>{product.store_id}</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold ${titleClasses} border-b pb-2 ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  الأسعار والخصومات
                </h3>

                {/* Price Display */}
                <div
                  className={`p-6 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-50"
                  } space-y-4`}
                >
                  {hasDiscount ? (
                    <>
                      {/* Original Price (crossed out) */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${labelClasses}`}>
                          السعر الأصلي:
                        </span>
                        <span
                          className={`text-lg line-through ${labelClasses}`}
                        >
                          {originalPrice.toFixed(2)} $
                        </span>
                      </div>

                      {/* Discount Percentage */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${labelClasses}`}>
                          نسبة الخصم:
                        </span>
                        <span className="text-lg font-bold text-orange-500">
                          {discountPercentage}%
                        </span>
                      </div>

                      {/* Discount Amount */}
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${labelClasses}`}>
                          مقدار الخصم:
                        </span>
                        <span className="text-lg font-bold text-red-500">
                          -{discountAmount.toFixed(2)} $
                        </span>
                      </div>

                      <hr
                        className={
                          isDark ? "border-gray-600" : "border-gray-300"
                        }
                      />

                      {/* Final Price */}
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${labelClasses}`}>
                          السعر النهائي:
                        </span>
                        <span className={`text-2xl font-bold ${priceClasses}`}>
                          {finalPrice.toFixed(2)} $
                        </span>
                      </div>
                    </>
                  ) : (
                    /* No Discount */
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <DollarSign className={`w-6 h-6 ${labelClasses}`} />
                        <span className={`text-lg font-medium ${labelClasses}`}>
                          السعر
                        </span>
                      </div>
                      <span className={`text-3xl font-bold ${priceClasses}`}>
                        {originalPrice.toFixed(2)} $
                      </span>
                    </div>
                  )}
                </div>

                {/* Reviews Summary */}
                
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end p-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isDark
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
