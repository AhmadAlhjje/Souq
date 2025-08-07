import React from 'react';

interface TextProps {
  text: string;
  variant?: 'body' | 'subtitle' | 'caption' | 'hero' | 'counter';
  className?: string;
}

export default function Text({ text, variant = 'body', className = '' }: TextProps) {
  const variantStyles = {
    body: 'text-gray-700 text-base leading-relaxed',
    subtitle: 'text-gray-600 text-lg leading-relaxed',
    caption: 'text-gray-500 text-sm',
    hero: 'text-white/90 text-lg md:text-xl leading-relaxed',
    counter: 'font-bold text-xl'
  };

  return (
    <p className={`${variantStyles[variant]} ${className}`}>
      {text}
    </p>
  );
}