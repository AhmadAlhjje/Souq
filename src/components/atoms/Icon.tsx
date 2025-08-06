// components/atoms/Icon.tsx
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

interface IconProps {
  name: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const iconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.error(`Icon not found for name: ${name}`);
    return null; // أو يمكنك عرض أيقونة افتراضية
  }

  return (
    <IconComponent
      className={`w-6 h-6 text-white ${className}`}
      aria-label={name}
    />
  );
};

export default Icon;