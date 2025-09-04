import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

interface JWTPayload {
  user_id: number;
  username: string;
  role: string;
  store_id?: number; // ممكن يكون موجود أو لا
  iat: number;
  exp: number;
}

interface DecodedToken {
  user_id?: number;
  username?: string;
  role?: string;
  store_id?: number;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

// لارسال التوكن في كل طلب بشكل تلقائي
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("access_token");
    if (token) {
      // تأكد من وجود headers قبل إضافة Authorization
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// تابع استخراج التوكن
export const getStoreIdFromToken = (): number | null => {
  try {
    const token = Cookies.get("access_token");
    if (!token) return null;

    const decoded: DecodedToken = jwtDecode(token);
    return decoded.store_id ?? null;
  } catch (error) {
    console.error("خطأ في فك التوكن:", error);
    return null;
  }
};
// src/services/token-service.ts
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const saveTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 });
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};




export const logout = () => {
  // حذف الـ tokens من الكوكيز
  deleteCookie('access_token');
  deleteCookie('refresh_token');
  
  // يمكنك أيضاً حذف أي معلومات إضافية مخزنة
  deleteCookie('user_data');
  deleteCookie('user_role');
  
  // إعادة توجيه للصفحة الرئيسية أو صفحة تسجيل الدخول
  window.location.href = '/LoginPage';
};


export const useAuth = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      
      // حذف الـ tokens من الكوكيز
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      deleteCookie('user_data');
      deleteCookie('user_role');
      
      // يمكنك إضافة API call لتسجيل الخروج من الخادم
      // await fetch('/api/auth/logout', { method: 'POST' });
      
      // إعادة توجيه لصفحة تسجيل الدخول
      router.push('/LoginPage');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return {
    handleLogout,
    isLoggingOut
  };
}