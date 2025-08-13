// الحل الأول: تحديث Badge component ليدعم كلاً من text وchildren وإضافة primary
// components/atoms/Badge.tsx
import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  text?: string; // إضافة text property
  variant?: 'default' | 'sale' | 'new' | 'saleNew' | 'defaultNew' | 'newNew' | 'primary'; // إضافة primary
  className?: string; // إضافة className للمرونة
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  text, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    sale: "bg-red-100 text-red-800", 
    new: "bg-teal-100 text-teal-800",
    saleNew: "bg-[#96EDD9] text-[#004D5A]",
    defaultNew: "bg-[#CFF7EE] text-[#004D5A]",
    newNew: "bg-[#BAF3E6] text-[#004D5A]",
    primary: "bg-[#004D5A] text-white" // إضافة primary variant
  };

  // تحديد المحتوى - إما text أو children
  const content = children || text;

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {content}
    </span>
  );
};

export default Badge;