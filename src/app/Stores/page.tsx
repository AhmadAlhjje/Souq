"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoresSection from "../../components/templates/StoresSection";
import { Store as APIStore, getStores, testConnection } from "../../api/stores";

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
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const convertAPIStoreToLocal = (apiStore: APIStore): LocalStore => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.1.127:4000";

    // تحليل الصور من JSON string
    const parseImages = (imagesString: string): string[] => {
      try {
        const parsed = JSON.parse(imagesString);
        return Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch (error) {
        console.error('خطأ في تحليل الصور:', error);
        return [];
      }
    };

    // الحصول على رابط الصورة المناسب
    const getImageUrl = (): string => {
      const storeImages = parseImages(apiStore.images);
      if (storeImages.length > 0 && storeImages[0]) {
        const imagePath = storeImages[0];
        if (imagePath.startsWith('/uploads')) {
          return `${baseUrl}${imagePath}`;
        }
        if (imagePath.startsWith('http')) {
          return imagePath;
        }
        return `${baseUrl}/${imagePath}`;
      }

      if (apiStore.logo_image) {
        if (apiStore.logo_image.startsWith('/uploads')) {
          return `${baseUrl}${apiStore.logo_image}`;
        }
        if (apiStore.logo_image.startsWith('http')) {
          return apiStore.logo_image;
        }
        return `${baseUrl}/${apiStore.logo_image}`;
      }

      return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    };

    return {
      id: apiStore.store_id,
      name: apiStore.store_name,
      image: getImageUrl(),
      location: apiStore.store_address,
      rating: apiStore.averageRating ,
      reviewsCount: apiStore.reviewsCount ,
    };
  };

  const handleViewDetails = (store: LocalStore) => {
    console.log(`زيارة متجر ${store.name}`);
    router.push(`/products?store=${store.id}&storeName=${encodeURIComponent(store.name)}`);
  };

  const runDiagnostics = async () => {
    addDebugInfo("🔧 بدء التشخيص...");
    
    // اختبار متغيرات البيئة
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    addDebugInfo(`📍 Base URL: ${baseUrl || 'غير محدد!'}`);
    
    if (!baseUrl) {
      addDebugInfo("❌ متغير NEXT_PUBLIC_BASE_URL غير محدد!");
      return;
    }
    
    // اختبار الاتصال
    addDebugInfo("🧪 اختبار الاتصال...");
    const connectionOk = await testConnection();
    addDebugInfo(connectionOk ? "✅ الاتصال يعمل" : "❌ فشل الاتصال");
    
    // اختبار endpoint محدد
    try {
      addDebugInfo("📡 اختبار /stores endpoint...");
      const response = await fetch(`${baseUrl}/stores/`);
      addDebugInfo(`📊 حالة الرد: ${response.status}`);
      const data = await response.json();
      addDebugInfo(`📦 نوع البيانات: ${typeof data}`);
      addDebugInfo(`📊 طول البيانات: ${Array.isArray(data) ? data.length : 'ليس مصفوفة'}`);
    } catch (err: any) {
      addDebugInfo(`❌ خطأ في endpoint: ${err.message}`);
    }
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      addDebugInfo("🚀 بدء جلب المتاجر...");

      // التحقق من متغير البيئة
      if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_URL غير محدد في متغيرات البيئة");
      }

      addDebugInfo(`🔧 استخدام URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);

      // جلب المتاجر من API
      const apiStores = await getStores();
      addDebugInfo(`📦 تم استلام ${apiStores.length} متجر`);

      if (!apiStores || apiStores.length === 0) {
        addDebugInfo("⚠️ لا توجد متاجر في البيانات");
        setStores([]);
        return;
      }

      // تحويل البيانات
      const convertedStores = apiStores.map(convertAPIStoreToLocal);
      addDebugInfo(`🔄 تم تحويل ${convertedStores.length} متجر`);

      setStores(convertedStores);
    } catch (error: any) {
      addDebugInfo(`💥 خطأ: ${error.message}`);
      setError(error.message);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4">
        
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <span className="mr-3 text-gray-600">جاري تحميل المتاجر...</span>
          </div>
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