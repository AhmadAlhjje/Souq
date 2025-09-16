// components/templates/ProductLayout.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "@/api/storeProduct";
import { ApiStore, getStore, ApiStore as ImportedApiStore } from "@/api/stores";
import { MapPin, Phone, ShoppingBag } from "lucide-react";
import { ToastProvider, useToast } from '@/hooks/useToast';
import LoadingSpinner from "../ui/LoadingSpinner";

const DynamicProductsSection = dynamic(
  () => import("../organisms/ProductsSection"),
  {
    loading: () => <LoadingSpinner size="lg" message="جاري تحميل المنتجات..." overlay={true} />,
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

// تعريف الـ BASE_URL ودالة getFirstImage
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getFirstImage(imagesField: string | undefined): string {
  if (!imagesField) return `${BASE_URL}/default-product.jpg`;

  try {
    let parsed = JSON.parse(imagesField);

    if (typeof parsed === "string" && parsed.startsWith("[")) {
      parsed = JSON.parse(parsed);
    }

    const firstImage: unknown =
      Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : parsed;

    if (typeof firstImage === "string" && firstImage.trim() !== "") {
      return firstImage.startsWith("http")
        ? firstImage
        : `${BASE_URL}/${firstImage.replace(/^\/+/, "")}`;
    }

    return `${BASE_URL}/default-product.jpg`;
  } catch (err) {
    console.error("Error parsing product images:", err, imagesField);
    return `${BASE_URL}/default-product.jpg`;
  }
}

const convertApiProductToProduct = (
  apiProduct: ApiProduct,
  storeInfo?: ApiStore
): Product => {
  const imageUrl = getFirstImage(apiProduct.images);

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

// 👇 تم تعديل ProductContent لاستخدام useToast
function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get("store");
  const storeName = searchParams?.get("storeName");

  const [products, setProducts] = useState<Product[]>([]);
  const [storeInfo, setStoreInfo] = useState<ApiStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast(); // 🚀 استخدام hook toast

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
        const storeData = await getStore(parseInt(storeId));
        
        console.log("✅ تم استلام بيانات المتجر:", storeData);

        if (!storeData.Products || storeData.Products.length === 0) {
          console.error("❌ لا توجد منتجات في بيانات المتجر!");
          setStoreInfo(storeData as ApiStore);
          setProducts([]);
          showToast("لا توجد منتجات متاحة في هذا المتجر حاليًا", "warning");
        } else {
          const convertedProducts = storeData.Products.map((product, index) => {
            console.log(`تحويل منتج ${index + 1}:`, product);
            return convertApiProductToProduct(product as ApiProduct, storeData as ApiStore);
          });
          
          setStoreInfo(storeData as ApiStore);
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
  }, [storeId, showToast]); // أضف showToast كـ dependency

  const handleNavigateLeft = () => {
    console.log("التنقل لليسار");
  };

  const handleNavigateRight = () => {
    console.log("التنقل لليمين");
  };



  // 👇 استبدال شاشة التحميل بـ LoadingSpinner
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

  // 👇 استبدال شاشة الخطأ مع إظهار Toast مسبقًا (تم فعله بالفعل)
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

  // 👇 استبدال شاشة "لا توجد منتجات" بإضافة Toast
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

// 👇 الآن نعيد تصدير ProductLayout مُحاطًا بـ ToastProvider
const ProductLayout: React.FC = () => {
  return (
    <ToastProvider> {/* ✅ تغليف كامل بـ ToastProvider */}
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