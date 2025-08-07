import React, { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'white' | 'light' | 'gradient' | 'gradient-light';
}

export default function Section({ 
  children, 
  className = '', 
  background = 'white' 
}: SectionProps) {
  const backgroundStyles = {
    white: 'bg-white',
    light: 'bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#96EDD9]/5',
    gradient: 'bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670]',
    'gradient-light': 'bg-gradient-to-r from-[#004D5A]/5 to-[#96EDD9]/5'
  };

  return (
    <section className={`${backgroundStyles[background]} ${className}`}>
      {children}
    </section>
  );
}