import { api } from "./api";
import { AxiosResponse } from "axios";

export interface ProductPayload {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  store_id: string | number;
  images: File[];
}

export const createProduct = async (
  payload: ProductPayload
): Promise<AxiosResponse> => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("stock_quantity", payload.stock_quantity);
  formData.append("store_id", String(7));

  // رفع الصور
  payload.images.forEach((file) => {
    formData.append("images", file);
  });
  console.log(formData, "formData");
  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
