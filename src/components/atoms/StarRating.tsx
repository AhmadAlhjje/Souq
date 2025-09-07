// components/atoms/StarRating.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  fillColor?: string;
  emptyColor?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className = '',
  fillColor = 'text-yellow-400',
  emptyColor = 'text-gray-300'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const renderStars = () =>
    Array.from({ length: maxRating }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          i < Math.floor(rating)
            ? `${fillColor} fill-current`
            : emptyColor
        }`}
      />
    ));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;