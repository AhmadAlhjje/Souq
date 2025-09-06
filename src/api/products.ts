import { api } from "./api";

export interface ProductData {
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number | string;
  store_id: number | string;
  images?: File[]; // مصفوفة صور يمكن إرسال صورة واحدة أو أكثر
}

// واجهة المنتج
export interface ProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  images?: File[] | null;
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

  if (productData.name) formData.append("name", productData.name);
  if (productData.description)
    formData.append("description", productData.description);
  if (productData.price !== undefined)
    formData.append("price", String(productData.price));
  if (productData.stock_quantity !== undefined)
    formData.append("stock_quantity", String(productData.stock_quantity));

  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  }
  console.log("id is",id);
  const response = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// حذف منتج معين
export const deleteProduct = async (id: number | string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// جلب منتج واحد حسب ID
export const getProductById = async (id: number | string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};