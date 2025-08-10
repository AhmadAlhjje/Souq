import React from 'react';
import Input from '../../components/atoms/Input';
import Label from '../../components/atoms/Label';

const InputField = ({ label, type, placeholder, value, onChange, icon }) => {
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