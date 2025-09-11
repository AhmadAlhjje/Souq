// src/api/stores.ts
import { api } from "./api";
import { Product } from "./storeProduct";

export interface StoreData {
  name: string;
  location: string;
  description: string;
  coverImage?: File | null;
  logoImage?: File | null;
}

// تحديث نوع ApiStore للتوافق مع البنية الجديدة
interface ApiStoreResponse {
  success: boolean;
  store: {
    store_id: number;
    user_id: number;
    store_name: string;
    store_address: string;
    description: string;
    images: string;
    logo_image: string;
    is_blocked: boolean;
    created_at: string;
    User: {
      username: string;
      whatsapp_number: string;
      role: string;
    };
    reviews: any[];
    averageRating: number;
    reviewsCount: number;
    totalRevenue: number;
    totalOrders: number;
    thisMonthRevenue: number;
    discountStats: {
      totalProductsWithDiscount: number;
      totalProducts: number;
      totalDiscountValue: number;
      discountPercentage: number;
    };
    products: Array<{
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
    }>;
  };
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
  created_at: string;
  User: StoreUser;
}
export interface ApiProduct {
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
// في ملف types أو interfaces
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
  Products: Product[];
  statistics: {
    totalProducts: number;
    availableProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    averageRating: number;
    totalReviews: number;
    totalOrders: number;
    totalRevenue: string;
    ordersByStatus: {
      shipped: number;
      [key: string]: number;
    };
    averageOrderValue: string;
  };
}

// جلب جميع المتاجر
export const getStores = async (): Promise<Store[]> => {
  try {
    console.log("🔄 بدء طلب جلب جميع المتاجر...");
    console.log(
      "🌐 URL المستخدم:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/stores/`
    );

    const response = await api.get("/stores/");

    console.log("✅ تم جلب البيانات بنجاح");
    console.log("📦 البيانات المستلمة:", response.data);
    console.log("📊 عدد المتاجر:", response.data?.length || 0);

    // API يرجع مصفوفة من المتاجر
    const stores = Array.isArray(response.data)
      ? response.data
      : [response.data];

    return stores;
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


export const getStore = async (storeId: number): Promise<ApiStoreResponse> => {
  try {
    console.log(`🔄 جلب متجر برقم ${storeId}...`);

    const response = await api.get<ApiStoreResponse>(`/stores/${storeId}`);

    console.log("✅ تم جلب المتجر بنجاح:", response.data);

    // التحقق من وجود البيانات ونجاح العملية
    if (!response.data || !response.data.success) {
      throw new Error("لم يتم العثور على بيانات المتجر أو فشل في العملية");
    }

    // التحقق من وجود بيانات المتجر
    if (!response.data.store) {
      throw new Error("لم يتم العثور على بيانات المتجر");
    }

    // التحقق من وجود المنتجات
    if (!response.data.store.products) {
      console.warn("⚠️ المتجر لا يحتوي على منتجات");
      response.data.store.products = [];
    }

    // طباعة إحصائيات المنتجات للتحقق
    const totalProducts = response.data.store.products.length;
    const productsWithDiscount = response.data.store.products.filter(
      (product) => product.has_discount
    ).length;
    const outOfStockProducts = response.data.store.products.filter(
      (product) => product.stock_quantity === 0
    ).length;

    console.log("📊 إحصائيات المنتجات:", {
      totalProducts,
      productsWithDiscount,
      outOfStockProducts,
      discountStats: response.data.store.discountStats,
    });

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
