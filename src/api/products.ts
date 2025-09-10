import { api } from "./api";

export interface ProductData {
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number | string;
  store_id: number | string;
  images?: File[]; // مصفوفة صور يمكن إرسال صورة واحدة أو أكثر
}

// واجهة المنتج للتحديث
export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  images?: File[] | null;
}

// إضافة هذا الinterface
interface NewBulkProductData {
  store_id: number;
  products: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    imagesCount: number; // عدد الصور لكل منتج
  }[];
  images: File[]; // جميع الصور في مصفوفة واحدة
}

// إنشاء منتج جديد
export const createProduct = async (productData: ProductData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", String(productData.price));
  formData.append("stock_quantity", String(productData.stock_quantity));
  formData.append("store_id", String(productData.store_id));

  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
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
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
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

    // console.log("إرسال البيانات:", {
    //   store_id: productData.store_id,
    //   productsCount: productData.products.length,
    //   imagesCount: productData.images.length,
    //   products: productData.products.map((p) => ({
    //     name: p.name,
    //     imagesCount: p.imagesCount,
    //   })),
    // });
    console.log("formData",formData);
    // إرسال الطلب
    const response = await api.post("/products/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("response response", response);
    return response.data;
  } catch (error) {
    console.error("خطأ في إرسال البيانات:", error);
    throw error;
  }
};
