import React from 'react';
import { LucideIcon } from 'lucide-react';
import { COLORS } from '../../constants/colors';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  theme?: 'light' | 'dark';
}

const Input: React.FC<InputProps> = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  className = "",
  disabled = false,
  required = false,
  theme = 'light'
}) => {
  const colors = COLORS[theme];
  
  return (
    <div className="relative">
      {Icon && (
        <Icon 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" 
          style={{ color: colors.text.muted }}
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 sm:px-4 sm:py-3 
          ${Icon ? 'pr-10 sm:pr-12' : ''} 
          border-2 rounded-lg 
          focus:outline-none focus:ring-2 focus:border-transparent 
          text-right text-xs sm:text-sm
          transition-all duration-300
          ${disabled 
            ? 'cursor-not-allowed opacity-60' 
            : 'hover:border-opacity-80'
          }
          ${className}
        `}
        style={{ 
          backgroundColor: disabled ? colors.background.muted : colors.background.primary,
          borderColor: colors.border.light,
          color: disabled ? colors.text.muted : colors.text.primary,
          direction: 'rtl'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = colors.accent;
            e.target.style.boxShadow = `0 0 0 3px ${colors.accent}20`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border.light;
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};

export default Input;