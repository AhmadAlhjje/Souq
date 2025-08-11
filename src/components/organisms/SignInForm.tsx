"use client";
import React from 'react';
import { Mail } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PasswordField from '../../components/molecules/PasswordField';
import AuthActionButtons from '../../components/molecules/AuthActionButtons';
import useTranslation from '../../hooks/useTranslation';

interface SignInFormData {
  identifier: string;
  password: string;
}

interface SignInFormProps {
  formData: SignInFormData;
  handleInputChange: (field: keyof SignInFormData, value: string) => void;
  onSubmit: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ formData, handleInputChange, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 sm:space-y-4">
      <InputField
        label={t("signInForm.identifier.label")}
        type="text"
        placeholder={t("signInForm.identifier.placeholder")}
        value={formData.identifier}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('identifier', e.target.value)}
        icon={Mail}
      />
      
      <PasswordField
        label={t("signInForm.password.label")}
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
      />
      
      {/* رابط نسيت كلمة المرور */}
      <div className="text-left mb-4">
        <a href="#" className="text-xs sm:text-sm text-teal-500 hover:text-teal-600 transition-colors">
          {t("signInForm.forgotPassword")}
        </a>
      </div>
      
      <AuthActionButtons
        onLogin={onSubmit}
        onCreateAccount={() => console.log('Create account')}
        loginText={t("signInForm.actions.login")}
        createAccountText={t("signInForm.actions.createAccount")}
      />
    </div>
  );
};

export default SignInForm;
