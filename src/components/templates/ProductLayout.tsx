"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import dynamic from "next/dynamic";
import { Product } from "@/api/storeProduct";
import { ApiStore, getStore, ApiProduct } from "@/api/stores";
import { ToastProvider, useToast } from '@/hooks/useToast';
import { useThemeContext } from '@/contexts/ThemeContext';
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "@/components/atoms/Button";

const DynamicProductsSection = dynamic(
  () => import("../organisms/ProductsSection"),
  {
    loading: () => <LoadingSpinner size="lg" message="جاري تحميل المنتجات..." overlay={true} />,
  }
);

interface StoreApiResponse {
  success: boolean;
  store: {
    store_id: number;
    user_id: number;
    store_name: string;
    store_address: string;
    description: string;
    images: string[];
    logo_image: string;
    is_blocked: boolean;
    created_at: string;
    User: {
      username: string;
      whatsapp_number: string;
      role: string;
    };
    storeReviews: any[];
    storeAverageRating: number;
    storeReviewsCount: number;
    overallAverageRating: number;
    totalReviewsCount: number;
    reviewStats: {
      total: number;
      verified: number;
      pending: number;
    };
    totalRevenue: number;
    totalOrders: number;
    thisMonthRevenue: number;
    discountStats: {
      totalProductsWithDiscount: number;
      totalProducts: number;
      totalDiscountValue: number;
      discountPercentage: number;
    };
    products: any[];
  };
}

// دالة مُصححة لمعالجة الصور - تدعم المصفوفات والنصوص
function getFirstImageFromArray(imagesField: string[] | string | undefined): string {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
  const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";

  if (!imagesField) {
    console.log("📷 لا توجد صور، استخدام الافتراضية");
    return DEFAULT_PRODUCT_IMAGE;
  }

  try {
    // إذا كانت مصفوفة بالفعل (الحالة الجديدة)
    if (Array.isArray(imagesField)) {
      console.log("📷 الصور عبارة عن مصفوفة:", imagesField);
      
      if (imagesField.length > 0) {
        const firstImage = imagesField[0];
        
        // فحص إذا كانت الصورة صالحة وحقيقية
        if (firstImage && 
            typeof firstImage === 'string' &&
            firstImage.trim() !== "" && 
            firstImage !== "null" &&
            !firstImage.includes('placehold.co') && 
            !firstImage.includes('unsplash.com')) {
          
          const imageUrl = firstImage.startsWith("http") 
            ? firstImage 
            : `${BASE_URL}${firstImage.startsWith('/') ? firstImage : '/' + firstImage}`;
          
          console.log("📷 صورة حقيقية من المصفوفة:", imageUrl);
          return imageUrl;
        }
      }
      
      console.log("📷 مصفوفة فارغة أو صور غير صالحة، استخدام الافتراضية");
      return DEFAULT_PRODUCT_IMAGE;
    }
    
    // إذا كانت string (الحالة القديمة)
    if (typeof imagesField === "string") {
      console.log("📷 الصور عبارة عن نص:", imagesField);
      
      // محاولة تحليل JSON إذا بدأ بأقواس
      if (imagesField.startsWith("[") || imagesField.startsWith("{")) {
        try {
          const parsed = JSON.parse(imagesField);
          console.log("📷 تم تحليل JSON:", parsed);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstImage = parsed[0];
            
            if (firstImage && 
                typeof firstImage === 'string' &&
                firstImage.trim() !== "" &&
                !firstImage.includes('placehold.co') && 
                !firstImage.includes('unsplash.com')) {
              
              const imageUrl = firstImage.startsWith("http") 
                ? firstImage 
                : `${BASE_URL}${firstImage.startsWith('/') ? firstImage : '/' + firstImage}`;
              
              console.log("📷 صورة حقيقية من JSON:", imageUrl);
              return imageUrl;
            }
          }
        } catch (jsonError) {
          console.warn("❌ خطأ في تحليل JSON:", jsonError);
        }
      } else {
        // معاملة النص كاسم ملف واحد
        if (imagesField.trim() !== "" &&
            !imagesField.includes('placehold.co') && 
            !imagesField.includes('unsplash.com')) {
          
          const imageUrl = imagesField.startsWith("http") 
            ? imagesField 
            : `${BASE_URL}${imagesField.startsWith('/') ? imagesField : '/' + imagesField}`;
          
          console.log("📷 صورة حقيقية مباشرة:", imageUrl);
          return imageUrl;
        }
      }
    }

    console.log("📷 لم توجد صورة صالحة، استخدام الافتراضية");
    return DEFAULT_PRODUCT_IMAGE;
  } catch (err) {
    console.error("❌ خطأ في معالجة الصور:", err, imagesField);
    return DEFAULT_PRODUCT_IMAGE;
  }
}

