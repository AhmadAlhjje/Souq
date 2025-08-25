'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'green' | 'blue' | 'white' | 'gray';
  message?: string;
  overlay?: boolean;
  pulse?: boolean;
  dots?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'green',
  message = '',
  overlay = true,
  pulse = false,
  dots = true,
}: LoadingSpinnerProps) {
  
  // تحديد أحجام مختلفة للسبينر مع تحسينات أكثر للمتاجر
  const sizeClasses = {
    sm: { 
      spinner: 'w-10 h-10 border-2', 
      inner: 'w-6 h-6',
      center: 'w-2 h-2',
      innerRing: 'w-4 h-4'
    },
    md: { 
      spinner: 'w-16 h-16 border-4', 
      inner: 'w-12 h-12',
      center: 'w-3 h-3',
      innerRing: 'w-8 h-8'
    },
    lg: { 
      spinner: 'w-20 h-20 border-4', 
      inner: 'w-16 h-16',
      center: 'w-4 h-4',
      innerRing: 'w-10 h-10'
    },
    xl: { 
      spinner: 'w-24 h-24 border-[6px]', 
      inner: 'w-20 h-20',
      center: 'w-5 h-5',
      innerRing: 'w-12 h-12'
    }
  };

  // ألوان محسنة مع تدرجات وتأثيرات فاخرة
  const colorClasses = {
    green: {
      main: 'border-emerald-200/60 border-t-emerald-500 border-r-emerald-600',
      glow: 'shadow-emerald-500/20',
      gradient: 'from-emerald-400 to-green-600'
    },
    blue: {
      main: 'border-blue-200/60 border-t-blue-500 border-r-blue-600',
      glow: 'shadow-blue-500/20',
      gradient: 'from-blue-400 to-cyan-600'
    },
    white: {
      main: 'border-gray-300/60 border-t-white border-r-gray-100',
      glow: 'shadow-gray-400/20',
      gradient: 'from-gray-100 to-white'
    },
    gray: {
      main: 'border-gray-300/60 border-t-gray-600 border-r-gray-700',
      glow: 'shadow-gray-500/20',
      gradient: 'from-gray-400 to-gray-600'
    }
  };

  // ألوان التأثيرات
  const effectColors = {
    green: 'emerald',
    blue: 'blue',
    white: 'gray',
    gray: 'gray'
  };

  // رسائل محسنة ومخصصة للمتاجر الإلكترونية - useMemo لحل مشكلة التحديث المستمر
  const messages = React.useMemo(() => [
    '🛒 جاري تحميل أحدث المنتجات...',
    '💫 نحضر لك تجربة تسوق مميزة...',
    '🔄 معالجة طلبك بعناية...',
    '🎯 البحث عن أفضل العروض...',
    '✨ تحديث الكتالوج...',
  ], []);

  // النقاط المتحركة محسنة مع تأثيرات أكثر
  const DotsAnimation = () => (
    <div className="flex items-center justify-center space-x-1.5 mt-4" style={{ direction: 'ltr' }}>
      {[0, 1, 2].map((index) => (
        <div 
          key={index}
          className={`w-2.5 h-2.5 bg-gradient-to-br ${colorClasses[color].gradient} rounded-full animate-bounce shadow-lg`}
          style={{ 
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  );

  const [currentMessage, setCurrentMessage] = React.useState(message || messages[0]);
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!message) {
      const interval = setInterval(() => {
        setMessageIndex(prev => {
          const nextIndex = (prev + 1) % messages.length;
          setCurrentMessage(messages[nextIndex]);
          return nextIndex;
        });
      }, 2800);
      return () => clearInterval(interval);
    }
  }, [message, messages]); // إضافة messages للـ dependencies بعد useMemo

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      {/* السبينر الرئيسي مع تحسينات فاخرة */}
      <div className="relative">
        {/* تأثير التوهج المتقدم */}
        {pulse && (
          <>
            <div className={`absolute inset-0 ${sizeClasses[size].spinner} border-4 border-${effectColors[color]}-400 rounded-full animate-ping opacity-25`}></div>
            <div className={`absolute -inset-2 ${sizeClasses[size].spinner} border-2 border-${effectColors[color]}-300 rounded-full animate-pulse opacity-30`} style={{ width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}></div>
          </>
        )}
        
        {/* خلفية متدرجة للعمق */}
        <div className={`absolute inset-1 ${sizeClasses[size].inner} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full shadow-inner`}></div>
        
        {/* السبينر الأساسي مع تدرج وظل */}
        <div className={`relative ${sizeClasses[size].spinner} ${colorClasses[color].main} rounded-full animate-spin shadow-xl ${colorClasses[color].glow}`} style={{ animationDuration: '1.5s' }}></div>
        
        {/* حلقة داخلية عكسية */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`${sizeClasses[size].innerRing} border-2 border-${effectColors[color]}-300 border-b-transparent rounded-full animate-spin opacity-60`} style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}></div>
        </div>
        
        {/* نقطة مركزية مع تأثير نابض متقدم */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size].center} bg-gradient-to-br ${colorClasses[color].gradient} rounded-full animate-pulse shadow-lg`} style={{ animationDuration: '2s' }}></div>
        
        {/* جزيئات دوارة صغيرة */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`w-1 h-1 bg-${effectColors[color]}-400 rounded-full absolute -top-6 animate-spin`} style={{ animationDuration: '3s' }}></div>
          <div className={`w-1 h-1 bg-${effectColors[color]}-400 rounded-full absolute -bottom-6 animate-spin`} style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        </div>
      </div>

      {/* النص المتحرك مع تحسينات */}
      {(message || !overlay) && (
        <div className="mt-8 text-center animate-fadeIn max-w-xs">
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm tracking-wide leading-relaxed transition-all duration-700">
            {currentMessage}
          </p>
          {dots && <DotsAnimation />}
        </div>
      )}
      
      {/* شريط تقدم محسن مع تدرجات */}
      <div className="mt-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner relative">
        <div className={`h-full bg-gradient-to-r ${colorClasses[color].gradient} rounded-full shadow-sm relative overflow-hidden`} style={{ width: '70%', animation: 'progress 3s ease-in-out infinite' }}>
          {/* تأثير انعكاس الضوء */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );

  if (!overlay) {
    return (
      <div className="flex items-center justify-center p-8">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 animate-fadeIn">
      <div className="bg-white/95 dark:bg-gray-900/95 rounded-3xl p-12 shadow-2xl border border-gray-200/60 dark:border-gray-700/60 mx-4 max-w-md w-full backdrop-blur-xl relative overflow-hidden">
        {/* خلفية متحركة ناعمة */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
        
        {/* المحتوى */}
        <div className="relative z-10">
          {spinnerContent}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 85%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(200%) skewX(12deg);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        /* تحسين الظلال والتأثيرات */
        .dark .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }

        .shadow-emerald-500\/20 {
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2);
        }

        .shadow-blue-500\/20 {
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
        }

        .shadow-gray-400\/20 {
          box-shadow: 0 10px 25px -5px rgba(156, 163, 175, 0.2);
        }

        .shadow-gray-500\/20 {
          box-shadow: 0 10px 25px -5px rgba(107, 114, 128, 0.2);
        }

        /* تحسين النقاط المتحركة */
        .animate-bounce {
          animation: bounce 1.2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-10px);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        /* تأثير الانعكاس المحسن */
        @media (prefers-reduced-motion: no-preference) {
          .animate-spin {
            animation: spin 1.5s linear infinite;
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-ping {
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        }
      `}</style>
    </div>
  );
}