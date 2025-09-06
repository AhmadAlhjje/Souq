// components/ui/VerificationPopup.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Loader2 } from 'lucide-react';

interface VerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  isLoading: boolean;
  phoneNumber: string;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  isOpen,
  onClose,
  onVerify,
  isLoading,
  phoneNumber
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  
  useEffect(() => {
    if (!isOpen) return;
    
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

  const handleClose = () => {
    setVerificationCode('');
    setTimeLeft(300);
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
            <p className="text-sm text-gray-500">
              الوقت المتبقي: <span className="font-mono font-bold text-teal-600">{formatTime(timeLeft)}</span>
            </p>
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
                className="w-full p-4 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition-colors tracking-widest"
                disabled={isLoading || timeLeft === 0}
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
                disabled={verificationCode.length !== 6 || isLoading || timeLeft === 0}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white
                  transition-all duration-200 flex items-center justify-center
                  ${verificationCode.length === 6 && !isLoading && timeLeft > 0
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
                ) : timeLeft === 0 ? (
                  "انتهت صلاحية الرمز"
                ) : (
                  "تأكيد الرمز"
                )}
              </button>
            </div>
          </form>

          {/* Resend option */}
          {timeLeft === 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleClose}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                إعادة إرسال الرمز
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 تلميح:</strong> تحقق من رسائل الواتساب الواردة على الرقم المسجل
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;