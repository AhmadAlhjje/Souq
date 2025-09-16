// src/api/stores.ts
import { api } from "./api";
import { Product } from "./storeProduct";

// أنواع البيانات
export interface StoreData {
  name: string;
  location: string;
  description: string;
  coverImage?: File | null;
  logoImage?: File | null;
}

// إنشاء متجر جديد
export const createStore = async (storeData: StoreData) => {
  const formData = new FormData();

  formData.append("store_name", storeData.name);
  formData.append("store_address", storeData.location);
  formData.append("description", storeData.description);

  if (storeData.coverImage) {
    formData.append("images", storeData.coverImage);
  }

  if (storeData.logoImage) {
    formData.append("logo_image", storeData.logoImage);
  }

  const response = await api.post("/stores", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// جلب المتجر بالـ ID
export const getStoreById = async (id: number) => {
  const response = await api.get(`/stores/${id}`);
  return response.data;
};

// تحديث بيانات المتجر
export const updateStore = async (id: number, storeData: StoreData) => {
  const formData = new FormData();

  formData.append("store_name", storeData.name);
  formData.append("store_address", storeData.location);
  formData.append("description", storeData.description);

  if (storeData.coverImage) {
    formData.append("images", storeData.coverImage);
  }

  if (storeData.logoImage) {
    formData.append("logo_image", storeData.logoImage);
  }

  const response = await api.put(`/stores/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export interface StoreUser {
  username: string;
  whatsapp_number: string;
}

export interface Store {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string; // JSON string مثل: "[\"store1_1.jpg\",\"store1_2.jpg\"]"
  logo_image: string;
  is_blocked?: number;
  created_at: string;
  User: StoreUser;
  // الحقول الجديدة المضافة
  averageRating: number;
  reviewsCount: number;
  totalRevenue: number;
  totalOrders: number;
  thisMonthRevenue: number;
}
export interface ApiProduct {
  product_id: number;
  name: string;
  price: string;
  description: string;
  stock_quantity: number;
  created_at: string;
  images?: string;

  // ⭐ أضف الحقول الناقصة (كما ترجع من الـ API)
  has_discount?: boolean;
  discounted_price?: number;
  averageRating?: number;
  reviewsCount?: number;
  discount_percentage?: string | number;
  discount_amount?: number;
}

// نوع للمتجر من الـ API
export interface ApiStore {
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

// ✅ نوع محدث للمتجر في البحث - يدعم التقييم الجديد المبسط
export interface SearchStoreItem {
  store_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string;
  logo_image: string;
  created_at: string;
  // ✅ بيانات التقييم الجديدة المبسطة
  rating?: {
    average: string;
    total_reviews: number;
    has_reviews: boolean;
  };
  // ✅ حقول مباشرة للتقييم (محسوبة)
  averageRating?: number;
  reviewsCount?: number;
}

// جلب جميع المتاجر
export const getStores = async (): Promise<any> => {
  try {
    const response = await api.get("/stores/");

    console.log("🔍 [API] استجابة خام من الخادم:", response.data);

    // ✅ إرجاع البيانات الكاملة كما هي (تحتوي على stores و statistics)
    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في جلب المتاجر:", error);

    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Data:", error.response.data);
      console.error("📡 Headers:", error.response.headers);
    } else if (error.request) {
      console.error("📨 لم يتم استلام رد من الخادم:", error.request);
    } else {
      console.error("⚙️ خطأ في الإعدادات:", error.message);
    }

    throw error;
  }
};

// جلب متجر واحد بمنتجاته
export const getStore = async (storeId: number): Promise<ApiStore> => {
  try {
    console.log(`🔄 جلب متجر برقم ${storeId}...`);

    const response = await api.get<ApiStore>(`/stores/${storeId}`);

    console.log("✅ تم جلب المتجر بنجاح:", response.data);

    // التحقق من وجود البيانات
    if (!response.data) {
      throw new Error("لم يتم العثور على بيانات المتجر");
    }

    // التحقق من وجود المنتجات
    if (!response.data.Products) {
      console.warn("⚠️ المتجر لا يحتوي على منتجات");
      response.data.Products = [];
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في جلب المتجر:", error);
    throw error;
  }
};

// جلب منتج واحد بتفاصيله
export const getProduct = async (productId: number): Promise<any> => {
  try {
    console.log(`🔄 جلب منتج برقم ${productId}...`);

    const response = await api.get(`/products/${productId}`);

    console.log("✅ تم جلب المنتج بنجاح:", response.data);

    // التحقق من وجود البيانات
    if (!response.data) {
      throw new Error("لم يتم العثور على المنتج");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في جلب المنتج:", error);
    throw error;
  }
};

// مساعد لتحليل الصور من JSON بدون صورة افتراضية
export const parseImages = (imagesString: string): string[] => {
  try {
    const parsed = JSON.parse(imagesString);
    return Array.isArray(parsed) ? parsed : [imagesString];
  } catch (error) {
    console.error("خطأ في تحليل الصور:", error);
    return []; // مصفوفة فارغة إذا فشل التحليل
  }
};
// src/api/stores.ts - إضافة دالة البحث في المنتجات

// إضافة هذه الأنواع الجديدة في أعلى الملف
export interface ProductSearchResponse {
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
  statistics: {
    totalProducts: number;
    availableProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    products: {
      averageRating: number;
      totalReviews: number;
    };
    store: {
      averageRating: number;
      totalReviews: number;
    };
    overallRating: {
      averageRating: number;
      totalReviews: number;
    };
    totalOrders: number;
    totalRevenue: string;
    ordersByStatus: {
      shipped: number;
    };
    averageOrderValue: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    name: string;
    stockStatus: string | null;
    appliedFilters: {
      nameSearch: boolean;
      stockFilter: boolean;
    };
  };
}
// إضافة هذه الدالة في نهاية الملف
export const searchProductsInStore = async (
  storeId: number,
  productName: string
): Promise<ProductSearchResponse> => {
  try {
    console.log(
      `🔍 البحث عن المنتجات في المتجر ${storeId} بالاسم: ${productName}`
    );

    const response = await api.get<ProductSearchResponse>(
      `/products/store/${storeId}/filter?name=${encodeURIComponent(
        productName
      )}`
    );

    console.log("✅ تم البحث في المنتجات بنجاح");
    console.log("📦 نتائج البحث الخام:", response.data);
    console.log("📊 عدد المنتجات الموجودة:", response.data.Products.length);
    console.log("📈 إحصائيات البحث:", response.data.statistics);

    if (response.data.Products.length > 0) {
      console.log("🛍️ أول منتج في النتائج:", response.data.Products[0]);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ خطأ في البحث عن المنتجات:", error);

    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Data:", error.response.data);

      if (error.response.status === 404) {
        throw new Error(
          `لم يتم العثور على المتجر رقم ${storeId} أو لا يحتوي على منتجات`
        );
      }
      if (error.response.status === 500) {
        throw new Error("خطأ في الخادم أثناء البحث عن المنتجات");
      }
    } else if (error.request) {
      console.error("📨 لم يتم استلام رد من الخادم:", error.request);
      throw new Error("لا يمكن الاتصال بالخادم للبحث عن المنتجات");
    } else {
      console.error("⚙️ خطأ في الإعدادات:", error.message);
    }

    throw error;
  }
};
// تحديث دالة createReview لدعم التعليقات بدون رقم هاتف
export const createReview = async ({
  store_id,
  product_id,
  rating,
  session_id,
  reviewer_name,
  // reviewer_phone, // ✅ تم حذف هذا المعلمة من التوقيع (اختياري)
  comment = "",
}: {
  store_id?: number;
  product_id?: number;
  rating?: number;
  session_id?: string;
  reviewer_name?: string;
  // reviewer_phone?: string; // ✅ تم حذف هذا السطر
  comment?: string;
}) => {
  if (!store_id && !product_id) {
    throw new Error("يجب تحديد store_id أو product_id");
  }

  // للمتاجر
  if (store_id) {
    const reviewData: any = {
      session_id: session_id || generateSessionId(),
      store_id,
      review_type: "store",
    };

    if (rating && rating > 0) {
      reviewData.rating = rating;
    }

    console.log("📤 إرسال بيانات تقييم المتجر:", reviewData);

    try {
      const response = await api.post("/reviews", reviewData);
      console.log("✅ رد الخادم للمتجر:", response);
      return response.data;
    } catch (error: any) {
      console.error("❌ خطأ تقييم المتجر:", error);
      if (error.response) {
        console.error(
          "📡 رد الخادم:",
          error.response.status,
          error.response.data
        );
      }
      throw error;
    }
  }

  // للمنتجات
  if (product_id) {
    const reviewData: any = {
      session_id: session_id || generateSessionId(),
      product_id,
      review_type: "product",
    };

    if (rating && rating > 0) {
      reviewData.rating = rating;
    }

    // ✅ التعديل: أضف كل حقل على حدة إذا كان موجودًا
    if (reviewer_name) {
      reviewData.reviewer_name = reviewer_name.trim();
    }

    if (comment) {
      reviewData.comment = comment.trim();
    }

    console.log("📤 إرسال بيانات المنتج:", reviewData);

    try {
      const response = await api.post("/reviews", reviewData);
      console.log("✅ رد الخادم للمنتج:", response);
      console.log("📋 نوع البيانات:", typeof response.data);
      console.log("📋 محتوى البيانات:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ خطأ مفصل في تقييم المنتج:");
      console.error("📝 الرسالة:", error.message);

      if (error.response) {
        console.error("📡 الحالة:", error.response.status);
        console.error("📡 النص:", error.response.statusText);
        console.error("📡 البيانات:", error.response.data);
        console.error("📡 الهيدرز:", error.response.headers);
      } else if (error.request) {
        console.error("📨 لم يصل رد من الخادم:", error.request);
      }

      throw error;
    }
  }
};
// ✅ دالة مساعدة لتوليد session_id فريد للزائر
export const generateSessionId = (): string => {
  if (typeof window === "undefined") {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // التحقق من وجود session_id مسبقاً في localStorage
  const existingSessionId = localStorage.getItem("visitor_session_id");

  if (existingSessionId) {
    return existingSessionId;
  }

  // إنشاء session_id جديد
  const newSessionId = `guest_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("visitor_session_id", newSessionId);

  return newSessionId;
};

// دالة اختبار الاتصال
export const testConnection = async (): Promise<boolean> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || " http://109.199.102.40:4004";
    console.log("🧪 اختبار الاتصال مع:", baseUrl);

    const response = await fetch(baseUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    console.log("✅ نجح الاتصال، الحالة:", response.status);
    return true;
  } catch (error) {
    console.error("❌ فشل الاتصال:", error);
    return false;
  }
};

// ✅ نوع محدث للرد على البحث - مع بنية مبسطة
export interface SearchStoreResponse {
  message: string;
  count: number;
  stores: SearchStoreItem[];
  // ✅ للتوافق مع الكود القديم
  success?: boolean;
  searchStats?: {
    totalStores: number;
    storesWithRatings: number;
    averageStoreRating: number;
    totalReviewsInResults: number;
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalStores: number;
    storesPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    searchQuery: string;
    appliedFilters: {
      nameSearch: boolean;
    };
  };
}

// ✅ البحث في المتاجر بالاسم - محدث للبنية الجديدة المبسطة
export const searchStores = async (
  name: string
): Promise<SearchStoreResponse> => {
  try {
    console.log(`🔍 البحث عن المتاجر بالاسم: ${name}`);

    const response = await api.get<SearchStoreResponse>(
      `/stores/search?name=${encodeURIComponent(name)}`
    );

    console.log("✅ تم البحث بنجاح");
    console.log("📦 نتائج البحث الخام:", response.data);

    // ✅ معالجة البيانات الجديدة مع التقييم المبسط
    const processedData: SearchStoreResponse = {
      ...response.data,
      stores: response.data.stores.map((store) => {
        // استخراج التقييم من rating الجديدة
        const averageRating = store.rating?.has_reviews
          ? parseFloat(store.rating.average)
          : 0;
        const reviewsCount = store.rating?.total_reviews || 0;

        return {
          ...store,
          // ✅ إضافة الحقول المحسوبة للتوافق
          averageRating: averageRating > 0 ? averageRating : undefined,
          reviewsCount: reviewsCount > 0 ? reviewsCount : undefined,
        };
      }),
      // ✅ حساب الإحصائيات من البيانات الجديدة للتوافق
      searchStats: {
        totalStores: response.data.count,
        storesWithRatings: response.data.stores.filter(
          (store) => store.rating?.has_reviews === true
        ).length,
        averageStoreRating:
          response.data.stores.length > 0
            ? response.data.stores
                .filter((store) => store.rating?.has_reviews === true)
                .reduce(
                  (sum, store) =>
                    sum + parseFloat(store.rating?.average || "0"),
                  0
                ) /
              Math.max(
                1,
                response.data.stores.filter(
                  (store) => store.rating?.has_reviews === true
                ).length
              )
            : 0,
        totalReviewsInResults: response.data.stores.reduce(
          (sum, store) => sum + (store.rating?.total_reviews || 0),
          0
        ),
      },
    };

    console.log("📊 عدد المتاجر الموجودة:", processedData.count);
    console.log("🌟 إحصائيات التقييم:", processedData.searchStats);

    if (processedData.stores.length > 0) {
      console.log("🏪 أول متجر مع التقييم:", {
        name: processedData.stores[0].store_name,
        rating: processedData.stores[0].averageRating,
        reviews: processedData.stores[0].reviewsCount,
        originalRating: processedData.stores[0].rating,
      });
    }

    return processedData;
  } catch (error: any) {
    console.error("❌ خطأ في البحث عن المتاجر:", error);

    if (error.response) {
      console.error("📡 Status:", error.response.status);
      console.error("📡 Data:", error.response.data);
    } else if (error.request) {
      console.error("📨 لم يتم استلام رد من الخادم:", error.request);
    } else {
      console.error("⚙️ خطأ في الإعدادات:", error.message);
    }

    throw error;
  }
};
