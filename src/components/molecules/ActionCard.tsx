import React from 'react';
import Icon from '../atoms/Icon';

interface ActionCardProps {
  onClick: () => void;
  title: string;
  subtitle: string;
  iconName: 'chevron-right' | 'cart' | 'heart';
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  onClick,
  title,
  subtitle,
  iconName,
  className = ""
}) => {
  return (
    <div 
      className={`
        bg-[#BAF3E6] rounded-xl p-4 cursor-pointer 
        hover:bg-[#A0E6D3] hover:shadow-lg 
        transform hover:scale-[1.02] 
        transition-all duration-300 
        border border-[#BAF3E6] hover:border-[#006B7A]
        ${className}
      `}
      onClick={onClick}
      dir="rtl"
    >
      <div className="flex items-center justify-between text-[#004D5A]">
        {/* النص على اليمين */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-[#006B7A]/10 hover:bg-[#006B7A]/20 rounded-lg flex items-center justify-center transition-colors duration-300">
            <Icon name={iconName} size="md" className="text-[#006B7A]" />
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">{title}</div>
            <div className="text-sm opacity-75 font-medium mt-1">{subtitle}</div>
          </div>
        </div>
        
        {/* السهم على اليسار */}
        <div className="mr-3">
          <Icon 
            name="chevron-right" 
            size="sm" 
            className="text-[#006B7A] transform rotate-180" 
          />
        </div>
      </div>
    </div>
  );
};

export default ActionCard;