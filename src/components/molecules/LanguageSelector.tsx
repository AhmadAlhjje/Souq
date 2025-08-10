import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";

// تكوين اللغات المتاحة
const AVAILABLE_LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  // يمكن إضافة المزيد من اللغات هنا
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const LanguageSelector: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  // إغلاق dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-selector')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // تغيير اللغة مع التخزين
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("lang", langCode);
    setIsDropdownOpen(false);
  };

  // الحصول على اللغة الحالية
  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="relative language-selector">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${
          isDark 
            ? 'bg-slate-700/50 hover:bg-slate-600/50 text-emerald-300' 
            : 'bg-white/30 hover:bg-white/40 text-[#004D5A]'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
        <span className="sm:hidden text-sm">{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute top-full mt-2 right-0 rounded-lg shadow-lg border min-w-[140px] py-1 z-50 transition-all duration-200 ${
          isDark 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-gray-100'
        }`}>
          {AVAILABLE_LANGUAGES.map((language) => {
            const isSelected = currentLanguage.code === language.code;
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-right px-4 py-2 text-sm transition-colors flex items-center gap-3 ${
                  isDark
                    ? `hover:bg-slate-700 ${isSelected ? 'bg-emerald-900/50 text-emerald-300 font-medium' : 'text-slate-300'}`
                    : `hover:bg-gray-50 ${isSelected ? 'bg-[#96EDD9]/20 text-[#004D5A] font-medium' : 'text-gray-700'}`
                }`}
                dir={language.code === 'ar' ? 'rtl' : 'ltr'}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {isSelected && (
                  <div className={`w-2 h-2 rounded-full ${
                    isDark ? 'bg-emerald-400' : 'bg-[#004D5A]'
                  }`}></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;