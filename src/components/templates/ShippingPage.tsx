'use client';

import React, { useEffect } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastProvider } from '@/hooks/useToast';
import ShippingForm from '@/components/organisms/ShippingForm';
import Button from '@/components/atoms/Button';
import { useThemeContext } from '@/contexts/ThemeContext'; // ✅ استيراد الثيم

const ShippingPage: React.FC = () => {
  const { theme, toggleTheme, isDark, isLight } = useThemeContext(); // ✅ استخدام السياق
  const { sessionId, isLoading, getSessionInfo } = useSession();

  // ✅ دالة الخلفية حسب الثيم (مشابهة لصفحة المتاجر والسلة)
  const getBackgroundGradient = () => {
    if (isLight) {
      return 'linear-gradient(135deg, #CFF7EE 0%, #96EDD9 50%, #BAF3E6 100%)';
    } else {
      return 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)';
    }
  };

  // ✅ شاشة التحميل باستخدام LoadingSpinner الفاخر
  if (isLoading) {
    return (
      <div
        className="h-dvh w-dvw flex items-center justify-center"
        style={{ background: getBackgroundGradient() }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message="جاري تهيئة الجلسة..."
          overlay={true}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div
        className="h-dvh w-dvw flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500"
        style={{
          background: getBackgroundGradient(),
          backgroundAttachment: 'fixed',
        }}
      >
        {/* شريط علوي مع معلومات المستخدم */}
        <div className={`absolute top-0 left-0 right-0 z-10 backdrop-blur-sm border-b ${
          isDark ? 'bg-black/20 border-white/20' : 'bg-white/10 border-white/20'
        }`}>
          <div className="flex justify-between items-center px-4 py-3">
            {/* زر تبديل الثيم */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="sm"
              className="rounded-full p-2"
              startIcon={isLight ? <Moon size={18} /> : <Sun size={18} />}
            >
              {isLight ? 'الوضع المظلم' : 'الوضع المضيء'}
            </Button>

            {/* معلومات المستخدم والـ session */}
            <div className="flex items-center gap-3">
              <div className={`backdrop-blur-sm rounded-lg px-3 py-2 border ${
                isDark ? 'bg-white/10 border-white/20' : 'bg-white/10 border-white/20'
              }`}>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    مستخدم: {sessionId?.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* محتوى الصفحة */}
        <div className="flex-1 w-full h-full px-4 pt-20 pb-8 flex items-center justify-center">
          <div className="w-full h-full max-h-full">
            <ShippingForm /> {/* ✅ إزالة prop theme — سيتم استخدام السياق داخله */}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default ShippingPage;