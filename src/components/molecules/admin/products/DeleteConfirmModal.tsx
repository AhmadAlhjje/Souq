"use client";

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, AlertCircle } from 'lucide-react';
import useTheme from '@/hooks/useTheme';
import Button from '../../../atoms/Button';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
  confirmText,
  cancelText,
  variant = 'danger',
}) => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';

  // Handle escape key and body scroll - MOVED BEFORE RETURN
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  // باقي الكود كما هو بدون تغيير...
  const getTitle = () => {
    if (title) return title;
    return variant === 'danger' 
      ? t('modals.deleteConfirm.title')
      : t('modals.deleteConfirm.warningTitle');
  };

  const getMessage = () => {
    if (message) return message;
    return itemName 
      ? t('modals.deleteConfirm.messageWithItem', { itemName })
      : t('modals.deleteConfirm.messageGeneral');
  };

  const getConfirmText = () => {
    if (confirmText) return confirmText;
    return variant === 'danger' 
      ? t('modals.deleteConfirm.confirmDelete')
      : t('modals.deleteConfirm.confirmAction');
  };

  const getCancelText = () => {
    return cancelText || t('modals.deleteConfirm.cancel');
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  // Handle confirm action
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in confirm action:', error);
    }
  };

  // Get variant styles with dark mode support
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: isDark ? 'bg-yellow-900/20' : 'bg-yellow-100',
          iconColor: isDark ? 'text-yellow-400' : 'text-yellow-600',
          icon: AlertCircle,
        };
      case 'danger':
      default:
        return {
          iconBg: isDark ? 'bg-red-900/20' : 'bg-red-100',
          iconColor: isDark ? 'text-red-400' : 'text-red-600',
          icon: AlertCircle,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const Icon = variantStyles.icon;

  // Dark mode classes
  const modalBgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';
  const titleClass = isDark ? 'text-gray-100' : 'text-[#004D5A]';
  const textClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const itemBgClass = isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200';
  const itemTextClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const itemNameClass = isDark ? 'text-gray-100' : 'text-[#004D5A]';
  const closeBtnClass = isDark 
    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-600';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          ${modalBgClass} rounded-lg shadow-xl max-w-md w-full 
          transform transition-all duration-200 scale-100
          ${isRTL ? 'text-right' : 'text-left'}
          ${loading ? 'pointer-events-none' : ''}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderClass}`}>
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-10 h-10 ${variantStyles.iconBg} rounded-full flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${variantStyles.iconColor}`} />
            </div>
            <h3 
              id="modal-title" 
              className={`text-lg font-semibold ${titleClass}`}
            >
              {getTitle()}
            </h3>
          </div>
          
          <button
            onClick={onClose}
            disabled={loading}
            className={`
              flex-shrink-0 w-8 h-8 ${closeBtnClass}
              rounded-full flex items-center justify-center transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-label={t('modals.deleteConfirm.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p 
            id="modal-description" 
            className={`${textClass} leading-relaxed`}
          >
            {getMessage()}
          </p>
          
          {/* Additional info if itemName is provided */}
          {itemName && (
            <div className={`mt-4 p-3 ${itemBgClass} rounded-lg border`}>
              <p className={`text-sm ${itemTextClass}`}>
                <span className="font-medium">
                  {t('modals.deleteConfirm.selectedItem')}
                </span>
                <span className={`${isRTL ? 'mr-2' : 'ml-2'} font-semibold ${itemNameClass}`}>
                  {itemName}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${borderClass} ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            text={getCancelText()}
            onClick={onClose}
            disabled={loading}
            variant="ghost"
            className="flex-1"
          />
          <Button
            text={getConfirmText()}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            startIcon={loading ? undefined : <Trash2 className="w-4 h-4" />}
            variant="danger"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;