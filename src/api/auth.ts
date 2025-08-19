  // src/api/auth.ts
  import { api } from "./api";
  import { saveTokens, clearTokens, getAccessToken } from "./api";

  export interface RegisterData {
    username: string;
    password: string;
    whatsapp_number: string;
  }

  export interface LoginData {
    username: string;
    password: string;
  }

  
  // تسجيل مستخدم جديد
  export const registerUser = async (userData: RegisterData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  };

  // تسجيل دخول المستخدم وتخزين التوكن في الكوكيز
  export const loginUser = async (loginData: LoginData) => {
    const response = await api.post("/users/login", loginData);
    saveTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  };

  // تسجيل الخروج (حذف التوكن من الكوكيز)
  export const logoutUser = () => {
    clearTokens();
  };

  // التحقق إذا كان المستخدم مسجّل دخول
  export const isAuthenticated = () => {
    return !!getAccessToken();
  };


  
