import { api } from "./api";

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

// جلب جميع المتاجر
export const getStores = async (): Promise<Store[]> => {
  try {
    console.log('🔄 بدء طلب جلب جميع المتاجر...');
    console.log('🌐 URL المستخدم:', `${process.env.NEXT_PUBLIC_BASE_URL}/stores/`);
    
    const response = await api.get('/stores/');
    
    console.log('✅ تم جلب البيانات بنجاح');
    console.log('📦 البيانات المستلمة:', response.data);
    console.log('📊 عدد المتاجر:', response.data?.length || 0);
    
    // API يرجع مصفوفة من المتاجر
    const stores = Array.isArray(response.data) ? response.data : [response.data];
    
    return stores;
  } catch (error: any) {
    console.error('❌ خطأ في جلب المتاجر:', error);
    
    if (error.response) {
      console.error('📡 Status:', error.response.status);
      console.error('📡 Data:', error.response.data);
      console.error('📡 Headers:', error.response.headers);
    } else if (error.request) {
      console.error('📨 لم يتم استلام رد من الخادم:', error.request);
    } else {
      console.error('⚙️ خطأ في الإعدادات:', error.message);
    }
    
    throw error;
  }
};

// جلب متجر واحد بمنتجاته
export const getStore = async (storeId: number): Promise<Store> => {
  try {
    console.log(`🔄 جلب متجر برقم ${storeId}...`);
    
    const response = await api.get(`/stores/${storeId}`);
    
    console.log('✅ تم جلب المتجر بنجاح:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ خطأ في جلب المتجر:', error);
    throw error;
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
