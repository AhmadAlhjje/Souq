import { api } from "./api";

// جلب إحصائيات وطلبات المتجر
export const getStoreOrdersStats = async (storeId: number) => {
  const response = await api.get(`/orders/store/${storeId}/stats`);
  return response.data;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId: number, status: string) => {
  console.log(`📡 Updating order status | orderId=${orderId}, status=${status}`);
  const response = await api.put(`/orders/ship/${orderId}`, { status });
  console.log("✅ Update order response:", response.data);
  return response.data;
};