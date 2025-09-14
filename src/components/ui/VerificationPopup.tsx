// components/ui/VerificationPopup.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Loader2, RefreshCw } from 'lucide-react';

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  resendLoading: boolean;
  phoneNumber: string;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  isLoading,
  resendLoading,
  phoneNumber
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // عداد لمنع الإرسال المتكرر
  
  useEffect(() => {
    if (!isOpen) return;
    
    // إعادة تعيين العداد عند فتح النافذة
    setTimeLeft(300);
    setCanResend(true); // السماح بإعادة الإرسال من البداية
    setResendCooldown(0);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // عداد منفصل لإعادة الإرسال
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length === 6) {
      onVerify(verificationCode);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // فقط الأرقام
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  const handleResend = () => {
    // إعادة تعيين الحقول
    setVerificationCode('');
    
    // تعيين فترة انتظار قبل السماح بإعادة الإرسال مرة أخرى (60 ثانية)
    setCanResend(false);
    setResendCooldown(60);
    
    // استدعاء دالة إعادة الإرسال
    onResend();
  };

  const handleClose = () => {
    setVerificationCode('');
    setTimeLeft(300);
    setCanResend(true);
    setResendCooldown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            disabled={isLoading || resendLoading}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">تأكيد رقم الواتساب</h2>
              <p className="text-teal-100 text-sm mt-1">
                تم إرسال رمز التحقق إلى {phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              أدخل رمز التحقق المكون من 6 أرقام
            </p>
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-500">
                الوقت المتبقي: <span className="font-mono font-bold text-teal-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                انتهت صلاحية الرمز - يرجى طلب رمز جديد
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Verification Code Input */}
            <div className="relative">
              <input
                type="text"
                value={verificationCode}
                onChange={handleInputChange}
                placeholder="123456"
                maxLength={6}
                className="w-full p-4 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition-colors tracking-widest disabled:bg-gray-100"
                disabled={isLoading || resendLoading}
                autoFocus
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-center space-x-2 rtl:space-x-reverse -mb-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-1 rounded-full transition-colors ${
                      index < verificationCode.length
                        ? 'bg-teal-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={verificationCode.length !== 6 || isLoading || resendLoading}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white
                  transition-all duration-200 flex items-center justify-center
                  ${verificationCode.length === 6 && !isLoading && !resendLoading
                    ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    جاري التحقق...
                  </>
                ) : (
                  "تأكيد الرمز"
                )}
              </button>
            </div>
          </form>

          {/* Resend Button */}
          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={!canResend || resendLoading || isLoading}
              className={`
                w-full py-2.5 px-4 rounded-lg font-medium
                transition-all duration-200 flex items-center justify-center
                ${!canResend || resendLoading || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-teal-600 hover:bg-gray-200 active:bg-gray-300'
                }
              `}
            >
              {resendLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  جاري إعادة الإرسال...
                </>
              ) : !canResend && resendCooldown > 0 ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة الإرسال خلال {resendCooldown} ثانية
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة إرسال رمز التحقق
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 تلميح:</strong> تحقق من رسائل الواتساب الواردة على الرقم المسجل
            </p>
            {timeLeft === 0 && (
              <p className="text-sm text-red-700 mt-2">
                <strong>⏰ انتبه:</strong> انتهت صلاحية الرمز، يرجى طلب رمز جديد
              </p>
            )}
            {resendCooldown > 0 && (
              <p className="text-sm text-orange-700 mt-2">
                <strong>⏳ انتظر:</strong> يمكنك طلب رمز جديد خلال {resendCooldown} ثانية
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;