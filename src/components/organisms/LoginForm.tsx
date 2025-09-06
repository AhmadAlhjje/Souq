// components/organisms/LoginForm.tsx
"use client";
import React from 'react';
import { User, Loader2, Lock, KeyRound } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import PhoneField from '../../components/molecules/PhoneField';
import { useTranslation } from 'react-i18next';

interface SignUpFormData {
  username: string;
  phoneNumber: string; // الآن سيحتوي على رقم الهاتف الكامل مع رمز البلد
  password: string;
  confirmPassword: string; // حقل جديد لتأكيد كلمة المرور
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

  // التحقق من تطابق كلمتي المرور للعرض البصري
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordMismatch = formData.confirmPassword.length > 0 && !passwordsMatch;

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
      
      {/* حقل تأكيد كلمة المرور الجديد */}
      <div className="space-y-1">
        <InputField
          label="تأكيد كلمة المرور"
          type="password"
          placeholder="أعد إدخال كلمة المرور"
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
          icon={KeyRound}
          required={true}
          disabled={isLoading}
        />
        
        {/* رسالة تحذير إذا كانت كلمتا المرور غير متطابقتين */}
        {showPasswordMismatch && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <span className="mr-1">⚠️</span>
            كلمتا المرور غير متطابقتين
          </p>
        )}
        
        {/* رسالة تأكيد إذا كانت كلمتا المرور متطابقتين */}
        {formData.confirmPassword.length > 0 && passwordsMatch && (
          <p className="text-green-500 text-sm mt-1 flex items-center">
            <span className="mr-1">✅</span>
            كلمتا المرور متطابقتان
          </p>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            transition-all duration-200 flex items-center justify-center
            ${isLoading 
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