// src/components/molecules/TextareaField.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Textarea from '../atoms/Textarea';
import Label from '../atoms/Label';

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  className?: string;
  showCharacterCount?: boolean;
  minLength?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  required = false,
  className = '',
  showCharacterCount = false,
  minLength
}) => {
  return (
    <div className={`mb-3 sm:mb-4 ${className}`}>
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        rightIcon={value ? CheckCircle2 : undefined}
        required={required}
      />
      {showCharacterCount && maxLength && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>الحد الأدنى: {minLength || 10} أحرف</span>
          <span className={value.length > (maxLength * 0.83) ? 'text-orange-500' : ''}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextareaField;