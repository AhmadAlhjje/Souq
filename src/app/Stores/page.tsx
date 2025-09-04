//st
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoresSection from "../../components/templates/StoresSection";
import { Store as APIStore, getStores } from "../../api/stores";

// تحويل Store من API إلى Store المحلي للحفاظ على التنسيق
interface LocalStore {
  id: number;
  name: string;
  image: string;
  location: string;
  rating?: number;
  reviewsCount?: number;
}

const StoresPage: React.FC = () => {
  const router = useRouter();
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const convertAPIStoreToLocal = (apiStore: APIStore): LocalStore => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.8:4000";

  let storeImages: string[] = [];
  try {
    storeImages = JSON.parse(apiStore.images);
    if (!Array.isArray(storeImages)) storeImages = [String(storeImages)];
  } catch (error) {
    console.error('خطأ في تحليل الصور:', error);
    storeImages = [];
  }

const imageUrl = storeImages.length > 0
  ? `${baseUrl}${storeImages[0]}`
  : "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
  return {
    id: apiStore.store_id,
    name: apiStore.store_name,
    image: imageUrl,
    location: apiStore.store_address,
    rating: 4.5,
    reviewsCount: 120,
  };
};
  const handleViewDetails = (store: LocalStore) => {
    console.log(`زيارة متجر ${store.name}`);
    router.push(`/products?store=${store.id}&storeName=${encodeURIComponent(store.name)}`);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🚀 بدء جلب المتاجر من API...");
        console.log("🔧 متغيرات البيئة:", {
          BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
          IMAGES_URL: process.env.NEXT_PUBLIC_IMAGES_URL,
        });

        // التحقق من وجود متغير البيئة
        if (!process.env.NEXT_PUBLIC_BASE_URL) {
          throw new Error("NEXT_PUBLIC_BASE_URL غير محدد في متغيرات البيئة");
        }

        // اختبار الاتصال بالخادم
        console.log("🧪 اختبار الاتصال مع الخادم...");
        const connectionTest = await fetch(process.env.NEXT_PUBLIC_BASE_URL)
          .then(() => true)
          .catch(() => false);

        if (!connectionTest) {
          console.warn("⚠️ لا يمكن الوصول للخادم مباشرة");
        }

        // جلب المتاجر من API
        const apiStores = await getStores();
        console.log("📦 البيانات من API:", apiStores);

        if (!apiStores || apiStores.length === 0) {
          console.warn("⚠️ لا توجد متاجر في البيانات المستلمة");
          setStores([]);
          return;
        }

        // تحويل البيانات
        const convertedStores = apiStores.map(convertAPIStoreToLocal);
        console.log("🔄 البيانات المحولة:", convertedStores);

        setStores(convertedStores);
      } catch (error: any) {
        console.error("💥 فشل في جلب المتاجر من API:", error);

        let errorMessage = "فشل في جلب البيانات من الخادم";

        if (error.code === "ERR_NETWORK") {
          errorMessage = `لا يمكن الاتصال بالخادم على ${process.env.NEXT_PUBLIC_BASE_URL}`;
        } else if (error.response?.status === 404) {
          errorMessage = "مسار API غير موجود - تحقق من المسار الصحيح";
        } else if (error.response?.status === 500) {
          errorMessage = "خطأ في الخادم - تحقق من logs الخادم";
        } else if (error.response?.status === 401) {
          errorMessage = "غير مخول للوصول - تحقق من التوكن";
        }

        setError(errorMessage);
        setStores([]); // لا نستخدم بيانات تجريبية، نعرض قائمة فارغة
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <span className="mr-3 text-gray-600">جاري تحميل المتاجر...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20">
      {/* عرض رسالة خطأ إذا كان هناك مشكلة */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-500 text-xl">❌</div>
              <div className="mr-3">
                <h4 className="text-red-800 font-medium">خطأ في تحميل البيانات</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <StoresSection stores={stores} onViewDetails={handleViewDetails} />
    </div>
  );
};

export default StoresPage;