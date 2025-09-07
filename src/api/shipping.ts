// src/services/shipping-service.ts
import { api } from "./api";

// تعريف أنواع البيانات
export interface ShippingCreateData {
  order_id: number;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  recipient_name: string;
  shipping_address: string;
  source_address: string;
  destination: string;
  shipping_method: string;
}

export interface ShippingResponse {
  shipping_id: number;
  order_id: number;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  recipient_name: string;
  shipping_address: string;
  source_address: string;
  destination: string;
  shipping_method: string;
  shipping_status: string;
}

// خدمات API للشحن
export const shippingService = {
  // إنشاء معلومات شحن جديدة
  createShipping: async (data: ShippingCreateData): Promise<ShippingResponse> => {
    try {
      const response = await api.post<ShippingResponse>('/shipping/', data);
      return response.data;
    } catch (error: any) {
      console.error('خطأ في إنشاء معلومات الشحن:', error);
      
      // معالجة أخطاء مخصصة
      if (error.response?.status === 400) {
        throw new Error('بيانات الشحن غير صالحة');
      } else if (error.response?.status === 401) {
        throw new Error('غير مصرح لك بهذه العملية');
      } else if (error.response?.status === 404) {
        throw new Error('الطلبية غير موجودة');
      } else if (error.response?.status >= 500) {
        throw new Error('خطأ في الخادم، يرجى المحاولة لاحقاً');
      }
      
      throw new Error('حدث خطأ غير متوقع');
    }
  },

  // الحصول على معلومات شحن حسب ID
  getShippingById: async (shippingId: number): Promise<ShippingResponse> => {
    try {
      const response = await api.get<ShippingResponse>(`/shipping/${shippingId}`);
      return response.data;
    } catch (error: any) {
      console.error('خطأ في جلب معلومات الشحن:', error);
      throw new Error('لا يمكن جلب معلومات الشحن');
    }
  },

  // الحصول على جميع معلومات الشحن لطلبية محددة
  getShippingByOrderId: async (orderId: number): Promise<ShippingResponse[]> => {
    try {
      const response = await api.get<ShippingResponse[]>(`/shipping/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('خطأ في جلب معلومات شحن الطلبية:', error);
      throw new Error('لا يمكن جلب معلومات شحن الطلبية');
    }
  },

  // تحديث معلومات الشحن
  updateShipping: async (shippingId: number, data: Partial<ShippingCreateData>): Promise<ShippingResponse> => {
    try {
      const response = await api.put<ShippingResponse>(`/shipping/${shippingId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('خطأ في تحديث معلومات الشحن:', error);
      throw new Error('لا يمكن تحديث معلومات الشحن');
    }
  },

  // حذف معلومات الشحن
  deleteShipping: async (shippingId: number): Promise<void> => {
    try {
      await api.delete(`/shipping/${shippingId}`);
    } catch (error: any) {
      console.error('خطأ في حذف معلومات الشحن:', error);
      throw new Error('لا يمكن حذف معلومات الشحن');
    }
  }
};