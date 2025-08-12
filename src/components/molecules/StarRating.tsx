
// components/molecules/StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { StarVariant } from '@/types/Product';

interface StarIconProps {
  filled: boolean;
  onClick?: () => void;
  variant?: StarVariant;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, onClick, variant = 'default' }) => {
  const colorClasses = variant === 'new' 
    ? (filled ? 'text-[#5CA9B5] fill-current' : 'text-[#95EDD8]')
    : (filled ? 'text-yellow-400 fill-current' : 'text-gray-300');
    
  return (
    <Star
      className={`w-4 h-4 cursor-pointer transition-colors ${colorClasses}`}
      onClick={onClick}
    />
  );
};

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  showCount?: boolean;
  reviewCount?: number;
  variant?: StarVariant;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  totalStars = 5, 
  showCount = false, 
  reviewCount = 0, 
  variant = 'default' 
}) => {
  const textColor = variant === 'new' ? 'text-[#666666]' : 'text-gray-600';
  
  return (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-0.5">
        {[...Array(totalStars)].map((_, index) => (
          <StarIcon key={index} filled={index < rating} variant={variant} />
        ))}
      </div>
      <span className={`text-sm ${textColor} mr-2`}>({rating})</span>
      {showCount && <span className={`text-sm ${textColor}`}>• {reviewCount} تقييم</span>}
    </div>
  );
};

interface SimpleStarRatingProps {
  rating: number;
  totalStars?: number;
  variant?: StarVariant;
}

const SimpleStarRating: React.FC<SimpleStarRatingProps> = ({ 
  rating, 
  totalStars = 5, 
  variant = 'default' 
}) => {
  const colorClasses = variant === 'new' 
    ? 'text-[#5CA9B5] fill-current' 
    : 'text-yellow-400 fill-current';
  const emptyColorClasses = variant === 'new' 
    ? 'text-[#95EDD8]' 
    : 'text-gray-300';
  
  return (
    <div className="flex space-x-0.5">
      {[...Array(totalStars)].map((_, index) => (
        <Star 
          key={index} 
          className={`w-3 h-3 ${index < rating ? colorClasses : emptyColorClasses}`} 
        />
      ))}
    </div>
  );
};

export { StarRating, SimpleStarRating, StarIcon };
