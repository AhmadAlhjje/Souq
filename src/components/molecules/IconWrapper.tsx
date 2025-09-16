'use client';
import React from 'react';
import useTheme from '@/hooks/useTheme';

interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string; // سيتم تجاهل هذا والاعتماد على الثيم
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ 
  icon, 
  gradient, // تجاهل هذا المعامل
  size = 'md',
  className = '' 
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      rounded-xl 
      flex items-center justify-center 
      transition-all duration-300
      ${isDark 
        ? 'bg-emerald-600/90 text-white' 
        : 'bg-teal-600/90 text-white'
      }
      ${className}
    `}>
      {icon}
    </div>
  );
};

export default IconWrapper;