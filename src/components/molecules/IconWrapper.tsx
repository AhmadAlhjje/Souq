
// molecules/IconWrapper.tsx - مكون جديد تماماً لدعم الكود الأصلي
import React from 'react';

export interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string;
  size?: 'small' | 'medium' | 'large';
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  gradient = "from-[#5CA9B5] to-[#4a9aa7]",
  size = "medium"
}) => {
  const sizes: Record<string, string> = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizes[size]} bg-gradient-to-br ml-4 ${gradient} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}>
      <div className="text-white text-base text-right">{icon}</div>
    </div>
  );
};

export default IconWrapper;
