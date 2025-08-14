// components/atoms/Input.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  className = "",
  disabled = false,
  required = false
}) => {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
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
          border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent 
          text-right text-sm sm:text-base
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' 
            : 'bg-white text-gray-900 hover:border-gray-300'
          }
          ${className}
        `}
      />
    </div>
  );
};

export default Input;