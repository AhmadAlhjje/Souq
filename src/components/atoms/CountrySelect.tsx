// components/atoms/CountrySelect.tsx
import React from 'react';

interface CountrySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-16 sm:w-20 px-1 py-2 sm:px-2 sm:py-3 
          border border-gray-200 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-teal-400 
          text-center text-xs sm:text-sm
          transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' 
            : 'bg-gray-50 text-gray-900 hover:border-gray-300 cursor-pointer'
          }
        `}
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