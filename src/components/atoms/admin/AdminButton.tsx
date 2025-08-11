"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

export type AdminButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
export type AdminButtonSize = 'sm' | 'md' | 'lg';

interface AdminButtonProps {
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconSize?: number;
  variant?: AdminButtonVariant;
  size?: AdminButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  icon: Icon,
  iconSize = 18,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  title,
  type = 'button',
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    const baseClasses = "transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2";
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} ${
          isDark 
            ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500/20' 
            : 'bg-[#004D5A] hover:bg-[#003944] text-white focus:ring-[#004D5A]/20'
        }`;
      case 'secondary':
        return `${baseClasses} border ${
          isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600 focus:ring-gray-500/20' 
            : 'bg-white hover:bg-[#CFF7EE] text-[#004D5A] border-[#96EDD9] focus:ring-[#96EDD9]/20'
        }`;
      case 'danger':
        return `${baseClasses} ${
          isDark 
            ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/20' 
            : 'bg-[#5CA9B5] hover:bg-[#4A8B96] text-white focus:ring-[#5CA9B5]/20'
        }`;
      case 'ghost':
        return `${baseClasses} ${
          isDark 
            ? 'text-gray-300 hover:bg-gray-700 focus:ring-gray-500/20' 
            : 'text-[#004D5A] hover:bg-[#CFF7EE] focus:ring-[#96EDD9]/20'
        }`;
      case 'icon':
        return `${baseClasses} ${
          isDark 
            ? 'text-gray-300 hover:bg-gray-700 focus:ring-gray-500/20' 
            : 'text-[#004D5A] hover:bg-[#96EDD9] focus:ring-[#96EDD9]/20'
        }`;
      default:
        return baseClasses;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIconOnlyClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'md':
        return 'p-2';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const isIconOnly = Icon && !children;
  const sizeClasses = isIconOnly ? getIconOnlyClasses() : getSizeClasses();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${getVariantClasses()}
        ${sizeClasses}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isIconOnly ? 'flex items-center justify-center' : 'flex items-center gap-2'}
        ${className}
      `}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
          size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
        }`} />
      ) : (
        <>
          {Icon && <Icon size={iconSize} />}
          {children && <span className="truncate">{children}</span>}
        </>
      )}
    </motion.button>
  );
};

export default AdminButton;