"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "@/api/storeProduct";
import { ApiStore, getStore, ApiProduct } from "@/api/stores"; // ✅ استيراد ApiProduct من الملف الأصلي
import { ToastProvider, useToast } from '@/hooks/useToast';
import LoadingSpinner from "../ui/LoadingSpinner";

const DynamicProductsSection = dynamic(
  () => import("../organisms/ProductsSection"),
  {
    loading: () => <LoadingSpinner size="lg" message="جاري تحميل المنتجات..." overlay={true} />,
  }
);

// ✅ إضافة interface للاستجابة الجديدة فقط
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
    products: any[]; // ✅ استخدام any[] لتجنب التضارب
  };
}

// ✅ دالة محدثة لمعالجة الصور (تدعم المصفوفة والـ string)
function getFirstImageFromArray(imagesField: string[] | string | undefined): string {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultImage = `${BASE_URL}/default-product.jpg`;

  if (!imagesField) {
    console.log("📷 لا توجد صور، استخدام الافتراضية");
    return defaultImage;
  }

  try {
    // إذا كانت مصفوفة بالفعل (الحالة الجديدة)
    if (Array.isArray(imagesField) && imagesField.length > 0) {
      const firstImage = imagesField[0];
      if (firstImage && firstImage.trim() !== "" && firstImage !== "null") {
        const imageUrl = firstImage.startsWith("http") 
          ? firstImage 
          : `${BASE_URL}${firstImage.replace(/^\/+/, "/")}`;
        console.log("📷 صورة من المصفوفة:", imageUrl);
        return imageUrl;
      }
    }
    
    // إذا كانت string (الحالة القديمة)
    if (typeof imagesField === "string") {
      // محاولة تحليل JSON
      if (imagesField.startsWith("[") || imagesField.startsWith("{")) {
        const parsed = JSON.parse(imagesField);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstImage = parsed[0];
          if (firstImage && firstImage.trim() !== "") {
            const imageUrl = firstImage.startsWith("http") 
              ? firstImage 
              : `${BASE_URL}${firstImage.replace(/^\/+/, "/")}`;
            console.log("📷 صورة من JSON:", imageUrl);
            return imageUrl;
          }
        }
      } else {
        // معاملة كصورة واحدة
        const imageUrl = imagesField.startsWith("http") 
          ? imagesField 
          : `${BASE_URL}${imagesField.replace(/^\/+/, "/")}`;
        console.log("📷 صورة مباشرة:", imageUrl);
        return imageUrl;
      }
    }

    console.log("📷 فشل في معالجة الصور، استخدام الافتراضية");
    return defaultImage;
  } catch (err) {
    console.error("❌ خطأ في معالجة الصور:", err, imagesField);
    return defaultImage;
  }
}

// ✅ دالة تحويل محدثة - تقبل any لتجنب تضارب الأنواع
const convertApiProductToProduct = (
  apiProduct: any, // ✅ استخدام any لتجنب التضارب
  storeInfo?: any
): Product => {
  // استخدام الدالة المحدثة للصور
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
    image: imageUrl,
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

  const [products, setProducts] = useState<Product[]>([]);
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

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
        showToast("جاري تحميل بيانات المتجر...", "info");

        console.log("🔄 جلب بيانات المتجر...", storeId);
        const storeData = await getStore(parseInt(storeId)) as any; // ✅ استخدام any للمرونة
        
        console.log("✅ تم استلام بيانات المتجر:", storeData);

        // ✅ فحص تنسيق الاستجابة 
        let products: any[] = []; // ✅ استخدام any[] لتجنب التضارب
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
        
        // عرض تفاصيل المنتجات
        products.forEach((product, index) => {
          console.log(`منتج ${index + 1}:`, {
            id: product.product_id,
            name: product.name,
            price: product.price,
            stock: product.stock_quantity,
            images: product.images
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
              stock: product.stock_quantity
            });
            return convertApiProductToProduct(product, storeInfo);
          });
          
          console.log(`✅ تم تحويل ${convertedProducts.length} منتج بنجاح`);
          
          setStoreInfo(storeInfo);
          setProducts(convertedProducts);
          showToast(`${convertedProducts.length} منتج تم تحميله بنجاح!`, "success");
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

    fetchStoreData();
  }, [storeId, showToast]);

  // شاشة التحميل
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تحميل منتجات المتجر..."
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
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{ backgroundColor: "#F6F8F9" }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
        <div className="grid grid-cols-1 gap-8">
          <DynamicProductsSection
            products={products}
            storeId={storeInfo?.store_id}
            storeName={storeInfo?.store_name}
          />
        </div>
      </div>
    </div>
  );
}

// المكون الرئيسي مع ToastProvider
const ProductLayout: React.FC = () => {
  return (
    <ToastProvider>
      <Suspense
        fallback={
          <div
            className="min-h-screen flex items-center justify-center font-cairo"
            style={{ backgroundColor: "#F6F8F9" }}
          >
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