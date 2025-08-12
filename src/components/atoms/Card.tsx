
// components/atoms/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
