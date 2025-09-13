// components/templates/ProductLayout.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "@/api/storeProduct";
import { getStore, ApiStore as ImportedApiStore } from "@/api/stores";

const DynamicProductsSection = dynamic(
  () => import("../organisms/ProductsSection"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
    ),
  }
);

// نوع للمنتج من الـ API
interface ApiProduct {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  discount_percentage: string | null;
  stock_quantity: number;
  images: string;
  created_at: string;
  discounted_price: number;
  discount_amount: number;
  has_discount: boolean;
  averageRating: number;
  reviewsCount: number;
  original_price: number;
}
// في ProductLayout.tsx - استبدل interface ApiStore بهذا:
interface ApiStore {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string;
  logo_image: string;
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
  Products: ApiProduct[];
  discountStats?: {
    totalProductsWithDiscount: number;
    totalProducts: number;
    totalDiscountValue: number;
    discountPercentage: number;
  };
  averageRating?: number;
  reviewsCount?: number;
  totalRevenue?: number;
  totalOrders?: number;
  thisMonthRevenue?: number;
}

// تعريف الـ BASE_URL ودالة getFirstImage
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getFirstImage(imagesField: string | undefined): string {
  if (!imagesField) return `${BASE_URL}/default-product.jpg`;

  try {
    let parsed = JSON.parse(imagesField);

    // إذا كان النص نفسه عبارة عن JSON string لمصفوفة
    if (typeof parsed === "string" && parsed.startsWith("[")) {
      parsed = JSON.parse(parsed);
    } 

    const firstImage: unknown =
      Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;

    // تأكد أن firstImage نص
    if (typeof firstImage === "string" && firstImage.trim() !== "") {
      return firstImage.startsWith("http")
        ? firstImage
        : `${BASE_URL}/${firstImage.replace(/^\/+/, "")}`;
    }

    // fallback
    return `${BASE_URL}/default-product.jpg`;
  } catch (err) {
    console.error("Error parsing product images:", err, imagesField);
    return `${BASE_URL}/default-product.jpg`;
  }
}
// في ProductLayout.tsx - استبدل دالة convertApiProductToProduct بهذا:

const convertApiProductToProduct = (
  apiProduct: ApiProduct,
  storeInfo?: ApiStore
): Product => {
  const imageUrl = getFirstImage(apiProduct.images);

  // إصلاح نوع status - استخدام النوع الصحيح
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
    name: apiProduct.name,
    nameAr: apiProduct.name,
    category: "general",
    categoryAr: "عام",
    price: parseFloat(apiProduct.price),
    salePrice: apiProduct.has_discount ? apiProduct.discounted_price : undefined,
    originalPrice: apiProduct.original_price,
    rating: apiProduct.averageRating || Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviewCount: apiProduct.reviewsCount || Math.floor(Math.random() * 200) + 10,
    image: imageUrl,
    isNew: Math.random() > 0.8,
    stock: apiProduct.stock_quantity,
    status: productStatus, // استخدام النوع المُصحح
    description: apiProduct.description,
    descriptionAr: apiProduct.description,
    brand: storeInfo?.store_name || "متجر محلي",
    brandAr: storeInfo?.store_name || "متجر محلي",
    sales: Math.floor(Math.random() * 100) + 5,
    inStock: apiProduct.stock_quantity > 0,
    createdAt: apiProduct.created_at,
    
    // الحقول الجديدة للخصومات
    discountPercentage: apiProduct.discount_percentage ? parseFloat(apiProduct.discount_percentage) : undefined,
    discountAmount: apiProduct.has_discount ? apiProduct.discount_amount : undefined,
    hasDiscount: apiProduct.has_discount,
  };
};


