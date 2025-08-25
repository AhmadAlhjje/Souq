// src/components/common/ConfirmationModal.tsx
import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export type ConfirmationVariant = 'success' | 'warning' | 'danger' | 'info';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isDark?: boolean;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = 'warning',
  isDark = false,
  loading = false
}) => {
  if (!isOpen) return null;

  // تحديد الألوان والأيقونات حسب النوع
  const variantConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-teal-500',
      iconBg: isDark ? 'bg-teal-500/20' : 'bg-teal-100',
      confirmButtonClass: isDark 
        ? 'bg-teal-600 hover:bg-teal-700 text-white' 
        : 'bg-teal-500 hover:bg-teal-600 text-white',
      borderColor: isDark ? 'border-teal-500/30' : 'border-teal-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      confirmButtonClass: isDark 
        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
        : 'bg-yellow-500 hover:bg-yellow-600 text-white',
      borderColor: isDark ? 'border-yellow-500/30' : 'border-yellow-200'
    },
    danger: {
      icon: XCircle,
      iconColor: 'text-red-500',
      iconBg: isDark ? 'bg-red-500/20' : 'bg-red-100',
      confirmButtonClass: isDark 
        ? 'bg-red-600 hover:bg-red-700 text-white' 
        : 'bg-red-500 hover:bg-red-600 text-white',
      borderColor: isDark ? 'border-red-500/30' : 'border-red-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      confirmButtonClass: isDark 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white',
      borderColor: isDark ? 'border-blue-500/30' : 'border-blue-200'
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md transform transition-all duration-300 scale-100 ${
        isDark 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      } rounded-2xl shadow-2xl overflow-hidden`}>
        
        {/* Close button */}
        <button
          onClick={handleCancel}
          disabled={loading}
          className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isDark 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${config.iconBg}`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>

          {/* Message */}
          <p className={`text-center mb-6 leading-relaxed ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCancel}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300'
              }`}
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              } ${config.confirmButtonClass}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>جاري المعالجة...</span>
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>

        {/* Bottom border accent */}
        <div className={`h-1 ${config.iconBg}`}></div>
      </div>
    </div>
  );
};

export default ConfirmationModal;