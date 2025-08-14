// components/molecules/PhoneField.tsx
"use client";
import React from 'react';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';
import CountrySelect from '../../components/atoms/CountrySelect';
import { useTranslation } from 'react-i18next';

interface PhoneFieldProps {
  label: string;
  countryCode: string;
  setCountryCode: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ 
  label, 
  countryCode, 
  setCountryCode, 
  phoneNumber, 
  setPhoneNumber,
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
      <div className="flex gap-2">
        <Input
          type="tel"
          placeholder={t('phoneField.placeholder')}
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          className="flex-1"
          disabled={disabled}
          required={required}
        />
        <CountrySelect 
          value={countryCode} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default PhoneField;