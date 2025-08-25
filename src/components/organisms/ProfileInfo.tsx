import React from 'react';
import { Users, Phone } from 'lucide-react';
import { ProfileField, PasswordField } from '../molecules';

interface EditingState {
  name: boolean;
  storeName: boolean;
  password: boolean;
  phone: boolean;
}

interface ProfileData {
  name: string;
  storeName: string;
  password: string;
  phone: string;
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

interface ProfileInfoProps {
  profileData: ProfileData;
  tempData: Partial<ProfileData>;
  isEditing: EditingState;
  passwordState: PasswordState;
  onEdit: (field: keyof EditingState) => void;
  onSave: (field: keyof EditingState) => void;
  onCancel: (field: keyof EditingState) => void;
  onTempDataChange: (data: Partial<ProfileData>) => void;
  onPasswordStateChange: (state: Partial<PasswordState>) => void;
  onVerifyOldPassword: () => void;
  themeClasses: {
    cardBackground: string;
    iconBackground: string;
    textPrimary: string;
    textMuted: string;
    textSecondary: string;
  };
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profileData,
  tempData,
  isEditing,
  passwordState,
  onEdit,
  onSave,
  onCancel,
  onTempDataChange,
  onPasswordStateChange,
  onVerifyOldPassword,
  themeClasses
}) => {
  return (
    <div className="space-y-4">
      {/* Trader Name */}
      <ProfileField
        label="اسم التاجر"
        description="تحديث اسم التاجر"
        value={profileData.name}
        icon={Users}
        isEditing={isEditing.name}
        tempValue={tempData.name || ''}
        onEdit={() => onEdit('name')}
        onSave={() => onSave('name')}
        onCancel={() => onCancel('name')}
        onChange={(value) => onTempDataChange({ name: value })}
        placeholder="أدخل اسم التاجر"
        themeClasses={themeClasses}
      />

      {/* Store Name */}
      <ProfileField
        label="اسم المتجر"
        description="تحديث اسم المتجر"
        value={profileData.storeName}
        icon={Users}
        isEditing={isEditing.storeName}
        tempValue={tempData.storeName || ''}
        onEdit={() => onEdit('storeName')}
        onSave={() => onSave('storeName')}
        onCancel={() => onCancel('storeName')}
        onChange={(value) => onTempDataChange({ storeName: value })}
        placeholder="أدخل اسم المتجر"
        themeClasses={themeClasses}
      />

      {/* Password Field */}
      <PasswordField
        isEditing={isEditing.password}
        passwordState={passwordState}
        onEdit={() => onEdit('password')}   
        onSave={() => onSave('password')}
        onCancel={() => onCancel('password')}
        onPasswordStateChange={onPasswordStateChange}
        onVerifyOldPassword={onVerifyOldPassword}
        themeClasses={themeClasses}
      />

      {/* Phone Number */}
      <ProfileField
        label="رقم الهاتف"
        description="تحديث رقم الهاتف"
        value={profileData.phone}
        icon={Phone}
        isEditing={isEditing.phone}
        tempValue={tempData.phone || ''}
        onEdit={() => onEdit('phone')}
        onSave={() => onSave('phone')}
        onCancel={() => onCancel('phone')}
        onChange={(value) => onTempDataChange({ phone: value })}
        placeholder="أدخل رقم الهاتف"
        themeClasses={themeClasses}
      />
    </div>
  );
};

export default ProfileInfo;