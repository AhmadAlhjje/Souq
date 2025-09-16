// src/api/stores.ts
import { api } from "./api";

// أنواع البيانات
export interface StoreData {
  name: string;
  location: string;
  description: string;
  coverImage?: File | null;
  logoImage?: File | null;
}

export interface StoreUser {
  username: string;
  whatsapp_number: string;
  role?: string;
}

// النوع الرئيسي للمتجر - محدث ليطابق البيانات الفعلية من API
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
// نوع المنتج من API - محدث مع جميع الحقول
export interface ApiProduct {
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

export interface ApiStore {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string;
  logo_image: string;
  is_blocked?: number;
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
    role?: string;
  };
  averageRating: number;
  reviewsCount: number;
  totalRevenue: number;
  totalOrders: number;
  thisMonthRevenue: number;
  // إحصائيات الخصومات
  discountStats?: {
    totalProductsWithDiscount: number;
    totalProducts: number;
    totalDiscountValue: number;
    discountPercentage: number;
  };
  // دعم كلا الحالتين
  Products: ApiProduct[];
  products?: ApiProduct[]; // للتوافق مع API response
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

// === الدوال ===

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

// جلب جميع المتاجر - محدثة
export const getStores = async (): Promise<Store[]> => {
  try {
    console.log('🔄 بدء طلب جلب جميع المتاجر...');
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('🌐 Base URL المستخدم:', baseUrl);
    
    // اختبار الاتصال أولاً
    console.log('🧪 اختبار الاتصال مع الخادم...');
    try {
      const healthCheck = await fetch(`${baseUrl}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // timeout بعد 5 ثواني
      });
      console.log('✅ الخادم متاح، حالة الصحة:', healthCheck.status);
    } catch (healthError) {
      console.warn('⚠️ فشل اختبار الصحة، محاولة الاتصال المباشر...');
    }
    
    // محاولة الطلب الرئيسي
    console.log('📡 إرسال طلب للمتاجر...');
    
    const response = await api.get('/stores/');
    
    console.log('✅ تم جلب البيانات بنجاح');
    console.log('📦 نوع البيانات المستلمة:', typeof response.data);
    console.log('📊 البيانات الخام:', response.data);
    
    // التحقق من نوع البيانات
    let stores: Store[];
    
    if (Array.isArray(response.data)) {
      stores = response.data;
      console.log('📋 البيانات عبارة عن مصفوفة مباشرة');
    } else if (response.data?.stores && Array.isArray(response.data.stores)) {
      stores = response.data.stores;
      console.log('📋 البيانات داخل خاصية stores');
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      stores = response.data.data;
      console.log('📋 البيانات داخل خاصية data');
    } else {
      console.error('❌ شكل البيانات غير متوقع:', response.data);
      throw new Error('شكل البيانات المستلمة غير صحيح');
    }
    
    console.log('📊 عدد المتاجر المستلمة:', stores.length);
    
    if (stores.length > 0) {
      console.log('🏪 أول متجر:', stores[0]);
    }
    
    return stores;
    
  } catch (error: any) {
    console.error('❌ خطأ في جلب المتاجر:', error);
    
    // تشخيص مفصل للخطأ
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('⏱️ انتهت مهلة الاتصال - الخادم بطيء أو غير متاح');
      throw new Error('انتهت مهلة الاتصال. تحقق من اتصال الإنترنت أو حالة الخادم.');
    }
    
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('🌐 خطأ في الشبكة');
      console.error('🔍 تحقق من:');
      console.error('   - هل جهازك متصل بنفس الشبكة؟');
      console.error('   - هل يوجد Firewall يمنع الاتصال؟');
      throw new Error(`لا يمكن الاتصال بالخادم  تحقق من اتصال الشبكة.`);
    }
    
    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      
      console.error('📡 رد الخادم:');
      console.error('   Status:', status);
      console.error('   StatusText:', statusText);
      console.error('   Data:', error.response.data);
      console.error('   Headers:', error.response.headers);
      
      switch (status) {
        case 404:
          throw new Error('مسار /stores غير موجود على الخادم. تحقق من API endpoints.');
        case 500:
          throw new Error('خطأ داخلي في الخادم. تحقق من logs الخادم.');
        case 403:
          throw new Error('ممنوع الوصول. تحقق من صلاحيات API.');
        case 401:
          throw new Error('غير مخول. تحقق من التوكن أو الهوية.');
        default:
          throw new Error(`خطأ من الخادم: ${status} - ${statusText}`);
      }
    }
    
    // خطأ غير متوقع
    console.error('❓ خطأ غير متوقع:', error.message);
    throw new Error(`خطأ غير متوقع: ${error.message}`);
  }
};

// ✅ البحث في المتاجر بالاسم - محدث للبنية الجديدة المبسطة
export const searchStores = async (name: string): Promise<SearchStoreResponse> => {
  try {
    console.log(`🔍 البحث عن المتاجر بالاسم: ${name}`);
    
    const response = await api.get<SearchStoreResponse>(`/stores/search?name=${encodeURIComponent(name)}`);
    
    console.log('✅ تم البحث بنجاح');
    console.log('📦 نتائج البحث الخام:', response.data);
    
    // ✅ معالجة البيانات الجديدة مع التقييم المبسط
    const processedData: SearchStoreResponse = {
      ...response.data,
      stores: response.data.stores.map(store => {
        // استخراج التقييم من rating الجديدة
        const averageRating = store.rating?.has_reviews 
          ? parseFloat(store.rating.average) 
          : 0;
        const reviewsCount = store.rating?.total_reviews || 0;
        
        return {
          ...store,
          // ✅ إضافة الحقول المحسوبة للتوافق
          averageRating: averageRating > 0 ? averageRating : undefined,
          reviewsCount: reviewsCount > 0 ? reviewsCount : undefined
        };
      }),
      // ✅ حساب الإحصائيات من البيانات الجديدة للتوافق
      searchStats: {
        totalStores: response.data.count,
        storesWithRatings: response.data.stores.filter(store => 
          store.rating?.has_reviews === true
        ).length,
        averageStoreRating: response.data.stores.length > 0 
          ? response.data.stores
              .filter(store => store.rating?.has_reviews === true)
              .reduce((sum, store) => sum + parseFloat(store.rating?.average || '0'), 0) / 
            Math.max(1, response.data.stores.filter(store => store.rating?.has_reviews === true).length)
          : 0,
        totalReviewsInResults: response.data.stores.reduce((sum, store) => 
          sum + (store.rating?.total_reviews || 0), 0
        )
      }
    };
    
    console.log('📊 عدد المتاجر الموجودة:', processedData.count);
    console.log('🌟 إحصائيات التقييم:', processedData.searchStats);
    
    if (processedData.stores.length > 0) {
      console.log('🏪 أول متجر مع التقييم:', {
        name: processedData.stores[0].store_name,
        rating: processedData.stores[0].averageRating,
        reviews: processedData.stores[0].reviewsCount,
        originalRating: processedData.stores[0].rating
      });
    }
    
    return processedData;
  } catch (error: any) {
    console.error('❌ خطأ في البحث عن المتاجر:', error);
    
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📡 Data:', error.response.data);
    } else if (error.request) {
      console.error('📨 لم يتم استلام رد من الخادم:', error.request);
    } else {
      console.error('⚙️ خطأ في الإعدادات:', error.message);
    }
    
    throw error;
  }
};

// *** الإصلاح الرئيسي: جلب متجر واحد بمنتجاته ***
export const getStore = async (storeId: number): Promise<ApiStore> => {
  try {
    console.log(`🔄 جلب متجر برقم ${storeId}...`);
    
    const response = await api.get(`/stores/${storeId}`);
    
    console.log('✅ رد API الخام:', response.data);
    
    // التحقق من وجود البيانات
    if (!response.data) {
      throw new Error('لم يتم العثور على بيانات المتجر');
    }

    // معالجة البيانات للتأكد من التوافق
    let storeData = response.data;
    
    // إذا كانت البيانات محاطة بـ success و store
    if (storeData.success && storeData.store) {
      storeData = storeData.store;
      console.log('📦 استخراج البيانات من store:', storeData);
    }
    
    // **الإصلاح الرئيسي: معالجة products vs Products**
    if (storeData.products && !storeData.Products) {
      storeData.Products = storeData.products;
      console.log('🔄 تم تحويل products إلى Products');
      console.log('📊 عدد المنتجات بعد التحويل:', storeData.Products.length);
    }
    
    // التحقق من وجود المنتجات
    if (!storeData.Products || !Array.isArray(storeData.Products)) {
      console.warn('⚠️ المتجر لا يحتوي على منتجات أو المنتجات ليست مصفوفة');
      storeData.Products = [];
    } else {
      console.log(`📦 تم العثور على ${storeData.Products.length} منتج`);
      if (storeData.Products.length > 0) {
        console.log('🛍️ أول منتج:', storeData.Products[0]);
      }
    }
    
    // التأكد من وجود جميع الحقول المطلوبة مع قيم افتراضية
    const finalStoreData = {
      ...storeData,
      averageRating: storeData.averageRating || 0,
      reviewsCount: storeData.reviewsCount || 0,
      totalRevenue: storeData.totalRevenue || 0,
      totalOrders: storeData.totalOrders || 0,
      thisMonthRevenue: storeData.thisMonthRevenue || 0,
      Products: storeData.Products || []
    };
    
    console.log('🎯 البيانات النهائية للمتجر:', finalStoreData);
    
    return finalStoreData as ApiStore;
  } catch (error: any) {
    console.error('❌ خطأ في جلب المتجر:', error);
    
    // معالجة الأخطاء بتفصيل أكثر
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📡 Data:', error.response.data);
      
      if (error.response.status === 404) {
        throw new Error(`المتجر رقم ${storeId} غير موجود`);
      }
      if (error.response.status === 500) {
        throw new Error('خطأ في الخادم أثناء جلب بيانات المتجر');
      }
    }
    
    throw error;
  }
};

// src/api/stores.ts
export const getProduct = async (productId: number) => {
  try {
    const response = await api.get(`/products/${productId}`);
    if (!response.data) throw new Error('لم يتم العثور على المنتج');
    // ✅ أعد المنتج نفسه بدل الكائل الخارجي
    return response.data.product;
  } catch (error: any) {
    console.error('❌ خطأ في جلب المنتج:', error);
    throw error;
  }
};

// دالة اختبار الاتصال
export const testConnection = async (): Promise<boolean> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||" http://109.199.102.40:4004";
    console.log('🧪 اختبار الاتصال مع:', baseUrl);
    
    const response = await fetch(baseUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    console.log('✅ نجح الاتصال، الحالة:', response.status);
    return true;
  } catch (error) {
    console.error('❌ فشل الاتصال:', error);
    return false;
  }
};

// مساعد لتحليل الصور من JSON بدون صورة افتراضية
export const parseImages = (imagesString: string): string[] => {
  try {
    const parsed = JSON.parse(imagesString);
    return Array.isArray(parsed) ? parsed : [imagesString];
  } catch (error) {
    console.error('خطأ في تحليل الصور:', error);
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
export const searchProductsInStore = async (storeId: number, productName: string): Promise<ProductSearchResponse> => {
  try {
    console.log(`🔍 البحث عن المنتجات في المتجر ${storeId} بالاسم: ${productName}`);
    
    const response = await api.get<ProductSearchResponse>(`/products/store/${storeId}/filter?name=${encodeURIComponent(productName)}`);
    
    console.log('✅ تم البحث في المنتجات بنجاح');
    console.log('📦 نتائج البحث الخام:', response.data);
    console.log('📊 عدد المنتجات الموجودة:', response.data.Products.length);
    console.log('📈 إحصائيات البحث:', response.data.statistics);
    
    if (response.data.Products.length > 0) {
      console.log('🛍️ أول منتج في النتائج:', response.data.Products[0]);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ خطأ في البحث عن المنتجات:', error);
    
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📡 Data:', error.response.data);
      
      if (error.response.status === 404) {
        throw new Error(`لم يتم العثور على المتجر رقم ${storeId} أو لا يحتوي على منتجات`);
      }
      if (error.response.status === 500) {
        throw new Error('خطأ في الخادم أثناء البحث عن المنتجات');
      }
    } else if (error.request) {
      console.error('📨 لم يتم استلام رد من الخادم:', error.request);
      throw new Error('لا يمكن الاتصال بالخادم للبحث عن المنتجات');
    } else {
      console.error('⚙️ خطأ في الإعدادات:', error.message);
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
      review_type: "store"
    };

    if (rating && rating > 0) {
      reviewData.rating = rating;
    }

    console.log('📤 إرسال بيانات تقييم المتجر:', reviewData);
    
    try {
      const response = await api.post("/reviews", reviewData);
      console.log('✅ رد الخادم للمتجر:', response);
      return response.data;
    } catch (error: any) {
      console.error('❌ خطأ تقييم المتجر:', error);
      if (error.response) {
        console.error('📡 رد الخادم:', error.response.status, error.response.data);
      }
      throw error;
    }
  }

 // للمنتجات
if (product_id) {
  const reviewData: any = {
    session_id: session_id || generateSessionId(),
    product_id,
    review_type: "product"
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

  console.log('📤 إرسال بيانات المنتج:', reviewData);
  
  try {
    const response = await api.post("/reviews", reviewData);
    console.log('✅ رد الخادم للمنتج:', response);
    console.log('📋 نوع البيانات:', typeof response.data);
    console.log('📋 محتوى البيانات:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ خطأ مفصل في تقييم المنتج:');
    console.error('📝 الرسالة:', error.message);
    
    if (error.response) {
      console.error('📡 الحالة:', error.response.status);
      console.error('📡 النص:', error.response.statusText);
      console.error('📡 البيانات:', error.response.data);
      console.error('📡 الهيدرز:', error.response.headers);
    } else if (error.request) {
      console.error('📨 لم يصل رد من الخادم:', error.request);
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
  const existingSessionId = localStorage.getItem('visitor_session_id');
  
  if (existingSessionId) {
    return existingSessionId;
  }

  // إنشاء session_id جديد
  const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('visitor_session_id', newSessionId);
  
  return newSessionId;
};