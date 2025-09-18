"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Check } from "lucide-react";
import Card from "../atoms/Card";
import { SimpleStarRating } from "../molecules/StarRating";
import { SimplePriceDisplay } from "../molecules/PriceDisplay";
import { useCart, useCartNotifications } from "@/contexts/CartContext";
import { useThemeContext } from "@/contexts/ThemeContext";

// استيراد النوع الأساسي
import { Product as BaseProduct } from "@/types/product";

// عمل نوع ممتد (لحقول إضافية من الـ API)
interface ExtendedProduct extends BaseProduct {
  sale_price?: number;
  original_price?: number;
  salePrice?: number;
  originalPrice?: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: ExtendedProduct;
  onViewDetails?: (product: ExtendedProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const [localQuantity, setLocalQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);

  const router = useRouter();
  const { addToCart, isItemInCart, getItemQuantity, updateQuantity } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();
  const { theme, isDark, isLight } = useThemeContext();

  // دالة للحصول على ألوان وأنماط الثيم
  const getThemeClasses = () => {
    return {
      // خلفية البطاقة
      cardBg: isDark 
        ? "bg-gray-800 border border-gray-700" 
        : "bg-white border border-gray-100",
      
      // خلفية الصورة
      imageBg: isDark 
        ? "bg-gray-700" 
        : "bg-gray-50",
      
      // نص العنوان
      titleText: isDark 
        ? "text-white" 
        : "text-gray-900",
      
      // النص الثانوي
      secondaryText: isDark 
        ? "text-gray-300" 
        : "text-gray-600",
      
      // زر التفاصيل
      detailsButton: isDark 
        ? "border border-teal-400 text-teal-400 hover:bg-teal-400/10 hover:text-teal-300" 
        : "border border-teal-800 text-teal-800 hover:bg-teal-50",
      
      // زر الإضافة للسلة (عادي)
      addButton: isDark 
        ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/25" 
        : "bg-teal-800 hover:bg-teal-900 text-white shadow-md",
      
      // زر الإضافة للسلة (نجح)
      successButton: isDark 
        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25" 
        : "bg-green-500 hover:bg-green-600 text-white shadow-md",
      
      // شارة الخصم
      discountBadge: isDark 
        ? "bg-red-500 text-white shadow-lg shadow-red-500/25" 
        : "bg-red-500 text-white shadow-md",
      
      // شارة جديد
      newBadge: isDark 
        ? "bg-green-500 text-white shadow-lg shadow-green-500/25" 
        : "bg-green-500 text-white shadow-md",
      
      // ظلال البطاقة
      cardShadow: isDark 
        ? "shadow-lg shadow-gray-900/25 hover:shadow-xl hover:shadow-gray-900/40" 
        : "shadow-sm hover:shadow-lg shadow-gray-500/10",
      
      // الخطوط والحدود
      border: isDark 
        ? "border-gray-600" 
        : "border-gray-200",
      
      // خلفية متحركة للتفاعل
      hoverOverlay: isDark 
        ? "bg-gradient-to-br from-teal-500/5 to-transparent" 
        : "bg-gradient-to-br from-teal-50/50 to-transparent",
    };
  };

  const themeClasses = getThemeClasses();

  // تحميل الكمية من السلة عند فتح الكارت
  useEffect(() => {
    const productId =
      typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
    if (productId && !isNaN(productId)) {
      const cartQuantity = getItemQuantity(productId);
      if (cartQuantity > 0) {
        setLocalQuantity(cartQuantity);
      }
    }
  }, [product.id, getItemQuantity]);

  const handleQuantityIncrease = () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    const productId =
      typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
    if (productId && !isNaN(productId) && isItemInCart(productId)) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleQuantityDecrease = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      const productId =
        typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
      if (productId && !isNaN(productId) && isItemInCart(productId)) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      addToCart(product, localQuantity);
      showAddToCartSuccess(product.name, localQuantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("خطأ في إضافة المنتج للسلة:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const calculateDiscountPercentage = (
    originalPrice?: number,
    salePrice?: number
  ): number => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const handleImageError = () => {
    console.warn("فشل تحميل الصورة:", product.image);
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError) {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop";
    }
    if (product.image && product.image.startsWith("http")) {
      return product.image;
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    return `${baseUrl}/uploads/${product.image}`;
  };

  // نطبق الأسعار سواء camelCase أو snake_case
  const originalPrice = product.originalPrice ?? product.original_price;
  const salePrice = product.salePrice ?? product.sale_price;

  return (
    <div className={`${themeClasses.cardBg} ${themeClasses.cardShadow} rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105 relative`}>
      {/* طبقة التفاعل */}
      <div className={`absolute inset-0 ${themeClasses.hoverOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl`}></div>

      <div className={`relative overflow-hidden ${themeClasses.imageBg} transition-colors duration-300`}>
        <img
          src={getImageSrc()}
          alt={product.name || "منتج"}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
          style={{
            maxWidth: "100%",
            height: "176px",
            objectFit: "cover",
          }}
        />

        {/* شارة الخصم */}
        {salePrice && originalPrice && calculateDiscountPercentage(originalPrice, salePrice) > 0 && (
          <div className={`absolute top-2 right-2 ${themeClasses.discountBadge} px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 hover:scale-110`}>
            -{calculateDiscountPercentage(originalPrice, salePrice)}%
          </div>
        )}

        {/* شارة جديد */}
        {product.isNew && (
          <div className={`absolute top-2 left-2 ${themeClasses.newBadge} px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 hover:scale-110`}>
            جديد
          </div>
        )}

        {/* مؤشر الثيم في الزاوية */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-800/80 text-gray-300' : 'bg-white/80 text-gray-600'} backdrop-blur-sm`}>
            {isDark ? "🌙" : "☀️"}
          </div>
        </div>
      </div>

      <div className="p-2 text-right relative z-10">
        <h3 className={`text-sm font-semibold ${themeClasses.titleText} mb-3 line-clamp-2 transition-colors duration-300`}>
          {product.name || "منتج بدون اسم"}
        </h3>

        <div className="mb-1 flex justify-end">
          <SimpleStarRating rating={product.rating || 0} />
        </div>

        <div className="mb-2">
          <SimplePriceDisplay
            originalPrice={originalPrice || product.price || 0}
            salePrice={salePrice}
          />
        </div>

        <div className="mb-2 flex items-center justify-end">
          {/* CompactQuantityCounter مع دعم الثيم المحسن */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleQuantityDecrease}
              disabled={localQuantity <= 1}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${
                localQuantity <= 1
                  ? isDark
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
              }`}
            >
              -
            </button>
            
            <span className={`px-2 text-xs font-medium min-w-[24px] text-center ${themeClasses.titleText} transition-colors duration-300`}>
              {localQuantity}
            </span>
            
            <button
              onClick={handleQuantityIncrease}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-110 active:scale-95 ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
              }`}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex" style={{ gap: "12px" }}>
          <button
            onClick={handleViewDetails}
            className={`flex-1 ${themeClasses.detailsButton} text-xs py-1.5 rounded-md transition-all duration-200 flex items-center justify-center gap-1 hover:scale-105 active:scale-95`}
          >
            <Eye className="w-3 h-3" />
            <span>التفاصيل</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 text-xs py-1.5 rounded-md transition-all duration-200 flex items-center justify-center gap-1 hover:scale-105 active:scale-95 ${
              showSuccess
                ? themeClasses.successButton
                : themeClasses.addButton
            } ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {showSuccess ? (
              <>
                <Check className="w-3 h-3 animate-bounce" />
                <span>تمت الإضافة</span>
              </>
            ) : isAdding ? (
              <>
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* تأثير برق خفيف عند النجاح */}
      {showSuccess && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent animate-pulse rounded-xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default ProductCard;