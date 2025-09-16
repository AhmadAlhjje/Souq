"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoresSection from "../../components/templates/StoresSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
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
  const { showToast } = useToast();
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  // دالة محسنة لتحليل الصور - نفس المنطق المستخدم في ProductLayout
  const parseImagesSafe = (images: string | string[] | null | undefined): string[] => {
    console.log('🖼️ [STORES] تحليل الصور - البيانات الأولية:', {
      data: images,
      type: typeof images,
      isArray: Array.isArray(images),
      length: images?.length,
      firstChars: typeof images === 'string' ? images.substring(0, 20) : null
    });
    
    // التحقق من القيم الفارغة
    if (!images || images === null || images === undefined) {
      console.log('🚫 [STORES] لا توجد صور (null/undefined)');
      return [];
    }

    // إذا كانت مصفوفة بالفعل
    if (Array.isArray(images)) {
      console.log('✅ [STORES] الصور عبارة عن مصفوفة:', images);
      return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    }

    // إذا كانت string
    if (typeof images === 'string') {
      const trimmedImages = images.trim();
      
      // فحص النص الفارغ أو القيم الخاصة
      if (trimmedImages === '' || 
          trimmedImages.toLowerCase() === 'null' || 
          trimmedImages.toLowerCase() === 'undefined') {
        console.log('🚫 [STORES] نص فارغ أو قيمة خاصة');
        return [];
      }

      // محاولة تحليل JSON
      if (trimmedImages.startsWith('[') || trimmedImages.startsWith('{')) {
        try {
          let parsed = JSON.parse(trimmedImages);
          console.log('🔄 [STORES] تم تحليل JSON بنجاح:', parsed);
          
        // ✅ إصلاح: فحص النوع أولاً
if (Array.isArray(parsed)) {
    return parsed.filter(img => img && typeof img === 'string' && img.trim() !== '');
} else if (typeof parsed === 'string') {
    // فقط هنا نستخدم startsWith لأننا متأكدين أنه string
    if (parsed.trim() !== '' && (parsed.startsWith('[') || parsed.startsWith('{'))) {
        // معالجة JSON مزدوج
    }
    return parsed.trim() ? [parsed.trim()] : [];
}
          
          if (Array.isArray(parsed)) {
            return parsed.filter(img => img && typeof img === 'string' && img.trim() !== '');
          } else if (typeof parsed === 'string' && parsed.trim() !== '') {
            return [parsed.trim()];
          }
          
          return [];
        } catch (jsonError: any) {
          console.error('❌ [STORES] خطأ في تحليل JSON:', {
            error: jsonError?.message || 'خطأ غير معروف',
            originalData: trimmedImages.substring(0, 100)
          });
          
          // محاولة إصلاح JSON المُشوه
          try {
            const cleanedJson = trimmedImages.replace(/^[^[\{]*/, '').replace(/[^\]\}]*$/, '');
            if (cleanedJson) {
              const reparsed = JSON.parse(cleanedJson);
              console.log('🔄 [STORES] تم إصلاح وتحليل JSON:', reparsed);
              if (Array.isArray(reparsed)) {
                return reparsed.filter(img => img && typeof img === 'string' && img.trim() !== '');
              }
            }
          } catch (secondAttempt: any) {
            console.log('⚠️ [STORES] فشل في المحاولة الثانية:', secondAttempt?.message);
          }
        }
      }

      // إذا كان النص يحتوي على فواصل (أسماء ملفات متعددة)
      if (trimmedImages.includes(',')) {
        console.log('📝 [STORES] النص يحتوي على فواصل، تقسيم القائمة');
        return trimmedImages.split(',')
          .map(img => img.trim())
          .filter(img => img !== '' && img !== 'null' && img !== 'undefined');
      }

      // معاملة النص كاسم ملف واحد
      console.log('📝 [STORES] معاملة النص كاسم ملف واحد:', trimmedImages);
      return [trimmedImages];
    }

    console.log('⚠️ [STORES] نوع غير متوقع للصور:', typeof images);
    return [];
  };

  // دالة لبناء رابط الصورة مع معالجة أفضل
  const buildImageUrl = (imageName: string, baseUrl: string): string => {
    if (!imageName || imageName.trim() === '') {
      console.log('⚠️ [STORES] اسم ملف فارغ، استخدام الصورة الافتراضية');
      return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    }

    // إذا كان رابط كامل بالفعل
    if (imageName.startsWith('http')) {
      console.log('🔗 [STORES] رابط كامل:', imageName);
      return imageName;
    }

    // تنظيف اسم الصورة
    const cleanImageName = imageName
      .replace(/^\/uploads\//, '')
      .replace(/^uploads\//, '')
      .replace(/^\/+/, '')
      .trim();

    if (!cleanImageName) {
      console.log('⚠️ [STORES] اسم منظف فارغ، استخدام الافتراضية');
      return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    }

    const fullUrl = `${baseUrl}/uploads/${cleanImageName}`;
    console.log('🔗 [STORES] رابط الصورة المبني:', fullUrl);
    return fullUrl;
  };

  const convertAPIStoreToLocal = (apiStore: APIStore): LocalStore => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";

    console.log('🏪 [STORES] تحويل متجر:', {
      id: apiStore.store_id,
      name: apiStore.store_name,
      images: apiStore.images,
      logo_image: apiStore.logo_image
    });

    // الحصول على رابط الصورة المناسب باستخدام المنطق المحسن
    const getImageUrl = (): string => {
      try {
        // أولاً: محاولة معالجة حقل images
        if (apiStore.images) {
          const imageList = parseImagesSafe(apiStore.images);
          if (imageList.length > 0) {
            const imageUrl = buildImageUrl(imageList[0], baseUrl);
            console.log('✅ [STORES] تم الحصول على صورة من images:', imageUrl);
            return imageUrl;
          }
        }

        // ثانياً: محاولة معالجة logo_image
        if (apiStore.logo_image) {
          const logoUrl = buildImageUrl(apiStore.logo_image, baseUrl);
          console.log('✅ [STORES] تم الحصول على صورة من logo_image:', logoUrl);
          return logoUrl;
        }

        // الصورة الافتراضية
        console.log('⚠️ [STORES] لا توجد صور صالحة، استخدام الافتراضية');
        return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";

      } catch (error: any) {
        console.error('❌ [STORES] خطأ في معالجة صورة المتجر:', error?.message);
        showToast(`تحذير: مشكلة في تحميل صورة متجر ${apiStore.store_name}`, 'warning');
        return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
      }
    };

    const convertedStore: LocalStore = {
      id: apiStore.store_id,
      name: apiStore.store_name,
      image: getImageUrl(),
      location: apiStore.store_address,
      rating: apiStore.averageRating,
      reviewsCount: apiStore.reviewsCount,
    };

    console.log('✅ [STORES] متجر مُحوّل:', {
      id: convertedStore.id,
      name: convertedStore.name,
      image: convertedStore.image
    });

    return convertedStore;
  };

  const handleViewDetails = (store: LocalStore) => {
    console.log(`زيارة متجر ${store.name}`);
    showToast(`جاري فتح متجر ${store.name}...`, 'info');
    router.push(`/products?store=${store.id}&storeName=${encodeURIComponent(store.name)}`);
  };

  const runDiagnostics = async () => {
    addDebugInfo("🔧 بدء التشخيص...");
    showToast('بدء فحص الاتصال...', 'info');
    
    // اختبار متغيرات البيئة
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    addDebugInfo(`📍 Base URL: ${baseUrl || 'غير محدد!'}`);
    
    if (!baseUrl) {
      addDebugInfo("❌ متغير NEXT_PUBLIC_BASE_URL غير محدد!");
      showToast('خطأ: متغير البيئة غير محدد!', 'error');
      return;
    }
    
    // اختبار الاتصال
    addDebugInfo("🧪 اختبار الاتصال...");
    const connectionOk = await testConnection();
    addDebugInfo(connectionOk ? "✅ الاتصال يعمل" : "❌ فشل الاتصال");
    
    if (connectionOk) {
      showToast('تم اختبار الاتصال بنجاح ✓', 'success');
    } else {
      showToast('فشل في الاتصال بالخادم', 'error');
    }
    
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
      showToast(`خطأ في الاتصال: ${err.message}`, 'error');
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
        showToast('لم يتم العثور على متاجر متاحة حالياً', 'info');
        return;
      }

      // تحويل البيانات مع معالجة أفضل للأخطاء
      const convertedStores: LocalStore[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < apiStores.length; i++) {
        try {
          const apiStore = apiStores[i];
          console.log(`🔄 [STORES] معالجة متجر ${i + 1}/${apiStores.length}:`, {
            id: apiStore.store_id,
            name: apiStore.store_name,
            images: apiStore.images,
            logo_image: apiStore.logo_image
          });

          const convertedStore = convertAPIStoreToLocal(apiStore);
          convertedStores.push(convertedStore);
          successCount++;
        } catch (storeError: any) {
          console.error(`❌ [STORES] خطأ في معالجة المتجر ${i + 1}:`, storeError?.message);
          errorCount++;
        }
      }

      addDebugInfo(`🔄 تم تحويل ${successCount} متجر بنجاح`);
      setStores(convertedStores);
      
      if (errorCount > 0) {
        showToast(`تم تحميل ${successCount} متجر بنجاح، فشل في تحميل ${errorCount} متجر`, 'warning');
      } else {
        showToast(`تم تحميل ${successCount} متجر بنجاح ✓`, 'success');
      }

      console.log(`✅ [STORES] تم تحويل ${successCount} متجر بنجاح`);

    } catch (error: any) {
      addDebugInfo(`💥 خطأ: ${error.message}`);
      
      let errorMessage = "حدث خطأ في تحميل المتاجر";
      
      if (error.response?.status === 404) {
        errorMessage = "لم يتم العثور على المتاجر";
      } else if (error.response?.status === 403) {
        errorMessage = "ليس لديك صلاحية لعرض المتاجر";
      } else if (error.response?.status >= 500) {
        errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً";
      } else if (!error.response) {
        errorMessage = "خطأ في الاتصال، تحقق من الإنترنت";
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      setError(errorMessage);
      setStores([]);
      showToast(`خطأ في تحميل المتاجر: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    showToast('جاري إعادة المحاولة...', 'info');
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // شاشة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20 flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تحميل متاجركم..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#96EDD9]/20 via-[#96EDD9]/10 to-white pt-20">
      {/* عرض رسالة خطأ محسنة مع إمكانية إعادة المحاولة */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500 text-xl">❌</div>
                <div className="mr-3">
                  <h4 className="text-red-800 font-medium">خطأ في تحميل البيانات</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      )}

      <StoresSection stores={stores} onViewDetails={handleViewDetails} />
    </div>
  );
};

export default StoresPage;