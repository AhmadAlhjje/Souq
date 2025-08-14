// utils/api/auth.ts
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface RegisterData {
  username: string;
  password: string;
  whatsapp_number: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

// دالة تسجيل المستخدم الجديد
export const registerUser = async (userData: RegisterData): Promise<ApiResponse> => {
  console.log("registerUser function called with:", userData);
  
  try {
    const apiUrl = `${API_BASE_URL}/users/register`;
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log("Response status:", response.status);

    let data;
    try {
      data = await response.json();
      console.log("Response data:", data);
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      return {
        success: false,
        message: 'خطأ في تنسيق الاستجابة من الخادم'
      };
    }

    if (!response.ok) {
      console.error("Request failed with status:", response.status);
      return {
        success: false,
        message: data.message || `خطأ من الخادم: ${response.status}`,
        data
      };
    }

    // لا نحفظ التوكن عند التسجيل - المستخدم يحتاج لتسجيل الدخول
    // if (data.token) {
    //   Cookies.set('auth_token', data.token, { 
    //     expires: 7,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'strict'
    //   });
    // }

    return {
      success: true,
      message: data.message || 'تم إنشاء الحساب بنجاح',
      data
    };
  } catch (error) {
    console.error('Register error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'خطأ في الاتصال بالخادم - تأكد من أن الخادم يعمل'
      };
    }
    
    return {
      success: false,
      message: 'خطأ في الاتصال بالخادم'
    };
  }
};

// دالة تسجيل الدخول
export const loginUser = async (loginData: LoginData): Promise<ApiResponse> => {
  console.log("loginUser function called with:", loginData);
  
  try {
    const apiUrl = `${API_BASE_URL}/users/login`;
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log("Response status:", response.status);

    let data;
    try {
      data = await response.json();
      console.log("Response data:", data);
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      return {
        success: false,
        message: 'خطأ في تنسيق الاستجابة من الخادم'
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'خطأ في تسجيل الدخول',
        data
      };
    }

    // حفظ التوكن في الكوكيز
    if (data.token) {
      Cookies.set('auth_token', data.token, { 
        expires: 7, // ينتهي بعد 7 أيام
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }

    return {
      success: true,
      message: data.message || 'تم تسجيل الدخول بنجاح',
      data,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'خطأ في الاتصال بالخادم'
    };
  }
};

// دالة تسجيل الخروج
export const logoutUser = (): void => {
  Cookies.remove('auth_token');
};

// دالة للحصول على التوكن
export const getAuthToken = (): string | undefined => {
  return Cookies.get('auth_token');
};

// دالة للتحقق من حالة تسجيل الدخول
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};