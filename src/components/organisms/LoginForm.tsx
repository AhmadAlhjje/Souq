import React from 'react';
import { User } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PasswordField from '../../components/molecules/PasswordField';
import PhoneField from '../../components/molecules/PhoneField';
import AuthActionButtons from '../../components/molecules/AuthActionButtons';
import { SignUpFormData } from '../../types/FormData';

interface LoginFormProps {
  formData: SignUpFormData;
  handleInputChange: (field: keyof SignUpFormData, value: string) => void;
  onSubmit: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleInputChange, onSubmit }) => {
  return (
    <div className="space-y-2 sm:space-y-4">
      <InputField
        label="الإسم الكريم"
        type="text"
        placeholder="أدخل الإسم الكريم"
        value={formData.fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
        icon={User}
      />
      
      <InputField
        label="البريد الإلكتروني"
        type="email"
        placeholder="أدخل البريد الإلكتروني"
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
        // icon is optional, no need to pass it for email field if you don't want to
      />
      
      <PhoneField
        label="رقم الجوال"
        countryCode={formData.countryCode}
        setCountryCode={(value: string) => handleInputChange('countryCode', value)}
        phoneNumber={formData.phoneNumber}
        setPhoneNumber={(value: string) => handleInputChange('phoneNumber', value)}
      />
      
      <PasswordField
        label="كلمة المرور"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
      />
      
      <AuthActionButtons
        onLogin={onSubmit}
        onCreateAccount={() => console.log('Create account')}
      />
    </div>
  );
};

export default LoginForm;