// دالة تحويل محدثة
const convertApiProductToProduct = (
  apiProduct: any,
  storeInfo?: any
): Product => {
  // استخدام الدالة المُصححة للصور
  const imageUrl = getFirstImageFromArray(apiProduct.images);

  let productStatus: "active" | "out_of_stock" | "low_stock";
  
  if (apiProduct.stock_quantity <= 0) {
    productStatus = "out_of_stock";
  } else if (apiProduct.stock_quantity <= 5) {
    productStatus = "low_stock";
  } else {
    productStatus = "active";
  }

  return {
    id: apiProduct.product_id,
    product_id: apiProduct.product_id,
    store_id: storeInfo?.store_id || apiProduct.store_id,
    stock_quantity: apiProduct.stock_quantity,
    name: apiProduct.name,
    nameAr: apiProduct.name,
    category: "general",
    categoryAr: "عام",
    price: parseFloat(apiProduct.price),
    salePrice: apiProduct.has_discount ? apiProduct.discounted_price : undefined,
    originalPrice: apiProduct.original_price,
    rating: apiProduct.averageRating || Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviewCount: apiProduct.reviewsCount || Math.floor(Math.random() * 200) + 10,
    image: imageUrl, // الآن سيأخذ الصورة الحقيقية إذا وُجدت
    isNew: Math.random() > 0.8,
    stock: apiProduct.stock_quantity,
    status: productStatus,
    description: apiProduct.description,
    descriptionAr: apiProduct.description,
    brand: storeInfo?.store_name || "متجر محلي",
    brandAr: storeInfo?.store_name || "متجر محلي",
    sales: Math.floor(Math.random() * 100) + 5,
    inStock: apiProduct.stock_quantity > 0,
    createdAt: apiProduct.created_at,
    discountPercentage: apiProduct.discount_percentage ? parseFloat(apiProduct.discount_percentage) : undefined,
    discountAmount: apiProduct.has_discount ? apiProduct.discount_amount : undefined,
    hasDiscount: apiProduct.has_discount,
  };
};

