import React from 'react';
import { Mail } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PasswordField from '../../components/molecules/PasswordField';
import AuthActionButtons from '../../components/molecules/AuthActionButtons';

// تعريف الأنواع
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
  return (
    <div className="space-y-2 sm:space-y-4">
      <InputField
        label="البريد الإلكتروني أو رقم الجوال"
        type="text"
        placeholder="أدخل البريد الإلكتروني أو رقم الجوال"
        value={formData.identifier}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('identifier', e.target.value)}
        icon={Mail}
      />
      
      <PasswordField
        label="كلمة المرور"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
      />
      
      {/* رابط نسيت كلمة المرور */}
      <div className="text-left mb-4">
        <a href="#" className="text-xs sm:text-sm text-teal-500 hover:text-teal-600 transition-colors">
          نسيت كلمة المرور؟
        </a>
      </div>
      
      <AuthActionButtons
        onLogin={onSubmit}
        onCreateAccount={() => console.log('Create account')}
      />
    </div>
  );
};

export default SignInForm;