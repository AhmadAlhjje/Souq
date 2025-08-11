"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

interface AdminQuickActionCardProps {
  title: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const AdminQuickActionCard: React.FC<AdminQuickActionCardProps> = ({
  title,
  icon: Icon,
  href,
  onClick,
  className = '',
  disabled = false,
}) => {
  const { isDark } = useTheme();

  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`
        p-4 rounded-lg border transition-all duration-200 hover:shadow-md
        ${isDark 
          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
          : 'bg-[#CFF7EE] border-[#96EDD9] hover:bg-[#BAF3E6]'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${className}
      `}
    >
      <Icon size={24} className={`
        mx-auto mb-2 ${isDark ? 'text-gray-300' : 'text-[#004D5A]'}
      `} />
      <p className={`text-sm font-medium ${
        isDark ? 'text-white' : 'text-[#004D5A]'
      }`}>
        {title}
      </p>
    </motion.button>
  );
};

export default AdminQuickActionCard;