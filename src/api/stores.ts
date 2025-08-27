// src/api/stores.ts
import { api } from "./api";

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
