// components/molecules/PasswordField.tsx
"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';
import { useTranslation } from 'react-i18next';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  placeholder
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="mb-3 sm:mb-4">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || t('passwordField.placeholder')}
          value={value}
          onChange={onChange}
          icon={Lock}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className={`
            absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 
            text-gray-400 hover:text-gray-600 transition-colors
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        >
          {showPassword ? (
            <EyeOff size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <Eye size={16} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;