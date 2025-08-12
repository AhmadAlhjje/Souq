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
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="mb-3 sm:mb-4">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t('passwordField.placeholder')}
          value={value}
          onChange={onChange}
          icon={Lock}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
