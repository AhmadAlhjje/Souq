import React from 'react';
import { NavigationBar } from '../molecules';
import { ProfileHeader, ProfileInfo, ProfileStats, AboutSection, ActionsGrid } from '../organisms';
import { ThemeClasses, ProfileData, PasswordState, EditingState, ProfileStats as StatsType } from '../../types';

interface ProfileTemplateProps {
  isDark: boolean;
  profileData: ProfileData;
  tempData: Partial<ProfileData>;
  isEditing: EditingState;
  passwordState: PasswordState;
  stats: StatsType;
  onEdit: (field: keyof EditingState) => void;
  onSave: (field: keyof EditingState) => void;
  onCancel: (field: keyof EditingState) => void;
  onTempDataChange: (data: Partial<ProfileData>) => void;
  onPasswordStateChange: (state: Partial<PasswordState>) => void;
  onVerifyOldPassword: () => void;
  onLogoUpload: (file: File) => void;
  onCoverUpload: (file: File) => void;
  onAdvancedSettings: () => void;
  onExportData: () => void;
}

const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  isDark,
  profileData,
  tempData,
  isEditing,
  passwordState,
  stats,
  onEdit,
  onSave,
  onCancel,
  onTempDataChange,
  onPasswordStateChange,
  onVerifyOldPassword,
  onLogoUpload,
  onCoverUpload,
  onAdvancedSettings,
  onExportData
}) => {
  // تحديد الألوان حسب الوضع
  const themeClasses: ThemeClasses = {
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
      <NavigationBar
        title="إعدادات الملف الشخصي"
        subtitle="إدارة معلومات حساب التاجر الخاص بك"
        themeClasses={themeClasses}
      />

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <ProfileHeader
          storeName={profileData.storeName}
          logo={profileData.logo}
          coverImage={profileData.coverImage}
          onLogoUpload={onLogoUpload}
          onCoverUpload={onCoverUpload}
          themeClasses={themeClasses}
        />

        {/* Profile Stats */}
        <ProfileStats
          stats={stats}
          themeClasses={themeClasses}
        />

        {/* Content Section */}
        <div className="pt-6 flex justify-center">
          <div className="w-full max-w-2xl space-y-4">
            {/* About Section */}
            <AboutSection
              title="عن متجرنا"
              description="سنوات متتالية عالية الجودة وحدة استشارية لدى متخصصين في . نقدم أحدث الإنجازات والابتكارات عن علامة متقدمة لدينا بالإنجازات مع العملاء قد حققنا أيضاً البرنامج الممتاز ومتسعة مجانية في السوق."
              establishedYear="2014"
              themeClasses={themeClasses}
            />

            {/* Profile Information Cards */}
            <ProfileInfo
              profileData={profileData}
              tempData={tempData}
              isEditing={isEditing}
              passwordState={passwordState}
              onEdit={onEdit}
              onSave={onSave}
              onCancel={onCancel}
              onTempDataChange={onTempDataChange}
              onPasswordStateChange={onPasswordStateChange}
              onVerifyOldPassword={onVerifyOldPassword}
              themeClasses={themeClasses}
            />

            {/* Action Cards Grid */}
            <ActionsGrid
              onAdvancedSettings={onAdvancedSettings}
              onExportData={onExportData}
              themeClasses={themeClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTemplate;