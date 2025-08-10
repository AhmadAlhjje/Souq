"use client"
import React, { useState } from 'react';
import LoginTemplate from '../../components/templates/LoginTemplate';
import Header from '../../components/organisms/Header';
import AuthTabs from '../../components/molecules/AuthTabs';
import LoginForm from '../../components/organisms/LoginForm';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+963',
    password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // هنا يمكن إضافة منطق تسجيل الدخول
  };

  return (
    <LoginTemplate>
      {/* <Header /> */}
      <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <LoginForm
        formData={formData}
        handleInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      
      {/* <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
            كل ما تحتاجه لتنمو بمتجرك
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            إنك فخور بأن نستفيد من مئات الأدعادات اللوجستية والأدوات التسويقية المتكاملة في TMC
          </p>
        </div>
      </div> */}
    </LoginTemplate>
  );
};

export default LoginPage;