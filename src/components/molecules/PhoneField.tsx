import React from 'react';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';
import CountrySelect from '../../components/atoms/CountrySelect';

interface PhoneFieldProps {
  label: string;
  countryCode: string;
  setCountryCode: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ 
  label, 
  countryCode, 
  setCountryCode, 
  phoneNumber, 
  setPhoneNumber 
}) => {
  return (
    <div className="mb-3 sm:mb-4">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="tel"
          placeholder="أدخل رقم الجوال"
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          className="flex-1"
          // icon prop is optional in Input component, so we don't need to pass it
        />
        <CountrySelect 
          value={countryCode} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryCode(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default PhoneField;