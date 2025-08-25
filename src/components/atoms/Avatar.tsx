import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials?: string;
  className?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 'md',
  initials,
  className = '',
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const baseClasses = `
    rounded-full border-2 border-teal-600 overflow-hidden 
    flex items-center justify-center
    ${onClick ? 'cursor-pointer hover:border-teal-700' : ''}
    ${sizeClasses[size]}
    ${className}
  `;

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (src) {
    return (
      <div className={baseClasses} onClick={handleClick}>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (initials) {
    return (
      <div 
        className={`${baseClasses} bg-teal-600 text-white font-bold`}
        onClick={handleClick}
      >
        {initials}
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} bg-gray-200 text-gray-500`}
      onClick={handleClick}
    >
      <User className={iconSizes[size]} />
    </div>
  );
};

export default Avatar;