import React from 'react';
import Icon, { IconProps } from '../atoms/Icon';
import useTheme from "@/hooks/useTheme";

// ✅ استخدم نوع مطابق لـ IconProps['name']
type IconName = IconProps['name'];

interface ContactCardProps {
  title: string;
  description: string;
  icon: IconName;
}

const ContactCard: React.FC<ContactCardProps> = ({ title, description, icon }) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:scale-105 ${
      isDark 
        ? 'bg-white/5 text-slate-100 shadow-slate-900/20 hover:shadow-slate-900/30' 
        : 'bg-teal-800 text-white shadow-teal-800/20'
    }`}>
      {/* الأيقونة */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 transition-colors duration-300 ${
        isDark 
          ? 'bg-emerald-600 text-white' 
          : 'bg-teal-900 text-white'
      }`}>
        <Icon name={icon} size="lg" />
      </div>
      
      <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
        isDark ? 'text-emerald-300' : 'text-white'
      }`}>
        {title}
      </h3>
      
      <p className={`text-sm transition-colors duration-300 ${
        isDark ? 'text-slate-300' : 'text-teal-100'
      }`}>
        {description}
      </p>
    </div>
  );
};

export default ContactCard;