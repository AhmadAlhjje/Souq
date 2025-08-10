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
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type, 
  placeholder, 
  value, 
  onChange, 
  icon 
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      <Label>{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={icon}
      />
    </div>
  );
};

export default InputField;