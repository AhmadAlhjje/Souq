// hooks/useLogout.ts
import { useState } from "react";
import { useStore } from "@/contexts/StoreContext";

export const useLogout = () => {
  const { setStoreId } = useStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // دالة لحذف الكوكيز
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
  };

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // إضافة تأخير قصير لعرض شاشة التحميل
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // حذف الكوكيز
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      
      // حذف البيانات من localStorage
      localStorage.removeItem('storeId');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      
      // تنظيف storeId من الـ context
      setStoreId(null);
      
      console.log('تم تسجيل الخروج بنجاح');
      
      // توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = '/';
      
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut
  };
};