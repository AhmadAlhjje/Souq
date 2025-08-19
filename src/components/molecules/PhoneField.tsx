"use client";
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import Label from '../../components/atoms/Label';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';

interface PhoneFieldProps {
  label: string;
  value: string; // القيمة الكاملة لرقم الهاتف مع رمز البلد
  onChange: (value: string | undefined) => void;
  required?: boolean;
  disabled?: boolean;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ 
  label, 
  value,
  onChange,
  required = false,
  disabled = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-3 sm:mb-4">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="SY" // سوريا كافتراضي
        value={value}
        onChange={onChange}
        placeholder="أدخل رقم الهاتف"
        disabled={disabled}
        className={`
          phone-input
          ${disabled ? 'phone-input-disabled' : ''}
        `}
        numberInputProps={{
          className: `
            flex-1 px-3 py-2 sm:px-4 sm:py-3 
            border-0 outline-none
            text-sm sm:text-base
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-transparent text-gray-900'
            }
          `
        }}
        countrySelectProps={{
          className: `
            px-2 py-2 sm:px-3 sm:py-3
            border-0 outline-none
            text-sm sm:text-base
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-transparent text-gray-900 cursor-pointer'
            }
          `
        }}
      />
      
      {/* إضافة CSS مخصص */}
      <style jsx>{`
        :global(.phone-input) {
          display: flex;
          align-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background-color: #f9fafb;
          transition: all 0.2s;
        }
        
        :global(.phone-input:focus-within) {
          outline: 2px solid #14b8a6;
          outline-offset: 2px;
          border-color: #14b8a6;
        }
        
        :global(.phone-input:hover:not(.phone-input-disabled)) {
          border-color: #d1d5db;
        }
        
        :global(.phone-input-disabled) {
          background-color: #f3f4f6;
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        :global(.PhoneInputCountrySelect) {
          border: none !important;
          background: transparent !important;
          outline: none !important;
        }
        
        :global(.PhoneInputInput) {
          border: none !important;
          outline: none !important;
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default PhoneField;