'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  // إظهار الـ Toast مع انيميشن
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // شريط التقدم التلقائي
  useEffect(() => {
    if (isPaused) return; // إيقاف التقدم عند وضع الماوس

    const duration = 5000; // 5 ثواني
    const interval = 50; // تحديث كل 50ms
    const decrement = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          onClose(id);
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [id, onClose, isPaused]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-gradient-to-r from-emerald-500 to-green-500',
          borderColor: 'border-emerald-400',
          iconBg: 'bg-emerald-400',
          progressColor: 'bg-emerald-200',
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
          borderColor: 'border-red-400',
          iconBg: 'bg-red-400',
          progressColor: 'bg-red-200',
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'info':
        return {
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          borderColor: 'border-blue-400',
          iconBg: 'bg-blue-400',
          progressColor: 'bg-blue-200',
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'warning':
        return {
          bgColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
          borderColor: 'border-amber-400',
          iconBg: 'bg-amber-400',
          progressColor: 'bg-amber-200',
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-gradient-to-r from-gray-500 to-slate-500',
          borderColor: 'border-gray-400',
          iconBg: 'bg-gray-400',
          progressColor: 'bg-gray-200',
          icon: (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const config = getToastConfig();

  return (
    <div
      className={`
        fixed bottom-6 left-6 
        ${config.bgColor} text-white
        rounded-2xl shadow-2xl border-2 ${config.borderColor}
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-full opacity-0 scale-95'}
        flex items-start p-4 max-w-sm min-w-80 z-50
        backdrop-blur-sm cursor-pointer
      `}
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* الأيقونة */}
      <div className={`${config.iconBg} rounded-full p-2 mr-3 flex-shrink-0 shadow-lg`}>
        {config.icon}
      </div>

      {/* المحتوى */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed break-words">
              {message}
            </p>
          </div>
          
          {/* زر الإغلاق */}
          <button
            onClick={() => onClose(id)}
            className="ml-3 flex-shrink-0 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all duration-200 hover:scale-110"
            aria-label="إغلاق الإشعار"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* شريط التقدم */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full ${config.progressColor} rounded-full transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* رمز المتجر الصغير */}
        <div className="flex items-center mt-2 text-xs opacity-75">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
          </svg>
          <span>متجرك الإلكتروني</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        /* تحسين الظلال للوضع المظلم */
        @media (prefers-color-scheme: dark) {
          .shadow-2xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

// مثال للاستخدام
function ToastDemo() {
  const [toasts, setToasts] = useState<Array<{id: string, message: string, type: 'success' | 'error' | 'info' | 'warning'}>>([]);

  const addToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    const messages = {
      success: 'تم إضافة المنتج إلى السلة بنجاح! 🛒',
      error: 'عذراً، حدث خطأ أثناء العملية. يرجى المحاولة مرة أخرى',
      info: 'لديك خصم 20% على الطلبية التالية! 🎉',
      warning: 'المنتج أوشك على النفاد - تبقى 3 قطع فقط!'
    };

    const newToast = {
      id: Date.now().toString(),
      message: messages[type],
      type
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🛍️ Toast Notifications للمتاجر الإلكترونية
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            إشعارات محسنة خصيصاً لتجربة التسوق الإلكتروني
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">جرب الإشعارات المختلفة:</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => addToast('success')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              ✅ نجح
            </button>
            <button
              onClick={() => addToast('error')}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              ❌ خطأ
            </button>
            <button
              onClick={() => addToast('info')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              ℹ️ معلومات
            </button>
            <button
              onClick={() => addToast('warning')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              ⚠️ تحذير
            </button>
          </div>
        </div>

        {/* عرض الـ Toasts */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}

export default Toast;
export { ToastDemo };