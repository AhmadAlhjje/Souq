// components/atoms/Heading.tsx
import React, { JSX } from 'react';

interface HeadingProps {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'hero' | 'section' | 'cta' | 'default';
  className?: string;
}

export default function Heading({ text, level, variant = 'default', className = '' }: HeadingProps) {
  const variantStyles = {
    hero: 'text-white font-bold',
    section: 'text-[#004D5A] font-bold',
    cta: 'text-[#004D5A] font-bold',
    default: 'text-gray-900 font-semibold'
  };

  const baseStyles = 'leading-tight';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return React.createElement(HeadingTag, {
    className: combinedClassName
  }, text);
}