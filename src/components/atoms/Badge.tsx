import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'hero' | 'success' | 'warning';
  className?: string;
}

export default function Badge({ text, variant = 'primary', className = '' }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-[#004D5A]/5 px-4 py-2 rounded-full border border-[#004D5A]/10 text-[#004D5A] font-medium text-sm',
    hero: 'bg-[#96EDD9]/20 px-6 py-2 rounded-full border border-[#96EDD9]/30 text-[#96EDD9] font-medium text-sm',
    success: 'bg-green-100 px-4 py-2 rounded-full border border-green-200 text-green-700 font-medium text-sm',
    warning: 'bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200 text-yellow-700 font-medium text-sm'
  };

  return (
    <div className={`inline-flex items-center ${variantStyles[variant]} ${className}`}>
      <span>{text}</span>
    </div>
  );
}