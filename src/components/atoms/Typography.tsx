import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body', 
  className = '' 
}) => {
  const variants = {
    h1: 'text-5xl font-bold bg-gradient-to-r from-[#004D5A] via-[#006B7A] to-[#008599] bg-clip-text text-transparent',
    h2: 'text-4xl font-bold bg-gradient-to-r from-[#004D5A] to-[#006B7A] bg-clip-text text-transparent',
    h3: 'text-xl font-bold text-[#004D5A]',
    body: 'text-base text-[#004D5A]',
    caption: 'text-sm text-[#004D5A]/70'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Typography;