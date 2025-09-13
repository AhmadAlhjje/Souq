import { api } from "./api";

export interface ProductData {
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number | string;
  store_id: number | string;
  images?: File[];
  discount_percentage?: string | number;
}

// واجهة المنتج للتحديث
export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  images?: File[] | null;
  discount_percentage?: number | null;
}

// إضافة هذا الinterface
interface NewBulkProductData {
  store_id: number;
  products: {
    name: string;
    description: string;
    price: number;
    discount_percentage?: number; // اختياري - نسبة الخصم
    stock_quantity: number;
    imagesCount: number; // عدد الصور لكل منتج
  }[];
  images: File[]; // جميع الصور في مصفوفة واحدة
}

// إنشاء منتج جديد
export const createProduct = async (productData: ProductData) => {
  try {
    console.log("=== Creating Product ===");
    console.log("Product data:", productData);

    const formData = new FormData();

    // الحقول الأساسية المطلوبة
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", String(productData.price));
    formData.append("stock_quantity", String(productData.stock_quantity));
    formData.append("store_id", String(productData.store_id));

    // إضافة حقل الخصم إذا كان موجوداً وليس فارغاً
    if (
      productData.discount_percentage !== undefined &&
      productData.discount_percentage !== null &&
      productData.discount_percentage !== "" &&
      Number(productData.discount_percentage) > 0
    ) {
      formData.append(
        "discount_percentage",
        String(productData.discount_percentage)
      );
      console.log(
        "Adding discount_percentage:",
        productData.discount_percentage
      );
    }

    // إضافة الصور إذا كانت موجودة
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((file, index) => {
        formData.append("images", file);
        console.log(`Adding image ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      });
    }

    // طباعة محتويات FormData للتحقق
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Product created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating product:", error);

    // تحسين معالجة الأخطاء
    if (error.response) {
      console.error("Response error details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("General error:", error.message);
    }

    throw error;
  }
};

// تعديل منتج معين
export const updateProduct = async (
  id: number | string,
  productData: ProductUpdateData
) => {
  const formData = new FormData();

  // إضافة البيانات النصية فقط إذا كانت موجودة
  if (productData.name !== undefined) {
    formData.append("name", productData.name);
  }

  if (productData.description !== undefined) {
    formData.append("description", productData.description);
  }

  if (productData.price !== undefined) {
    formData.append("price", String(productData.price));
  }

  if (productData.stock_quantity !== undefined) {
    formData.append("stock_quantity", String(productData.stock_quantity));
  }

  if (productData.discount_percentage !== undefined) {
    formData.append(
      "discount_percentage",
      String(productData.discount_percentage)
    );
  }

  // إضافة الصور الجديدة إذا كانت موجودة
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((file) => {
      formData.append("images", file); // استخدام نفس اسم الحقل كما في Postman
    });
  }

  console.log("Product ID:", id);

  // طباعة محتويات FormData للتحقق
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    console.log("تعديل", formData);
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// دالة بديلة للتحديث باستخدام PATCH إذا كانت API تدعمها
export const patchProduct = async (
  id: number | string,
  productData: ProductUpdateData
) => {
  const formData = new FormData();

  // إضافة البيانات فقط إذا كانت موجودة ومختلفة
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && key !== "images") {
      formData.append(key, String(value));
    }
  });

  // إضافة الصور
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  console.log("Patching product ID:", id);

  try {
    const response = await api.patch(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error patching product:", error);
    throw error;
  }
};

// حذف منتج معين
export const deleteProduct = async (id: number | string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// جلب منتج واحد حسب ID
export const getProductById = async (id: number | string) => {
  try {
    const response = await api.get(`/products/${id}`);

    // معالجة البيانات المستلمة
    const productData = response.data;

    // تحويل الصور من JSON string إلى array
    if (typeof productData.images === "string") {
      try {
        productData.images = JSON.parse(productData.images);
      } catch (e) {
        productData.images = [productData.images]; // في حال كانت string عادية
      }
    }

    // التأكد من وجود الصور أو استخدام صورة افتراضية
    if (!productData.images || productData.images.length === 0) {
      productData.images = ["/api/placeholder/400/400"];
    }

    console.log("بيانات المنتج المحدثة:", productData);

    return productData;
  } catch (error) {
    console.error("خطأ في جلب بيانات المنتج:", error);
    throw error;
  }
};

// جلب جميع المنتجات
export const getAllProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  try {
    const response = await api.get("/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// جلب المنتجات حسب الفلاتر
export const filterProducts = async (
  storeId: number | string,
  filters?: {
    stockStatus?: string;
    name?: string;
  }
) => {
  try {
    const params: any = {};

    if (filters?.stockStatus) params.stockStatus = filters.stockStatus;
    if (filters?.name) params.name = filters.name;

    const response = await api.get(`/products/store/${storeId}/filter`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering products:", error);
    throw error;
  }
};

// دالة API محدثة للتعامل مع التنسيق الجديد
export const uploadMultipleProducts = async (
  productData: NewBulkProductData
) => {
  try {
    // إنشاء FormData لإرسال البيانات والصور
    const formData = new FormData();

    // إضافة store_id
    formData.append("store_id", productData.store_id.toString());

    // إضافة بيانات المنتجات كـ JSON
    formData.append("products", JSON.stringify(productData.products));

    // إضافة جميع الصور
    productData.images.forEach((image: File, index: number) => {
      formData.append("images", image);
    });

    // طباعة تفاصيل البيانات المرسلة للمراجعة
    console.log("إرسال البيانات:", {
      store_id: productData.store_id,
      products: productData.products.map((product) => ({
        name: product.name,
        price: product.price,
        discount_percentage: product.discount_percentage || "لا يوجد خصم",
        stock_quantity: product.stock_quantity,
        imagesCount: product.imagesCount,
      })),
      totalImages: productData.images.length,
    });

    const response = await api.post("/products/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // إضافة timeout أطول للملفات الكبيرة
      timeout: 30000, // 30 ثانية
    });

    return response.data;
  } catch (error: any) {
    console.error("خطأ في إرسال البيانات:", error);

    // معالجة أفضل للأخطاء
    if (error.response) {
      // الخادم رد بخطأ
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "خطأ من الخادم";
      throw new Error(errorMessage);
    } else if (error.request) {
      // لم يصل الطلب للخادم
      throw new Error("فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت");
    } else {
      // خطأ في إعداد الطلب
      throw new Error(error.message || "حدث خطأ غير متوقع");
    }
  }
};
