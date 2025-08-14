// components/molecules/InputField.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon,
  required = false,
  disabled = false,
  className
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={icon}
        disabled={disabled}
        required={required}
        className={className}
      />
    </div>
  );
};

export default InputField;