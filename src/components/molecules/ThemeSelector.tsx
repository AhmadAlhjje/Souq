import React, { useState, useEffect } from 'react';
import { ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";

const ThemeSelector: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();

  // إغلاق dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.theme-selector')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // إعدادات الثيم
  const themeOptions = [
    { key: 'light', name: t('light_mode') || 'Light', icon: Sun },
    { key: 'dark', name: t('dark_mode') || 'Dark', icon: Moon },
    // { key: 'system', name: t('system_mode') || 'System', icon: Monitor },
  ];

  const currentThemeOption = themeOptions.find(opt => opt.key === theme) || themeOptions[0];
  const ThemeIcon = currentThemeOption.icon;

  return (
    <div className="relative theme-selector">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${
          isDark 
            ? 'bg-slate-700/50 hover:bg-slate-600/50 text-emerald-300' 
            : 'bg-white/30 hover:bg-white/40 text-[#004D5A]'
        }`}
      >
        <ThemeIcon className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{currentThemeOption.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute top-full mt-2 right-0 rounded-lg shadow-lg border min-w-[140px] py-1 z-50 transition-all duration-200 ${
          isDark 
            ? 'bg-slate-800 border-slate-600' 
            : 'bg-white border-gray-100'
        }`}>
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = theme === option.key;
            return (
              <button
                key={option.key}
                onClick={() => {
                  setTheme(option.key as any);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-right px-4 py-2 text-sm transition-colors flex items-center gap-3 ${
                  isDark
                    ? `hover:bg-slate-700 ${isSelected ? 'bg-emerald-900/50 text-emerald-300 font-medium' : 'text-slate-300'}`
                    : `hover:bg-gray-50 ${isSelected ? 'bg-[#96EDD9]/20 text-[#004D5A] font-medium' : 'text-gray-700'}`
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="flex-1">{option.name}</span>
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

export default ThemeSelector;