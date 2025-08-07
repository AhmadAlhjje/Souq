// components/molecules/ScrollButton.tsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ScrollButton({ 
  direction, 
  onClick, 
  disabled = false, 
  className = '' 
}: ScrollButtonProps) {
  const Icon = direction === 'left' ? FaChevronLeft : FaChevronRight;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-12 h-12 
        bg-white/90 backdrop-blur-sm
        border border-gray-200/50
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:bg-white hover:shadow-lg
        disabled:opacity-30 disabled:cursor-not-allowed
        disabled:hover:bg-white/90 disabled:hover:shadow-none
        z-10
        ${className}
      `}
      aria-label={`Scroll ${direction}`}
    >
      <Icon className={`
        text-[#004D5A] text-sm
        transition-transform duration-200
        ${!disabled && 'group-hover:scale-110'}
      `} />
    </button>
  );
}