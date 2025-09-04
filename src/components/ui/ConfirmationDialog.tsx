// components/ui/ConfirmationDialog.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "warning",
  isLoading = false,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const getTypeColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          button: isDark 
            ? "bg-red-600 hover:bg-red-700 text-white" 
            : "bg-red-500 hover:bg-red-600 text-white",
          iconBg: isDark ? "bg-red-900" : "bg-red-100"
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          button: isDark 
            ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
            : "bg-yellow-500 hover:bg-yellow-600 text-white",
          iconBg: isDark ? "bg-yellow-900" : "bg-yellow-100"
        };
      default:
        return {
          icon: "text-blue-500",
          button: isDark 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : "bg-blue-500 hover:bg-blue-600 text-white",
          iconBg: isDark ? "bg-blue-900" : "bg-blue-100"
        };
    }
  };

  const colors = getTypeColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-md mx-auto rounded-lg shadow-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                  <AlertTriangle size={20} className={colors.icon} />
                </div>
                <h3 className={`text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}>
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className={`p-1 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <p className={`text-sm mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                {message}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {cancelText || t("cancel")}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${colors.button} ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري المعالجة...
                    </div>
                  ) : (
                    confirmText || t("confirm")
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;