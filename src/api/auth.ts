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

export interface VerifyWhatsappData {
  user_id: number;
  verification_code: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResendVerificationData {
  user_id: number;
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

// التحقق من رقم الواتساب
export const verifyWhatsapp = async (verificationData: VerifyWhatsappData) => {
  const response = await api.post("/users/verify-whatsapp", verificationData);
  return response.data;
};

// إعادة إرسال رمز التحقق
export const resendVerification = async (
  resendData: ResendVerificationData
) => {
  const response = await api.post("/users/resend-verification", resendData);
  return response.data;
};

// إضافة هذه الدالة في نهاية الملف
export const changePassword = async (passwordData: ChangePasswordData) => {
  const response = await api.put("/users/change-password", passwordData);
  return response.data;
};
