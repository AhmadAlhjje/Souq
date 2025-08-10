import React from 'react';

interface CountrySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-16 sm:w-20 px-1 py-2 sm:px-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-center bg-gray-50 text-xs sm:text-sm"
      >
        <option value="+963">+963</option>
        <option value="+1">+1</option>
        <option value="+44">+44</option>
        <option value="+971">+971</option>
      </select>
    </div>
  );
};

export default CountrySelect;