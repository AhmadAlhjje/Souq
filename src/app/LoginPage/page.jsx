"use client";
import React, { useState } from "react";
import LoginTemplate from "../../components/templates/LoginTemplate";
import AuthTabs from "../../components/molecules/AuthTabs";
import LoginForm from "../../components/organisms/LoginForm";
import SignInForm from "../../components/organisms/SignInForm";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("register");

  // بيانات إنشاء الحساب
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+963",
    password: "",
  });

  // بيانات تسجيل الدخول
  const [signInData, setSignInData] = useState({
    identifier: "",
    password: "",
  });

  const handleSignUpChange = (field, value) => {
    setSignUpData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignInChange = (field, value) => {
    setSignInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignUpSubmit = () => {
    console.log("Sign Up submitted:", signUpData);
    // منطق إنشاء الحساب
  };

  const handleSignInSubmit = () => {
    console.log("Sign In submitted:", signInData);
    // منطق تسجيل الدخول
  };

  return (
    <LoginTemplate showSlider={activeTab === "login"}>
      {/* <Header /> */}
      <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "register" ? (
        // نموذج إنشاء الحساب
        <>
          <LoginForm
            formData={signUpData}
            handleInputChange={handleSignUpChange}
            onSubmit={handleSignUpSubmit}
          />
        </>
      ) : (
        // نموذج تسجيل الدخول
        <>
          <SignInForm
            formData={signInData}
            handleInputChange={handleSignInChange}
            onSubmit={handleSignInSubmit}
          />
        </>
      )}
    </LoginTemplate>
  );
};

export default LoginPage;
