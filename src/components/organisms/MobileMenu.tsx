import React from 'react';
import { Globe, Sun, Moon, Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import NavLink from "../atoms/NavLink";
import ActionButtons from "../molecules/ActionButtons";
import useTheme from "../../hooks/useTheme";

// تكوين اللغات المتاحة
const AVAILABLE_LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void; // إضافة دالة الإغلاق
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, isDark } = useTheme();

  // تغيير اللغة مع التخزين والإغلاق
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("lang", langCode);
    // إغلاق القائمة بعد تأخير قصير للسماح بتطبيق التغيير
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // تغيير الثيم مع الإغلاق
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    // إغلاق القائمة بعد تأخير قصير للسماح بتطبيق التغيير
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // الحصول على اللغة الحالية
  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  // إعدادات الثيم
  const themeOptions = [
    { key: 'light', name: t('light_mode') || 'Light', icon: Sun },
    { key: 'dark', name: t('dark_mode') || 'Dark', icon: Moon },
    // { key: 'system', name: t('system_mode') || 'System', icon: Monitor },
  ];

  const currentThemeOption = themeOptions.find(opt => opt.key === theme) || themeOptions[0];
  const ThemeIcon = currentThemeOption.icon;

  if (!isOpen) return null;

  return (
    <div className={`lg:hidden backdrop-blur-sm border-t transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/95 border-slate-700/20' 
        : 'bg-white/95 border-white/20'
    }`}>
      <div className="px-4 py-6 space-y-6">
        {/* Navigation Links */}
        <div className="flex flex-col space-y-1">
          <div onClick={onClose}>
            <NavLink href="/" className="block py-3 px-4">{t("home")}</NavLink>
          </div>
          <div onClick={onClose}>
            <NavLink href="/about" className="block py-3 px-4">{t("about")}</NavLink>
          </div>
          <div onClick={onClose}>
            <NavLink href="/Stores" className="block py-3 px-4">{t("stores")}</NavLink>
          </div>
          <div onClick={onClose}>
            <NavLink href="/contact" className="block py-3 px-4">{t("contact")}</NavLink>
          </div>
        </div>
        
        {/* Theme & Language Selectors */}
        <div className={`pt-4 border-t transition-colors duration-300 ${
          isDark ? 'border-slate-700' : 'border-gray-200'
        }`}>
          {/* Theme Selector */}
          <div className="mb-4">
            <div className={`font-medium mb-2 flex items-center gap-2 transition-colors duration-300 ${
              isDark ? 'text-emerald-300' : 'text-[#004D5A]'
            }`}>
              <ThemeIcon className="w-4 h-4" />
              {t("theme") || "Theme"}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = theme === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleThemeChange(option.key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? isDark 
                          ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300 font-medium' 
                          : 'bg-[#96EDD9]/20 border-[#004D5A] text-[#004D5A] font-medium'
                        : isDark 
                          ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs">{option.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="mb-4">
            <div className={`font-medium mb-2 flex items-center gap-2 transition-colors duration-300 ${
              isDark ? 'text-emerald-300' : 'text-[#004D5A]'
            }`}>
              <Globe className="w-4 h-4" />
              {t("language") || "Language"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_LANGUAGES.map((language) => {
                const isSelected = currentLanguage.code === language.code;
                return (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? isDark 
                          ? 'bg-emerald-900/50 border-emerald-600 text-emerald-300 font-medium' 
                          : 'bg-[#96EDD9]/20 border-[#004D5A] text-[#004D5A] font-medium'
                        : isDark 
                          ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    dir={language.code === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div onClick={onClose}>
            <ActionButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;