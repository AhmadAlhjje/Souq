"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import StoresSection from "../../components/templates/StoresSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/atoms/Button";
import { useToast } from "@/hooks/useToast";
import { useThemeContext } from '@/contexts/ThemeContext';
import { Store as APIStore, getStores, testConnection } from "../../api/stores";

// إضافة interfaces للاستجابة
interface APIStoreResponse {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string[] | string;
  logo_image: string;
  is_blocked: number;
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
  averageRating: number;
  reviewsCount: number;
  totalRevenue: number;
  totalOrders: number;
  thisMonthRevenue: number;
}

interface StoresAPIResponse {
  stores: APIStoreResponse[];
  statistics: {
    totalStores: number;
    activeStores: number;
    blockedStores: number;
    totalSiteRevenue: number;
  };
}

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
  const { theme, toggleTheme, isDark, isLight } = useThemeContext();
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const addDebugInfo = useCallback((info: string) => {
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${info}`,
    ]);
  }, []);

  const getBackgroundGradient = () => {
    if (isLight) {
      return 'linear-gradient(135deg, #96EDD9 0%, #96EDD9 20%, #96EDD9 50%, #96EDD9 80%, #FFFFFF 100%)';
    } else {
      return 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)';
    }
  };

  // دالة محسنة لتحليل الصور - نفس المنطق المستخدم في ProductLayout
  const parseImagesSafe = (
    images: string | string[] | null | undefined
  ): string[] => {
    console.log("🖼️ [STORES] تحليل الصور - البيانات الأولية:", {
      data: images,
      type: typeof images,
      isArray: Array.isArray(images),
      length: images?.length,
      firstChars: typeof images === "string" ? images.substring(0, 20) : null,
    });

    // التحقق من القيم الفارغة
    if (!images || images === null || images === undefined) {
      console.log("🚫 [STORES] لا توجد صور (null/undefined)");
      return [];
    }

    // إذا كانت مصفوفة بالفعل
    if (Array.isArray(images)) {
      console.log("✅ [STORES] الصور عبارة عن مصفوفة:", images);
      return images.filter(
        (img) => img && typeof img === "string" && img.trim() !== ""
      );
    }

    // إذا كانت string
    if (typeof images === "string") {
      const trimmedImages = images.trim();

      // فحص النص الفارغ أو القيم الخاصة
      if (
        trimmedImages === "" ||
        trimmedImages.toLowerCase() === "null" ||
        trimmedImages.toLowerCase() === "undefined"
      ) {
        console.log("🚫 [STORES] نص فارغ أو قيمة خاصة");
        return [];
      }

      // محاولة تحليل JSON
      if (trimmedImages.startsWith("[") || trimmedImages.startsWith("{")) {
        try {
          const parsed = JSON.parse(trimmedImages);
          console.log("🔄 [STORES] تم تحليل JSON بنجاح:", parsed);

          if (Array.isArray(parsed)) {
            return parsed.filter(
              (img) => img && typeof img === "string" && img.trim() !== ""
            );
          } else if (typeof parsed === "string") {
            if (
              parsed.trim() !== "" &&
              (parsed.startsWith("[") || parsed.startsWith("{"))
            ) {
              // معالجة JSON مزدوج
            }
            return parsed.trim() ? [parsed.trim()] : [];
          }

          if (Array.isArray(parsed)) {
            return parsed.filter(
              (img) => img && typeof img === "string" && img.trim() !== ""
            );
          } else if (typeof parsed === "string" && parsed.trim() !== "") {
            return [parsed.trim()];
          }

          return [];
        } catch (jsonError: any) {
          console.error("❌ [STORES] خطأ في تحليل JSON:", {
            error: jsonError?.message || "خطأ غير معروف",
            originalData: trimmedImages.substring(0, 100),
          });

          // محاولة إصلاح JSON المُشوه
          try {
            const cleanedJson = trimmedImages
              .replace(/^[^[\{]*/, "")
              .replace(/[^\]\}]*$/, "");
            if (cleanedJson) {
              const reparsed = JSON.parse(cleanedJson);
              console.log("🔄 [STORES] تم إصلاح وتحليل JSON:", reparsed);
              if (Array.isArray(reparsed)) {
                return reparsed.filter(
                  (img) => img && typeof img === "string" && img.trim() !== ""
                );
              }
            }
          } catch (secondAttempt: any) {
            console.log(
              "⚠️ [STORES] فشل في المحاولة الثانية:",
              secondAttempt?.message
            );
          }
        }
      }

      // إذا كان النص يحتوي على فواصل (أسماء ملفات متعددة)
      if (trimmedImages.includes(",")) {
        console.log("📝 [STORES] النص يحتوي على فواصل، تقسيم القائمة");
        return trimmedImages
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img !== "" && img !== "null" && img !== "undefined");
      }

      // معاملة النص كاسم ملف واحد
      console.log("📝 [STORES] معاملة النص كاسم ملف واحد:", trimmedImages);
      return [trimmedImages];
    }

    console.log("⚠️ [STORES] نوع غير متوقع للصور:", typeof images);
    return [];
  };

  // دالة لبناء رابط الصورة مع معالجة أفضل
  const buildImageUrl = (imageName: string, baseUrl: string): string => {
    if (!imageName || imageName.trim() === "") {
      console.log("⚠️ [STORES] اسم ملف فارغ، استخدام الصورة الافتراضية");
      return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    }

    // إذا كان رابط كامل بالفعل
    if (imageName.startsWith("http")) {
      console.log("🔗 [STORES] رابط كامل:", imageName);
      return imageName;
    }

    // تنظيف اسم الصورة
    const cleanImageName = imageName
      .replace(/^\/uploads\//, "")
      .replace(/^uploads\//, "")
      .replace(/^\/+/, "")
      .trim();

    if (!cleanImageName) {
      console.log("⚠️ [STORES] اسم منظف فارغ، استخدام الافتراضية");
      return "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";
    }

    const fullUrl = `${baseUrl}/uploads/${cleanImageName}`;
    console.log("🔗 [STORES] رابط الصورة المبني:", fullUrl);
    return fullUrl;
  };

  // دالة convertAPIStoreToLocal المحدثة مع الأنواع الصحيحة
  const convertAPIStoreToLocal = useCallback(
    (apiStore: APIStoreResponse): LocalStore => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      console.log("🔄 [CONVERT] بدء تحويل متجر:", {
        store_id: apiStore.store_id,
        store_name: apiStore.store_name,
        store_address: apiStore.store_address,
        images: apiStore.images,
        logo_image: apiStore.logo_image,
        averageRating: apiStore.averageRating,
        reviewsCount: apiStore.reviewsCount,
      });

      // التأكد من البيانات الأساسية أولاً
      if (!apiStore) {
        console.error("❌ [CONVERT] بيانات المتجر فارغة!");
        return {
          id: 0,
          name: "متجر غير معروف",
          image: "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر",
          location: "غير محدد",
        };
      }

      // فحص البيانات المطلوبة
      const storeId = apiStore.store_id;
      const storeName = apiStore.store_name;
      const storeAddress = apiStore.store_address;

      console.log("📋 [CONVERT] البيانات الأساسية:", {
        id: storeId,
        name: storeName,
        address: storeAddress,
      });

      if (!storeId || !storeName) {
        console.warn("⚠️ [CONVERT] بيانات مهمة مفقودة:", {
          hasId: !!storeId,
          hasName: !!storeName,
          hasAddress: !!storeAddress,
        });
      }

      // معالجة الصورة
      let imageUrl = "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";

      // أولوية للصور العادية
      if (
        apiStore.images &&
        Array.isArray(apiStore.images) &&
        apiStore.images.length > 0
      ) {
        const firstImage = apiStore.images[0];
        if (firstImage && firstImage.trim() !== "" && firstImage !== "null") {
          if (firstImage.startsWith("http")) {
            imageUrl = firstImage;
          } else if (firstImage.startsWith("/uploads")) {
            imageUrl = `${baseUrl}${firstImage}`;
          } else {
            imageUrl = `${baseUrl}/uploads/${firstImage}`;
          }
          console.log("🖼️ [CONVERT] استخدام الصورة العادية:", imageUrl);
        }
      }
      // إذا لم توجد صور عادية، استخدم الشعار
      else if (
        apiStore.logo_image &&
        apiStore.logo_image.trim() !== "" &&
        apiStore.logo_image !== "null"
      ) {
        const logoImage = apiStore.logo_image;
        if (logoImage.startsWith("http")) {
          imageUrl = logoImage;
        } else if (logoImage.startsWith("/uploads")) {
          imageUrl = `${baseUrl}${logoImage}`;
        } else {
          imageUrl = `${baseUrl}/uploads/${logoImage}`;
        }
        console.log("🏪 [CONVERT] استخدام شعار المتجر:", imageUrl);
      } else {
        console.log("📷 [CONVERT] استخدام الصورة الافتراضية");
      }

      // بناء الكائن المحول
      const convertedStore: LocalStore = {
        id: storeId || 0,
        name: storeName || "بدون اسم",
        image: imageUrl,
        location: storeAddress || "بدون عنوان",
        rating:
          apiStore.averageRating && apiStore.averageRating > 0
            ? apiStore.averageRating
            : undefined,
        reviewsCount:
          apiStore.reviewsCount && apiStore.reviewsCount > 0
            ? apiStore.reviewsCount
            : undefined,
      };

      console.log("✅ [CONVERT] تم التحويل بنجاح:", convertedStore);
      return convertedStore;
    },
    []
  );

  const handleViewDetails = (store: LocalStore) => {
    console.log(`زيارة متجر ${store.name}`);
    showToast(`جاري فتح متجر ${store.name}...`, "info");
    router.push(
      `/products?store=${store.id}&storeName=${encodeURIComponent(store.name)}`
    );
  };

  const runDiagnostics = async () => {
    addDebugInfo("🔧 بدء التشخيص...");
    showToast("بدء فحص الاتصال...", "info");

    // اختبار متغيرات البيئة
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    addDebugInfo(`📍 Base URL: ${baseUrl || "غير محدد!"}`);

    if (!baseUrl) {
      addDebugInfo("❌ متغير NEXT_PUBLIC_BASE_URL غير محدد!");
      showToast("خطأ: متغير البيئة غير محدد!", "error");
      return;
    }

    // اختبار الاتصال
    addDebugInfo("🧪 اختبار الاتصال...");
    const connectionOk = await testConnection();
    addDebugInfo(connectionOk ? "✅ الاتصال يعمل" : "❌ فشل الاتصال");

    if (connectionOk) {
      showToast("تم اختبار الاتصال بنجاح ✓", "success");
    } else {
      showToast("فشل في الاتصال بالخادم", "error");
    }

    // اختبار endpoint محدد
    try {
      addDebugInfo("📡 اختبار /stores endpoint...");
      const response = await fetch(`${baseUrl}/stores/`);
      addDebugInfo(`📊 حالة الرد: ${response.status}`);
      const data = await response.json();
      addDebugInfo(`📦 نوع البيانات: ${typeof data}`);
      addDebugInfo(
        `📊 طول البيانات: ${Array.isArray(data) ? data.length : "ليس مصفوفة"}`
      );
    } catch (err: any) {
      addDebugInfo(`❌ خطأ في endpoint: ${err.message}`);
      showToast(`خطأ في الاتصال: ${err.message}`, "error");
    }
  };

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      addDebugInfo("🚀 بدء جلب المتاجر...");

      // جلب البيانات
      const apiResponse = await getStores();

      // تشخيص مفصل
      console.log("=== تشخيص مفصل للاستجابة ===");
      console.log("1. نوع الاستجابة:", typeof apiResponse);
      console.log("2. هل هي مصفوفة؟", Array.isArray(apiResponse));
      console.log("3. مفاتيح الكائن:", Object.keys(apiResponse || {}));
      console.log("4. الاستجابة الكاملة:", apiResponse);

      // فحص خاصية stores
      if (apiResponse && "stores" in apiResponse) {
        console.log("5. ✅ يحتوي على خاصية stores");
        console.log("6. نوع stores:", typeof apiResponse.stores);
        console.log("7. عدد المتاجر:", apiResponse.stores?.length);
        console.log("8. أول متجر:", apiResponse.stores?.[0]);
      } else {
        console.log("5. ❌ لا يحتوي على خاصية stores");
      }

      // استخراج المتاجر
      let apiStores: APIStoreResponse[];

      if (
        apiResponse &&
        "stores" in apiResponse &&
        Array.isArray(apiResponse.stores)
      ) {
        apiStores = apiResponse.stores;
        console.log("✅ تم استخراج المتاجر من خاصية stores");
      } else if (Array.isArray(apiResponse)) {
        apiStores = apiResponse;
        console.log("✅ الاستجابة مصفوفة مباشرة");
      } else {
        console.error("❌ تنسيق استجابة غير متوقع");
        throw new Error("لا يمكن استخراج المتاجر من الاستجابة");
      }

      // ✅ ✅ ✅ التصفية الجديدة: عرض فقط المتاجر غير المحظورة
      apiStores = apiStores.filter(store => store.is_blocked === 0);
      console.log(`✅ تم تصفية المتاجر — عدد الظاهر: ${apiStores.length}`);

      console.log("=== بيانات المتاجر المستخرجة ===");
      console.log("عدد المتاجر:", apiStores.length);
      apiStores.forEach((store, index) => {
        console.log(`متجر ${index + 1}:`, {
          id: store.store_id,
          name: store.store_name,
          address: store.store_address,
          rating: store.averageRating,
          reviewsCount: store.reviewsCount,
        });
      });

      // تحويل البيانات
      console.log("=== بدء التحويل ===");
      const convertedStores: LocalStore[] = [];

      for (let i = 0; i < apiStores.length; i++) {
        const apiStore = apiStores[i];
        const converted = convertAPIStoreToLocal(apiStore);
        convertedStores.push(converted);
        console.log(`تم تحويل متجر ${i + 1}:`, converted);
      }

      console.log("=== النتيجة النهائية ===");
      console.log("عدد المتاجر المحولة:", convertedStores.length);
      console.log("المتاجر المحولة:", convertedStores);

      // تحديث الحالة
      setStores(convertedStores);
      setHasLoaded(true);

      // Toast ترحيبي مع إحصائيات
      showToast(`تم تحميل ${convertedStores.length} متجر بنجاح`, "success");

      // Toast إضافي للترحيب
      setTimeout(() => {
      }, 2000);
    } catch (error: any) {
      console.error("💥 خطأ في fetchStores:", error);
      setError(`خطأ في تحميل المتاجر: ${error.message}`);
      showToast(`خطأ: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, convertAPIStoreToLocal, addDebugInfo]);

  const handleRetry = () => {
    showToast("جاري إعادة المحاولة...", "info");
    fetchStores();
  };

  useEffect(() => {
    const startTime = Date.now();
    const timer = setTimeout(() => {
      const loadTime = Date.now() - startTime;
      fetchStores();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fetchStores]);

  // شاشة التحميل
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 transition-all duration-500"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تجميل المتاجر..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-500 relative"
      style={{
        background: getBackgroundGradient(),
        backgroundAttachment: 'fixed',
      }}
    >
      {/* شريط علوي مع زر تبديل الثيم */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="flex justify-between items-center px-4 py-3">
          {/* زر تبديل الثيم */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="rounded-full p-2"
            startIcon={isLight ? <Moon size={18} /> : <Sun size={18} />}
          >
            {isLight ? 'الوضع المظلم' : 'الوضع المضيء'}
          </Button>

          {/* عنوان الصفحة */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <h1 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              متاجرنا المميزة
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
          {/* عرض رسالة خطأ محسنة مع إمكانية إعادة المحاولة */}
          {error && (
            <div className="max-w-7xl mx-auto px-4 mb-4">
              <div className="bg-red-50/90 border border-red-200 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-red-500 text-xl">❌</div>
                    <div className="mr-3">
                      <h4 className="text-red-800 font-medium">
                        خطأ في تحميل البيانات
                      </h4>
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
};

export default StoresPage;