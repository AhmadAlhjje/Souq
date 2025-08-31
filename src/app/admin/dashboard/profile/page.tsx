"use client";
import React, { useState } from "react";
import {
  Settings,
  Share2,
  Bell,
  Users,
  Eye,
  EyeOff,
  Shield,
  Phone,
  Download,
  Camera,
  Check,
  X,
} from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { EditButton, ConfirmButton, CancelButton } from "@/components/common/ActionButtons";

// تعريف الأنواع
type EditingField = "name" | "storeName" | "password" | "phone" | "logo" | "coverImage";

interface EditingState {
  name: boolean;
  storeName: boolean;
  password: boolean;
  phone: boolean;
  logo: boolean;
  coverImage: boolean;
}

interface ProfileData {
  name: string;
  storeName: string;
  password: string;
  phone: string;
  logo: string | null;
  coverImage: string | null;
}

interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  step: 'verify' | 'new';
}

const ProfilePage = () => {
  const { isDark } = useThemeContext();

  const [isEditing, setIsEditing] = useState<EditingState>({
    name: false,
    storeName: false,
    password: false,
    phone: false,
    logo: false,
    coverImage: false,
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "متجر التاجر",
    storeName: "متجر التاجر",
    password: "••••••••",
    phone: "4567",
    logo: null,
    coverImage: null,
  });

  const [tempData, setTempData] = useState<Partial<ProfileData>>({});
  
  const [passwordState, setPasswordState] = useState<PasswordState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    step: 'verify',
  });

  const handleEdit = (field: EditingField) => {
    if (field === 'password') {
      setPasswordState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        step: 'verify',
      });
    } else {
      setTempData({ [field]: profileData[field] });
    }
    
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = (field: EditingField) => {
    if (field === 'password') {
      if (passwordState.step === 'verify') {
        // التحقق من كلمة المرور القديمة (محاكاة)
        if (passwordState.oldPassword === "123456") { // محاكاة التحقق
          setPasswordState(prev => ({ ...prev, step: 'new' }));
          return;
        } else {
          alert("كلمة المرور القديمة غير صحيحة");
          return;
        }
      } else {
        // حفظ كلمة المرور الجديدة
        if (passwordState.newPassword !== passwordState.confirmPassword) {
          alert("كلمة المرور الجديدة غير متطابقة");
          return;
        }
        if (passwordState.newPassword.length < 6) {
          alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
          return;
        }
        setProfileData(prev => ({ ...prev, password: "••••••••" }));
      }
    } else if (field === 'logo' || field === 'coverImage') {
      // معالجة رفع الصورة
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            setProfileData(prev => ({ ...prev, [field]: result }));
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    } else {
      if (tempData[field] !== undefined) {
        setProfileData(prev => ({ ...prev, [field]: tempData[field] as any }));
      }
    }
    
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setTempData({});
  };

  const handleCancel = (field: EditingField) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setTempData({});
    setPasswordState({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      step: 'verify',
    });
  };

  const verifyOldPassword = () => {
    // محاكاة التحقق من كلمة المرور
    if (passwordState.oldPassword === "123456") {
      setPasswordState(prev => ({ ...prev, step: 'new' }));
    } else {
      alert("كلمة المرور القديمة غير صحيحة");
    }
  };

  // تحديد الألوان حسب الوضع
  const themeClasses = {
    background: isDark ? "bg-gray-900" : "bg-teal-100",
    navBackground: isDark ? "bg-gray-900" : "bg-teal-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textPrimary: isDark ? "text-white" : "text-gray-800",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    iconBackground: isDark ? "bg-teal-600" : "bg-teal-600",
    buttonBackground: isDark
      ? "bg-gray-700 hover:bg-gray-600"
      : "bg-white hover:bg-gray-50",
    buttonIcon: isDark ? "text-gray-300" : "text-gray-600",
    shadow: isDark ? "shadow-gray-900/20" : "shadow-xl",
    inputBackground: isDark ? "bg-gray-700" : "bg-white",
    inputBorder: isDark ? "border-gray-600" : "border-gray-300",
    inputText: isDark ? "text-white" : "text-gray-900",
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`} dir="rtl">
      {/* Navigation Bar */}
      <div className={`${themeClasses.navBackground} p-4`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-right">
            <h1
              className={`text-2xl font-bold ${themeClasses.textPrimary} mb-1`}
            >
              إعدادات الملف الشخصي
            </h1>
            <p className={themeClasses.textSecondary}>
              إدارة معلومات حساب التاجر الخاص بك
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className={`${themeClasses.buttonBackground} p-3 rounded-xl transition-colors ${themeClasses.borderColor} border shadow-sm`}
            >
              <Share2 className={`w-5 h-5 ${themeClasses.buttonIcon}`} />
            </button>
            <button
              className={`${themeClasses.buttonBackground} p-3 rounded-xl transition-colors ${themeClasses.borderColor} border shadow-sm`}
            >
              <Bell className={`w-5 h-5 ${themeClasses.buttonIcon}`} />
            </button>
            <button className="bg-teal-400 hover:bg-teal-500 p-3 rounded-xl transition-colors border border-gray-200 shadow-sm">
              <Settings className="w-5 h-5 text-gray-50" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Hero Section with Background Image */}
        <div className="relative">
          <div
            className="h-64 w-full bg-cover bg-center rounded-t-2xl overflow-hidden"
            style={{
              backgroundImage: profileData.coverImage 
                ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${profileData.coverImage})`
                : `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            }}
          ></div>
          {/* Cover Image Edit Button */}
          <button
            onClick={() => handleSave('coverImage')}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm"
            title="تعديل الصورة الغطاء"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card - Above the image section */}
        <div className="-mt-4 flex justify-center">
          <div className="w-full max-w-2xl">
            <div
              className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6`}
            >
              <div className="flex justify-start items-center mb-4">
                <div className="flex items-center gap-4">
                  {/* Store Logo with Edit Button */}
                  <div className="relative">
                    {profileData.logo ? (
                      <img 
                        src={profileData.logo} 
                        alt="شعار المتجر" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-teal-600"
                      />
                    ) : (
                      <div className="bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
                        م ت
                      </div>
                    )}
                    <button
                      onClick={() => handleSave('logo')}
                      className="absolute -top-1 -right-1 bg-teal-600 hover:bg-teal-700 text-white p-1.5 rounded-full transition-colors shadow-lg"
                      title="تعديل شعار المتجر"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <h2
                      className={`text-xl font-bold ${themeClasses.textPrimary}`}
                    >
                      {profileData.storeName}
                    </h2>
                    <p className={themeClasses.textMuted}>حساب تاجر متقدم</p>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex justify-end gap-2 mb-4">
                <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm">
                  تاريخ الانضمام 2023
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  بودرونت نيوتون
                </span>
              </div>

              {/* Statistics */}
              <div
                className={`grid grid-cols-3 text-center w-full border-t ${themeClasses.borderColor} pt-4`}
                dir="rtl"
              >
                <div>
                  <div
                    className={`text-2xl font-bold ${themeClasses.textPrimary}`}
                  >
                    142
                  </div>
                  <div className={`text-sm ${themeClasses.textMuted}`}>
                    الطلبات
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${themeClasses.textPrimary}`}
                  >
                    4.9
                  </div>
                  <div className={`text-sm ${themeClasses.textMuted}`}>
                    التقييم
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold ${themeClasses.textPrimary}`}
                  >
                    98%
                  </div>
                  <div className={`text-sm ${themeClasses.textMuted}`}>
                    النشاط
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-6 flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {/* About Section */}
            <div
              className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-6`}
            >
              <h3
                className={`text-lg font-bold ${themeClasses.textPrimary} mb-4`}
              >
                عن متجرنا
              </h3>
              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                سنوات متتالية عالية الجودة وحدة استشارية لدى متخصصين في . نقدم
                أحدث الإنجازات والابتكارات عن علامة متقدمة لدينا بالإنجازات مع
                العملاء قد حققنا أيضاً البرنامج الممتاز ومتسعة مجانية في السوق.
              </p>
              <p
                className={`${themeClasses.textMuted} text-sm mt-4 flex items-center gap-2`}
              >
                <span>📅</span> 2014
              </p>
            </div>

            {/* Profile Information Cards */}
            <div className="space-y-4">
              {/* Store Name */}
              <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-end gap-3 flex-1">
                    <div
                      className={`${themeClasses.iconBackground} p-2 rounded-lg`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${themeClasses.textPrimary}`}>
                        اسم التاجر
                      </h3>
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        تحديث اسم التاجر
                      </p>
                      {isEditing.name ? (
                        <div className="mt-2 flex gap-2 items-center">
                          <input
                            type="text"
                            value={tempData.name || ""}
                            onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                            className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            placeholder="أدخل اسم التاجر"
                          />
                          <ConfirmButton
                            onClick={() => handleSave('name')}
                            size="sm"
                            tooltip="حفظ التغييرات"
                          />
                          <CancelButton
                            onClick={() => handleCancel('name')}
                            size="sm"
                            tooltip="إلغاء التعديل"
                          />
                        </div>
                      ) : (
                        <p
                          className={`text-sm font-medium ${themeClasses.textSecondary} mt-1`}
                        >
                          {profileData.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isEditing.name && (
                    <div className="mr-3">
                      <EditButton
                        onClick={() => handleEdit("name")}
                        size="md"
                        tooltip="تعديل اسم التاجر"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Store Name */}
              <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-end gap-3 flex-1">
                    <div
                      className={`${themeClasses.iconBackground} p-2 rounded-lg`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${themeClasses.textPrimary}`}>
                        اسم المتجر
                      </h3>
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        تحديث اسم المتجر
                      </p>
                      {isEditing.storeName ? (
                        <div className="mt-2 flex gap-2 items-center">
                          <input
                            type="text"
                            value={tempData.storeName || ""}
                            onChange={(e) => setTempData(prev => ({ ...prev, storeName: e.target.value }))}
                            className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            placeholder="أدخل اسم المتجر"
                          />
                          <ConfirmButton
                            onClick={() => handleSave('storeName')}
                            size="sm"
                            tooltip="حفظ التغييرات"
                          />
                          <CancelButton
                            onClick={() => handleCancel('storeName')}
                            size="sm"
                            tooltip="إلغاء التعديل"
                          />
                        </div>
                      ) : (
                        <p
                          className={`text-sm font-medium ${themeClasses.textSecondary} mt-1`}
                        >
                          {profileData.storeName}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isEditing.storeName && (
                    <div className="mr-3">
                      <EditButton
                        onClick={() => handleEdit("storeName")}
                        size="md"
                        tooltip="تعديل اسم المتجر"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-end gap-3 flex-1">
                    <div
                      className={`${themeClasses.iconBackground} p-2 rounded-lg`}
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${themeClasses.textPrimary}`}>
                        كلمة المرور
                      </h3>
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        تحديث كلمة المرور
                      </p>
                      {isEditing.password ? (
                        <div className="mt-2 space-y-3">
                          {passwordState.step === 'verify' ? (
                            <div className="flex gap-2 items-center">
                              <div className="relative flex-1">
                                <input
                                  type={passwordState.showOldPassword ? "text" : "password"}
                                  value={passwordState.oldPassword}
                                  onChange={(e) => setPasswordState(prev => ({ ...prev, oldPassword: e.target.value }))}
                                  className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500`}
                                  placeholder="أدخل كلمة المرور القديمة"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPasswordState(prev => ({ ...prev, showOldPassword: !prev.showOldPassword }))}
                                  className="absolute left-2 top-2.5"
                                >
                                  {passwordState.showOldPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              <button
                                onClick={verifyOldPassword}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                              >
                                تحقق
                              </button>
                              <CancelButton
                                onClick={() => handleCancel('password')}
                                size="sm"
                                tooltip="إلغاء التعديل"
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                  type={passwordState.showNewPassword ? "text" : "password"}
                                  value={passwordState.newPassword}
                                  onChange={(e) => setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                                  className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500`}
                                  placeholder="كلمة المرور الجديدة"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPasswordState(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
                                  className="absolute left-2 top-2.5"
                                >
                                  {passwordState.showNewPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              <div className="relative">
                                <input
                                  type={passwordState.showConfirmPassword ? "text" : "password"}
                                  value={passwordState.confirmPassword}
                                  onChange={(e) => setPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-500`}
                                  placeholder="تأكيد كلمة المرور الجديدة"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPasswordState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                                  className="absolute left-2 top-2.5"
                                >
                                  {passwordState.showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <ConfirmButton
                                  onClick={() => handleSave('password')}
                                  text="حفظ"
                                  size="sm"
                                  tooltip="حفظ كلمة المرور الجديدة"
                                />
                                <CancelButton
                                  onClick={() => handleCancel('password')}
                                  text="إلغاء"
                                  size="sm"
                                  tooltip="إلغاء التعديل"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p
                          className={`text-sm font-medium ${themeClasses.textSecondary} mt-1 flex items-center justify-end gap-2`}
                        >
                          <Eye className="w-4 h-4" />
                          ••••••••
                        </p>
                      )}
                    </div>
                  </div>

                  {!isEditing.password && (
                    <div className="mr-3">
                      <EditButton
                        onClick={() => handleEdit("password")}
                        size="md"
                        tooltip="تعديل كلمة المرور"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-end gap-3 flex-1">
                    <div
                      className={`${themeClasses.iconBackground} p-2 rounded-lg`}
                    >
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${themeClasses.textPrimary}`}>
                        رقم الهاتف
                      </h3>
                      <p className={`text-sm ${themeClasses.textMuted}`}>
                        تحديث رقم الهاتف
                      </p>
                      {isEditing.phone ? (
                        <div className="mt-2 flex gap-2 items-center">
                          <input
                            type="text"
                            value={tempData.phone || ""}
                            onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                            className={`${themeClasses.inputBackground} ${themeClasses.inputBorder} ${themeClasses.inputText} border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            placeholder="أدخل رقم الهاتف"
                          />
                          <ConfirmButton
                            onClick={() => handleSave('phone')}
                            size="sm"
                            tooltip="حفظ التغييرات"
                          />
                          <CancelButton
                            onClick={() => handleCancel('phone')}
                            size="sm"
                            tooltip="إلغاء التعديل"
                          />
                        </div>
                      ) : (
                        <p
                          className={`text-sm font-medium ${themeClasses.textSecondary} mt-1`}
                        >
                          {profileData.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {!isEditing.phone && (
                    <div className="mr-3">
                      <EditButton
                        onClick={() => handleEdit("phone")}
                        size="md"
                        tooltip="تعديل رقم الهاتف"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
              {/* Advanced Settings */}
              {/* <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center`}
              >
                <div className="bg-teal-600 p-4 rounded-2xl mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-bold ${themeClasses.textPrimary} mb-2`}>
                  الإعدادات المتقدمة
                </h3>
                <p
                  className={`text-sm ${themeClasses.textMuted} mb-4 text-center`}
                >
                  تحكم بالخيارات المتقدمة والإعدادات
                </p>
                <button className="bg-teal-100 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-200 transition-colors">
                  تحكم
                </button>
              </div> */}

              {/* Export Data */}
              {/* <div
                className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center`}
              >
                <div className="bg-teal-600 p-4 rounded-2xl mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-bold ${themeClasses.textPrimary} mb-2`}>
                  تصدير البيانات
                </h3>
                <p
                  className={`text-sm ${themeClasses.textMuted} mb-4 text-center`}
                >
                  قم بتنزيل ملف البيانات وتاريخ المعاملات الخاص بك
                </p>
                <button className="bg-teal-100 text-teal-600 px-6 py-2 rounded-lg hover:bg-teal-200 transition-colors">
                  تحميل
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;