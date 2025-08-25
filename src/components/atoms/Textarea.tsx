// src/components/atoms/Textarea.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  rightIcon?: LucideIcon;
  required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  className = '',
  disabled = false,
  rightIcon: RightIcon,
  required = false
}) => {
  const baseClasses = `
    w-full px-4 py-4 bg-white/70 dark:bg-slate-700/70 border-2 rounded-xl 
    focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-none
    text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
    border-gray-200 dark:border-slate-600
  `;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className={`${baseClasses} ${className}`}
      />
      {RightIcon && (
        <RightIcon className="absolute left-4 top-4 w-5 h-5 text-green-500" />
      )}
    </div>
  );
};

export default Textarea;