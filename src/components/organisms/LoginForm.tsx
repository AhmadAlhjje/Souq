// components/organisms/LoginForm.tsx
"use client";
import React from 'react';
import { User, Loader2, Lock } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PhoneField from '../../components/molecules/PhoneField';
import { useTranslation } from 'react-i18next';

interface SignUpFormData {
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string; // إضافة حقل تأكيد كلمة المرور
}

interface LoginFormProps {
  formData: SignUpFormData;
  handleInputChange: (field: keyof SignUpFormData, value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  handleInputChange, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted - calling onSubmit");
    onSubmit();
  };

  const handleButtonClick = () => {
    console.log("Button clicked - calling onSubmit");
    onSubmit();
  };

  const handlePhoneChange = (value: string | undefined) => {
    handleInputChange('phoneNumber', value || '');
  };

  // التحقق من تطابق كلمات المرور
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword && !passwordsMatch;

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4">
      <InputField
        label="اسم المستخدم"
        type="text"
        placeholder="أدخل اسم المستخدم"
        value={formData.username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
        icon={User}
        required={true}
        disabled={isLoading}
      />
      
      <PhoneField
        label="رقم الهاتف"
        value={formData.phoneNumber}
        onChange={handlePhoneChange}
        required={true}
        disabled={isLoading}
      />
      
      <InputField
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
        icon={Lock}
        required={true}
        disabled={isLoading}
      />
      
      {/* حقل تأكيد كلمة المرور */}
      <div className="space-y-1">
        <InputField
          label="تأكيد كلمة المرور"
          type="password"
          placeholder="أعد إدخال كلمة المرور"
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
          icon={Lock}
          required={true}
          disabled={isLoading}
        />
        
        {/* رسالة خطأ عند عدم التطابق */}
        {showPasswordMismatch && (
          <p className="text-red-500 text-sm mt-1 pr-2">
            كلمات المرور غير متطابقة
          </p>
        )}
        
        {/* رسالة نجاح عند التطابق */}
        {formData.confirmPassword && passwordsMatch && formData.password && (
          <p className="text-green-500 text-sm mt-1 pr-2">
            ✓ كلمات المرور متطابقة
          </p>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          onClick={handleButtonClick}
          disabled={isLoading || showPasswordMismatch || !passwordsMatch}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            transition-all duration-200 flex items-center justify-center
            ${isLoading || showPasswordMismatch || !passwordsMatch
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              جاري إنشاء الحساب...
            </>
          ) : (
            "إنشاء حساب"
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;