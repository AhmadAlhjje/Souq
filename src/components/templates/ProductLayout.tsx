// components/templates/ProductLayout.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "@/types/product";
import { getStore } from "@/api/stores"; // تأكد من المسار الصحيح

// // تحميل المكونات بشكل ديناميكي
// const DynamicSaleCarousel = dynamic(() => import('../organisms/SaleProductsCarousel'), {
//   loading: () => (
//     <div className="animate-pulse bg-gray-200 rounded-2xl h-64 mb-8"></div>
//   ),
// });

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
  stock_quantity: number;
  images: string;
  created_at: string;
}

// نوع للمتجر من الـ API
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
}
// تعريف الـ BASE_URL ودالة getFirstImage
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.4:4000";

function getFirstImage(imagesField: string | undefined): string {
  if (!imagesField) return `${BASE_URL}/default-product.jpg`;

  try {
    let parsed = JSON.parse(imagesField);

    // إذا كان النص نفسه عبارة عن JSON string لمصفوفة
    if (typeof parsed === "string" && parsed.startsWith("[")) {
      parsed = JSON.parse(parsed);
    }

    let firstImage: unknown =
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

// تحويل منتج API إلى المنتج المحلي
const convertApiProductToProduct = (
  apiProduct: ApiProduct,
  storeInfo?: ApiStore
): Product => {
  const imageUrl = getFirstImage(apiProduct.images);

  return {
    id: apiProduct.product_id,
    name: apiProduct.name,
    nameAr: apiProduct.name,
    category: "general",
    categoryAr: "عام",
    price: parseFloat(apiProduct.price),
    salePrice:
      Math.random() > 0.7
        ? Math.round(parseFloat(apiProduct.price) * 0.8)
        : undefined,
    originalPrice: parseFloat(apiProduct.price),
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 200) + 10,
    image: imageUrl,
    isNew: Math.random() > 0.8,
    stock: apiProduct.stock_quantity,
    status: apiProduct.stock_quantity > 0 ? "active" : "out_of_stock",
    description: apiProduct.description,
    descriptionAr: apiProduct.description,
    brand: storeInfo?.store_name || "متجر محلي",
    brandAr: storeInfo?.store_name || "متجر محلي",
    sales: Math.floor(Math.random() * 100) + 5,
    inStock: apiProduct.stock_quantity > 0,
    createdAt: apiProduct.created_at,
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

  // جلب البيانات عند تحميل الصفحة
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

        console.log("✅ تم جلب البيانات:", storeData);
        setStoreInfo(storeData);

        // تحويل المنتجات
        const convertedProducts = storeData.Products.map((product) =>
          convertApiProductToProduct(product, storeData)
        );

        setProducts(convertedProducts);
        console.log(`✅ تم تحويل ${convertedProducts.length} منتج`);
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

  // المنتجات المخفضة
  const saleProducts = products.filter(
    (product) => product.salePrice && product.salePrice > 0
  );

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
        {/* رسالة ترحيب مع معلومات المتجر الحقيقية */}
        {storeInfo && (
          <div className="p-6 mb-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">🏪</span>
              <h2 className="text-xl font-bold text-teal-800">
                مرحباً بك في {storeInfo.store_name}!
              </h2>
            </div>
            <p className="text-teal-600 mb-2">{storeInfo.description}</p>
            <p className="text-sm text-teal-500">
              📍 {storeInfo.store_address} | 📞 {storeInfo.User.whatsapp_number}{" "}
              | 📦 {products.length} منتج متوفر
            </p>
            {/* {saleProducts.length > 0 && (
              <p className="text-sm text-red-600 mt-2">
                🔥 {saleProducts.length} منتج مخفض متاح الآن!
              </p>
            )} */}
          </div>
        )}

        {/* عرض المنتجات المخفضة إذا وُجدت
        {saleProducts.length > 0 && (
          <DynamicSaleCarousel 
            saleProducts={saleProducts}
            onNavigateLeft={handleNavigateLeft}
            onNavigateRight={handleNavigateRight}
          />
        )} */}

        <div className="grid grid-cols-1 gap-8">
          <DynamicProductsSection
            products={products}
            onViewDetails={handleViewDetails}
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
