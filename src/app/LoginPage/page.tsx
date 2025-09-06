// pages/login/LoginPage.tsx
"use client";
import React, { useState } from "react";
import LoginTemplate from "../../components/templates/LoginTemplate";
import AuthTabs from "../../components/molecules/AuthTabs";
import LoginForm from "../../components/organisms/LoginForm";
import SignInForm from "../../components/organisms/SignInForm";
import { registerUser, loginUser } from "../../api/auth";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { getStoreIdFromToken, saveTokens } from "@/api/api";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useStore } from "@/contexts/StoreContext";

const LoginPage = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { setStoreId } = useStore();
  const [activeTab, setActiveTab] = useState("register");
  const [isLoading, setIsLoading] = useState(false);

  // بيانات إنشاء الحساب - مع إضافة حقل تأكيد كلمة المرور
  const [signUpData, setSignUpData] = useState({
    username: "",
    phoneNumber: "", // سيحتوي على رقم الهاتف الكامل مع رمز البلد
    password: "",
    confirmPassword: "", // حقل جديد لتأكيد كلمة المرور
  });

  // بيانات تسجيل الدخول
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  /** تغيير قيم حقول نموذج التسجيل */
  const handleSignUpChange = (field: string, value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** تغيير قيم حقول نموذج تسجيل الدخول */
  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /** إرسال بيانات إنشاء الحساب إلى الـ API */
  const handleSignUpSubmit = async () => {
    // التحقق من ملء جميع الحقول
    if (
      !signUpData.username ||
      !signUpData.phoneNumber ||
      !signUpData.password ||
      !signUpData.confirmPassword
    ) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "warning");
      return;
    }

    // التحقق من تطابق كلمتي المرور
    if (signUpData.password !== signUpData.confirmPassword) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }

    // التحقق من قوة كلمة المرور (اختياري)
    if (signUpData.password.length < 6) {
      showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        username: signUpData.username,
        password: signUpData.password,
        whatsapp_number: signUpData.phoneNumber,
      };

      const result = await registerUser(registerData);

      // ✅ التحقق من وجود الرسالة و التوكن بدلاً من success
      if (result.message && result.token) {
        // حفظ التوكن
        saveTokens(result.token, result.token); // يمكن استخدام نفس التوكن للاثنين مؤقتاً

        // عرض رسالة النجاح
        showToast(result.message, "success");

        setTimeout(() => {
          setActiveTab("login");
          showToast("يمكنك الآن تسجيل الدخول بحسابك الجديد", "info");
        }, 1500);

        // إعادة تعيين النموذج
        setSignUpData({
          username: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        showToast(result.message || "حدث خطأ أثناء إنشاء الحساب", "error");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // التحقق من نوع الخطأ
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("حدث خطأ غير متوقع", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** إرسال بيانات تسجيل الدخول إلى الـ API */
  const handleSignInSubmit = async () => {
    if (!signInData.username || !signInData.password) {
      showToast("يرجى إدخال اسم المستخدم وكلمة المرور", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        username: signInData.username,
        password: signInData.password,
      };

      const result = await loginUser(loginData);

      if (result.message && result.token) {
        // حفظ التوكن في الكوكيز أو localStorage
        saveTokens(result.token, result.token);

        // فك التوكن للحصول على store_id
        const storeIdFromToken = getStoreIdFromToken();
        setStoreId(storeIdFromToken); // تخزينه في الـ Context و localStorage

        showToast(result.message, "success");

        setTimeout(() => {
          if (storeIdFromToken) {
            router.push("/admin/dashboard/products"); // المستخدم لديه متجر مسبقاً
          } else {
            router.push("/admin/dashboard/creatingStore"); // المستخدم يحتاج لإنشاء متجر
          }
        }, 1500);

        // إعادة تعيين بيانات تسجيل الدخول
        setSignInData({ username: "", password: "" });
      } else {
        showToast(result.message || "فشل في تسجيل الدخول", "error");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("حدث خطأ غير متوقع", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginTemplate showSlider={activeTab === "login"}>
      {isLoading && (
        <LoadingSpinner
          size="lg"
          color="green"
          pulse
          dots
          overlay
          message="جارٍ المعالجة..."
        />
      )}

      <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "register" ? (
        <LoginForm
          formData={signUpData}
          handleInputChange={handleSignUpChange}
          onSubmit={handleSignUpSubmit}
          isLoading={isLoading}
        />
      ) : (
        <SignInForm
          formData={signInData}
          handleInputChange={handleSignInChange}
          onSubmit={handleSignInSubmit}
          isLoading={isLoading}
        />
      )}
    </LoginTemplate>
  );
};

export default LoginPage;