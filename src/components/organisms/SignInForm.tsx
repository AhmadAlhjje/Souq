"use client";
import React from 'react';
import { User, Loader2 } from 'lucide-react';
import InputField from '../../components/molecules/InputField';
import { useTranslation } from 'react-i18next';

interface SignInFormData {
  username: string;
  password: string;
}

interface SignInFormProps {
  formData: SignInFormData;
  handleInputChange: (field: keyof SignInFormData, value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ 
  formData, 
  handleInputChange, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SignIn form submitted - calling onSubmit");
    onSubmit();
  };

  const handleButtonClick = () => {
    console.log("SignIn button clicked - calling onSubmit");
    onSubmit();
  };

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
      
      {/* استبدال PasswordField بـ InputField مع type="password" */}
      <InputField
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        value={formData.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
        required={true}
        disabled={isLoading}
      />
      
      {/* رابط نسيت كلمة المرور */}
      <div className="text-left mb-4">
        <a href="#" className="text-xs sm:text-sm text-teal-500 hover:text-teal-600 transition-colors">
          نسيت كلمة المرور؟
        </a>
      </div>
      
      <div className="pt-2">
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
              جاري تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;