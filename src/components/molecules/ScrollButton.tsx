// components/molecules/ScrollButton.tsx

'use client'; // ✅ ضروري

import React from 'react';

interface ScrollButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ direction, onClick, disabled }) => {
  const isLeft = direction === 'left';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        flex-shrink-0 w-10 h-12 flex items-center justify-center
        rounded-full shadow-md bg-white border border-gray-200
        hover:bg-gray-50 active:scale-95
        transition-all duration-200 
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${isLeft ? 'mr-1 ml-0.5' : 'ml-1 mr-0.5'}
        focus:outline-none focus:ring-2 focus:ring-blue-300
      `}
      aria-label={`Scroll ${direction}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
};

export default ScrollButton;