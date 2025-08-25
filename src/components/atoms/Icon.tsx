import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaSearch,
  FaHeart,
  FaShare,
  FaShoppingCart,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaShieldAlt,
  FaCreditCard,
  FaTruck,
  FaHeadphones,
  FaChevronRight,
  FaPercent,
  FaEnvelope,
  FaMobile,
  FaRocket,
  FaBolt,
  FaGlobe
} from 'react-icons/fa';

export interface IconProps {
  name:
    | 'search'
    | 'facebook'
    | 'twitter'
    | 'linkedin'
    | 'instagram'
    | 'heart'
    | 'share'
    | 'cart'
    | 'star'
    | 'location'
    | 'clock'
    | 'users'
    | 'shield'
    | 'credit-card'
    | 'truck'
    | 'headphones'
    | 'chevron-right'
    | 'percent'
    | 'envelope'
    | 'phone'
    | 'rocket'   // ✅ جديد
    | 'bolt'     // ✅ جديد
    | 'globe';   // ✅ جديد

  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size = 'md',
  color
}) => {
  const iconMap = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    search: FaSearch,
    heart: FaHeart,
    share: FaShare,
    cart: FaShoppingCart,
    star: FaStar,
    location: FaMapMarkerAlt,
    clock: FaClock,
    users: FaUsers,
    shield: FaShieldAlt,
    'credit-card': FaCreditCard,
    truck: FaTruck,
    headphones: FaHeadphones,
    'chevron-right': FaChevronRight,
    percent: FaPercent,
    phone: FaMobile,
    envelope: FaEnvelope,
    rocket: FaRocket,   // ✅ جديد
    bolt: FaBolt,       // ✅ جديد
    globe: FaGlobe      // ✅ جديد
  };

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.error(`Icon not found for name: ${name}`);
    return null;
  }

  return (
    <IconComponent
      className={`${sizes[size]} ${className}`}
      style={{ color: color }}
      aria-label={name}
    />
  );
};

export default Icon;
