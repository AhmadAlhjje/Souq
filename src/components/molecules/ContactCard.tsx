import React from 'react';
import Icon, { IconProps } from '../atoms/Icon';

// ✅ استخدم نوع مطابق لـ IconProps['name']
type IconName = IconProps['name'];

interface ContactCardProps {
  title: string;
  description: string;
  icon: IconName;
}

const ContactCard: React.FC<ContactCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-teal-800 p-6 rounded-xl shadow-lg text-white text-center transition-transform hover:scale-105">
      {/* الأيقونة البيضاء */}
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-900 text-white mb-4">
        <Icon name={icon} size="lg" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-teal-100 text-sm">{description}</p>
    </div>
  );
};

export default ContactCard;