function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get("store");
  const storeName = searchParams?.get("storeName");

  // حالات البيانات
  const [products, setProducts] = useState<Product[]>([]);
  const [storeInfo, setStoreInfo] = useState<ApiStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchStoreData = async () => {
    if (!storeId) {
      setError("معرف المتجر مطلوب");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔄 جلب بيانات المتجر...", storeId);
      const storeData = await getStore(parseInt(storeId));
      
      console.log("✅ تم استلام بيانات المتجر:", storeData);
      console.log("📦 عدد المنتجات:", storeData.Products?.length || 0);
      console.log("🛍️ مصفوفة المنتجات:", storeData.Products);

      // التحقق من وجود المنتجات بعد الجلب
      if (!storeData.Products || storeData.Products.length === 0) {
        console.error("❌ لا توجد منتجات في بيانات المتجر!");
        console.log("📊 البيانات الكاملة للمتجر:", storeData);
        
        // إعداد المتجر حتى لو لم توجد منتجات
        setStoreInfo(storeData as ApiStore);
        setProducts([]);
      } else {
        // تحويل المنتجات
        console.log("🔄 بدء تحويل المنتجات...");
        const convertedProducts = storeData.Products.map((product, index) => {
          console.log(`تحويل منتج ${index + 1}:`, product);
          return convertApiProductToProduct(product as ApiProduct, storeData as ApiStore);
        });
        
        setStoreInfo(storeData as ApiStore);
        setProducts(convertedProducts);
        
        console.log('🔢 عدد المنتجات المحولة:', convertedProducts.length);
        console.log('📦 أول منتج محول:', convertedProducts[0]);
      }
      
    } catch (err: any) {
      console.error("❌ خطأ في جلب البيانات:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ في جلب البيانات"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchStoreData();
}, [storeId]);

  const handleNavigateLeft = () => {
    console.log("التنقل لليسار");
  };

  const handleNavigateRight = () => {
    console.log("التنقل لليمين");
  };

  const handleViewDetails = (product: Product) => {
    alert(
      `عرض تفاصيل: ${
        product.nameAr || product.name
      }\n\nسيتم توجيهك لصفحة تفاصيل المنتج...`
    );
  };

  // عرض شاشة التحميل
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل منتجات المتجر...</p>
        </div>
      </div>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // عدم وجود منتجات
  if (products.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            لا توجد منتجات
          </h2>
          <p className="text-gray-500 mb-6">
            {storeInfo?.store_name || "هذا المتجر"} لا يحتوي على منتجات حالياً
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen mt-20 font-cairo"
      style={{ backgroundColor: "#F6F8F9" }}
    >
      <div className="mx-auto">
        {/* رسالة ترحيب مع معلومات المتجر الحقيقية ومعلومات الخصومات */}
        {storeInfo && (
          <div className="p-6 mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">🏪</span>
              <h2 className="text-xl font-bold text-teal-800">
                مرحباً بك في {storeInfo.store_name}!
              </h2>
            </div>
            <p className="text-teal-600 mb-2">{storeInfo.description}</p>
            <p className="text-sm text-teal-500 mb-3">
              📍 {storeInfo.store_address} | 📞 {storeInfo.User.whatsapp_number} | 📦 {products.length} منتج متوفر
            </p>
            
          </div>
        )}

<div className="grid grid-cols-1 gap-8">
  <DynamicProductsSection
    products={products}
    onViewDetails={handleViewDetails}
    storeId={storeInfo?.store_id} // تمرير معرف المتجر
    storeName={storeInfo?.store_name} // تمرير اسم المتجر
  />
</div>

        {/* قسم الشكر مع إحصائيات المتجر */}
        <div
          className="mt-12 p-8 rounded-2xl text-center shadow-lg"
          style={{ backgroundColor: "#f9fafb" }}
        >
          <div className="max-w-2xl mx-auto">
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "#111827" }}
            >
              شكراً لزيارة {storeInfo?.store_name || "متجرنا"}! 🙏
            </h3>
            <p className="text-lg mb-2" style={{ color: "#1f2937" }}>
              نقدر ثقتكم بنا ونسعى دائماً لتقديم أفضل المنتجات والخدمات
            </p>
            <p className="text-base mb-4" style={{ color: "#374151" }}>
              تجربة تسوق ممتعة ومريحة هي هدفنا الأول
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductLayout: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center font-cairo"
          style={{ backgroundColor: "#F6F8F9" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل المنتجات...</p>
          </div>
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
};

export default ProductLayout;