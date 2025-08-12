// components/atoms/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'saleNew' | 'defaultNew' | 'newNew';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    sale: "bg-red-100 text-red-800", 
    new: "bg-teal-100 text-teal-800",
    saleNew: "bg-[#96EDD9] text-[#004D5A]",
    defaultNew: "bg-[#CFF7EE] text-[#004D5A]",
    newNew: "bg-[#BAF3E6] text-[#004D5A]"
    
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};

export default Badge;