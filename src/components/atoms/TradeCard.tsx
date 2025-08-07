// components/atoms/TradeCard.tsx
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

interface TradeCardProps {
  iconName: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  label: string;
  className?: string;
}

export default function TradeCard({ iconName, label, className = '' }: TradeCardProps) {
  const icons = {
    facebook: <FaFacebook className="text-2xl" />,
    twitter: <FaTwitter className="text-2xl" />,
    linkedin: <FaLinkedin className="text-2xl" />,
    instagram: <FaInstagram className="text-2xl" />
  };

  const defaultStyles = "flex flex-col items-center justify-center p-6 min-w-[120px] rounded-2xl shadow-lg border border-white/20 text-white transition-all duration-300 hover:transform hover:scale-105";

  return (
    <div className={`${defaultStyles} ${className}`}>
      <div className="mb-3">
        {icons[iconName]}
      </div>
      <span className="text-sm font-medium text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}