import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const { t, i18n } = useTranslation('');
  const isRTL = i18n.language === 'ar';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
      <input
        type="search"
        placeholder={placeholder || t('placeholder')}
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        className={`
          w-full py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-[#5CA9B5] focus:border-transparent 
          transition-colors
          ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'}
        `}
      />
    </div>
  );
};

export default SearchBox;