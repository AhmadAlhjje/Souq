"use client";
import React from 'react';
import { User } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PasswordField from '../../components/molecules/PasswordField';
import PhoneField from '../../components/molecules/PhoneField';
import AuthActionButtons from '../../components/molecules/AuthActionButtons';
import { SignUpFormData } from '../../types/FormData';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  formData: SignUpFormData;
  handleInputChange: (field: keyof SignUpFormData, value: string) => void;
  onSubmit: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleInputChange, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 sm:space-y-4">
      <InputField
        label={t("loginForm.fullName.label")}
        type="text"
        placeholder={t("loginForm.fullName.placeholder")}
        value={formData.fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
        icon={User}
      />
      
      <InputField
        label={t("loginForm.email.label")}
        type="email"
        placeholder={t("loginForm.email.placeholder")}
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
      />
      
      <PhoneField
        label={t("loginForm.phone.label")}
        countryCode={formData.countryCode}
        setCountryCode={(value: string) => handleInputChange('countryCode', value)}
        phoneNumber={formData.phoneNumber}
        setPhoneNumber={(value: string) => handleInputChange('phoneNumber', value)}
      />
      
      <PasswordField
        label={t("loginForm.password.label")}
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
      />
      
      <AuthActionButtons
        onLogin={onSubmit}
        onCreateAccount={() => console.log('Create account')}
        loginText={t("loginForm.actions.login")}
        createAccountText={t("loginForm.actions.createAccount")}
      />
    </div>
  );
};

export default LoginForm;
