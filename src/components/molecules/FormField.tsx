import React from 'react';
import { LucideIcon } from 'lucide-react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  error?: string;
  helperText?: string;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  id,
  icon,
  disabled = false,
  required = false,
  className = "",
  theme = 'light',
  error,
  helperText
}) => (
  <div className={`${className}`}>
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-red-500 mr-1">*</span>}
    </Label>
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={icon}
      disabled={disabled}
      required={required}
      theme={theme}
      className={error ? 'border-red-500 focus:border-red-500' : 'border-teal-800 focus:border-teal-800'}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500 text-right">{error}</p>
    )}
    {helperText && !error && (
      <p className="mt-1 text-xs text-gray-500 text-right">{helperText}</p>
    )}
  </div>
);

export default FormField;