function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get("store");
  const storeName = searchParams?.get("storeName");
  const { theme, toggleTheme, isDark, isLight } = useThemeContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const { showToast } = useToast();

  const getBackgroundGradient = () => {
    if (isLight) {
      return 'linear-gradient(135deg, #96EDD9 0%, #96EDD9 20%, #96EDD9 50%, #96EDD9 80%, #FFFFFF 100%)';
    } else {
      return 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)';
    }
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError("معرف المتجر مطلوب");
        showToast("معرف المتجر غير موجود", "error");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("🔄 جلب بيانات المتجر...", storeId);
        const storeData = await getStore(parseInt(storeId)) as any;
        
        console.log("✅ تم استلام بيانات المتجر:", storeData);

        let products: any[] = [];
        let storeInfo: any = null;

        // فحص الاستجابة الجديدة
        if (storeData && typeof storeData === 'object' && 'store' in storeData) {
          const response = storeData as StoreApiResponse;
          if (response.store && response.store.products) {
            products = response.store.products;
            storeInfo = response.store;
            console.log("✅ تم العثور على المنتجات في store.products");
          }
        } 
        // فحص الاستجابة القديمة
        else if (storeData && 'Products' in storeData) {
          const oldResponse = storeData as ApiStore;
          if (oldResponse.Products) {
            products = oldResponse.Products;
            storeInfo = oldResponse;
            console.log("✅ تم العثور على المنتجات في Products");
          }
        }
        // فحص حالة أخرى
        else if (storeData && 'products' in storeData) {
          products = storeData.products;
          storeInfo = storeData;
          console.log("✅ تم العثور على المنتجات في products");
        }

        console.log(`📦 عدد المنتجات المستخرجة: ${products.length}`);
        
        // عرض تفاصيل المنتجات مع الصور
        products.forEach((product, index) => {
          console.log(`منتج ${index + 1}:`, {
            id: product.product_id,
            name: product.name,
            price: product.price,
            stock: product.stock_quantity,
            images: product.images,
            imageProcessed: getFirstImageFromArray(product.images)
          });
        });

        if (!products || products.length === 0) {
          console.error("❌ لا توجد منتجات في بيانات المتجر!");
          setStoreInfo(storeInfo);
          setProducts([]);
          showToast("لا توجد منتجات متاحة في هذا المتجر حاليًا", "warning");
        } else {
          console.log("🔄 بدء تحويل المنتجات...");
          
          const convertedProducts = products.map((product, index) => {
            console.log(`تحويل منتج ${index + 1}:`, {
              id: product.product_id,
              name: product.name,
              price: product.price,
              stock: product.stock_quantity,
              originalImages: product.images,
              processedImage: getFirstImageFromArray(product.images)
            });
            return convertApiProductToProduct(product, storeInfo);
          });
          
          console.log(`✅ تم تحويل ${convertedProducts.length} منتج بنجاح`);
          
          setStoreInfo(storeInfo);
          setProducts(convertedProducts);
          setHasLoaded(true);

          // Toast إضافي للترحيب
          setTimeout(() => {
          }, 2000);
        }
        
      } catch (err: any) {
        console.error("❌ خطأ في جلب البيانات:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "حدث خطأ في جلب البيانات";
        setError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    const startTime = Date.now();
    const timer = setTimeout(() => {
      const loadTime = Date.now() - startTime;
      fetchStoreData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [storeId, showToast]);

  // شاشة التحميل
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo p-4 transition-all duration-500"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تجميل المنتجات..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  // شاشة الخطأ
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo transition-all duration-500"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        {/* شريط علوي مع زر تبديل الثيم */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex justify-between items-center px-4 py-3">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full p-2"
              startIcon={isLight ? <Moon size={18} /> : <Sun size={18} />}
            >
              {isLight ? 'الوضع المظلم' : 'الوضع المضيء'}
            </Button>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <h1 className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                خطأ في التحميل
              </h1>
            </div>
          </div>
        </div>

        <div className="text-center max-w-md mx-auto p-8 mt-20">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>حدث خطأ</h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>{error}</p>
          <button
            onClick={() => {
              window.location.reload();
              showToast("تم إعادة تحميل الصفحة", "info");
            }}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // شاشة لا توجد منتجات
  if (products.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo transition-all duration-500"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        {/* شريط علوي مع زر تبديل الثيم */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="flex justify-between items-center px-4 py-3">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full p-2"
              startIcon={isLight ? <Moon size={18} /> : <Sun size={18} />}
            >
              {isLight ? 'الوضع المظلم' : 'الوضع المضيء'}
            </Button>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <h1 className={`text-lg font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {storeInfo?.store_name || "المتجر"}
              </h1>
            </div>
          </div>
        </div>

        <div className="text-center max-w-md mx-auto p-8 mt-20">
          <div className={`text-6xl mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          }`}>📦</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            لا توجد منتجات
          </h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {storeInfo?.store_name || "هذا المتجر"} لا يحتوي على منتجات حالياً
          </p>
        </div>
      </div>
    );
  }

  return (  
    <div
      className="min-h-screen font-cairo transition-all duration-500 relative"
      style={{
        background: getBackgroundGradient(),
        backgroundAttachment: 'fixed',
      }}
    >
      {/* شريط علوي مع زر تبديل الثيم */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-center px-4 py-3">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            startIcon={isLight ? <Moon size={18} /> : <Sun size={18} />}
          >
            {isLight ? 'الوضع المظلم' : 'الوضع المضيء'}
          </Button>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <h1 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              {storeInfo?.store_name || "منتجات المتجر"}
            </h1>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div
        className={`transition-opacity duration-1000 ${
          hasLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pt-20">
          <div className="mx-auto">
            <div className="grid grid-cols-1 gap-8">
              <DynamicProductsSection
                products={products}
                storeId={storeInfo?.store_id}
                storeName={storeInfo?.store_name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS مخصص للتأثيرات */}
      <style jsx global>{`
        .opacity-0 {
          opacity: 0;
        }
        .opacity-100 {
          opacity: 1;
        }

        /* تأثيرات hover للتفاعل */
        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        /* تأثير pulse للعناصر المهمة */
        .pulse-glow {
          animation: pulse-glow 3s infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(52, 211, 153, 0);
          }
          50% {
            box-shadow: 0 0 20px rgba(52, 211, 153, 0.3);
          }
        }

        /* تحسين responsive للأجهزة الصغيرة */
        @media (max-width: 768px) {
          .fixed.left-4 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// المكون الرئيسي مع ToastProvider
const ProductLayout: React.FC = () => {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center font-cairo bg-gradient-to-br from-gray-50 to-gray-100">
            <LoadingSpinner
              size="lg"
              color="green"
              message="جاري تحميل المنتجات..."
              overlay={true}
              pulse={true}
              dots={true}
            />
          </div>
        }
      >
        <ProductContent />
      </Suspense>
    </ToastProvider>
  );
};

export default ProductLayout;