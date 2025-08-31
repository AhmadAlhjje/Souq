import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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
