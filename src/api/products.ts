import { api } from "./api";

export interface ProductData {
  name: string;
  description: string;
  price: number | string;
  stock_quantity: number | string;
  store_id: number | string;
  images?: File[]; // مصفوفة صور يمكن إرسال صورة واحدة أو أكثر
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
