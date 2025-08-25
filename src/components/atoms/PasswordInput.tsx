import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  showToggle?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = "كلمة المرور",
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  showToggle = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 sm:px-4 sm:py-3 
          ${showToggle ? 'pl-10 sm:pl-12' : ''} 
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
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;