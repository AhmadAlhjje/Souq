"use client";
import React, { useState } from "react";
import LoginTemplate from "../../components/templates/LoginTemplate";
import AuthTabs from "../../components/molecules/AuthTabs";
import LoginForm from "../../components/organisms/LoginForm";
import SignInForm from "../../components/organisms/SignInForm";
import { registerUser, loginUser } from "../../api/auth";
import { useToast } from "../../contexts/ToastContext";
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { showToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("register");
  const [isLoading, setIsLoading] = useState(false);

  // بيانات إنشاء الحساب
  const [signUpData, setSignUpData] = useState({
    username: "",
    phoneNumber: "",
    countryCode: "+963",
    password: "",
  });

  // بيانات تسجيل الدخول
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const handleSignUpChange = (field: string, value: string) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignInChange = (field: string, value: string) => {
    setSignInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignUpSubmit = async () => {
    console.log("handleSignUpSubmit called with data:", signUpData);
    
    if (!signUpData.username || !signUpData.phoneNumber || !signUpData.password) {
      showToast("يرجى ملء جميع الحقول المطلوبة", "warning");
      return;
    }

    setIsLoading(true);
    
    try {
      const registerData = {
        username: signUpData.username,
        password: signUpData.password,
        whatsapp_number: `${signUpData.countryCode}${signUpData.phoneNumber}`,
      };

      console.log("Sending data to API:", registerData);
      console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/users/register`);

      const result = await registerUser(registerData);
      
      console.log("API Response:", result);
      
      if (result.success) {
        showToast(result.message, "success");
        
        // تبديل إلى تاب تسجيل الدخول بعد التسجيل الناجح
        setTimeout(() => {
          setActiveTab("login");
          showToast("يمكنك الآن تسجيل الدخول بحسابك الجديد", "info");
        }, 1500);
        
        // إعادة تعيين البيانات
        setSignUpData({
          username: "",
          phoneNumber: "",
          countryCode: "+963",
          password: "",
        });
      } else {
        console.error("Registration failed:", result);
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("حدث خطأ غير متوقع", "error");
    } finally {
      setIsLoading(false);
    }
  };

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

      console.log("Sending login data to API:", loginData);
      
      const result = await loginUser(loginData);
      
      console.log("Login API Response:", result);
      
      if (result.success) {
        showToast(result.message, "success");
        
        // توجيه المستخدم إلى صفحة الأدمن بعد تسجيل الدخول الناجح
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
        
        // إعادة تعيين البيانات
        setSignInData({
          username: "",
          password: "",
        });
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("حدث خطأ غير متوقع", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginTemplate showSlider={activeTab === "login"}>
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