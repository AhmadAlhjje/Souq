// src/components/molecules/AuthActionButtons/AuthActionButtons.tsx
import React from 'react';
import Button from '../../components/atoms/Button';

interface AuthActionButtonsProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  loginText?: string;           // إضافة نص زر تسجيل الدخول (اختياري)
  createAccountText?: string;   // إضافة نص زر إنشاء حساب (اختياري)
}

const AuthActionButtons: React.FC<AuthActionButtonsProps> = ({
  onLogin,
  onCreateAccount,
  loginText = "تسجيل",            // قيم افتراضية للزر
  createAccountText = "إنشاء حساب"  // قيم افتراضية للزر
}) => {
  return (
    <div className="space-y-3">
      <Button 
        text={loginText}
        onClick={onLogin}
        className="w-full py-2 px-3 sm:py-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:from-teal-500 hover:to-teal-600"
      />
      <Button 
        text={createAccountText}
        onClick={onCreateAccount}
        className="w-full py-2 px-3 sm:py-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white"
      />
      {/* يمكنك إعادة تفعيل النص أسفل الأزرار إذا أردت */}
      {/* <div className="text-center text-xs sm:text-sm text-gray-600 px-2">
        بالتسجيل فإنك توافق على إشتراك استخدام TMC وسياسة الخصوصية
      </div> */}
    </div>
  );
};

export default AuthActionButtons;
