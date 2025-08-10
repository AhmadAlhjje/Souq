"use client";
import React, { useState, useEffect } from "react";
import NavLink from "../atoms/NavLink";
import ActionButtons from "../molecules/ActionButtons";
import { ShoppingCart, Menu, X, ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../i18n";

// تكوين اللغات المتاحة
const AVAILABLE_LANGUAGES = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  // يمكن إضافة المزيد من اللغات هنا
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // تحميل اللغة المحفوظة
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "ar";
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  // إغلاق dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-selector')) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  // تغيير اللغة مع التخزين
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("lang", langCode);
    setIsLanguageDropdownOpen(false);
  };

  // الحصول على اللغة الحالية
  const currentLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === i18n.language) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <nav className="bg-gradient-to-l from-[#96EDD9] via-[#A8F0DC] to-[#96EDD9] shadow-lg backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* الشعار */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#004D5A] to-[#006B7A] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">ت</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[#004D5A] font-bold text-xl leading-tight">
                      {t("brand_name")}
                    </div>
                    <div className="text-[#004D5A]/70 text-xs font-medium">
                      {t("brand_sub")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* روابط القائمة */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-8">
              <NavLink href="/" className="nav-link-enhanced">{t("home")}</NavLink>
              <NavLink href="/about" className="nav-link-enhanced">{t("about")}</NavLink>
              <NavLink href="/Stores" className="nav-link-enhanced">{t("stores")}</NavLink>
              <NavLink href="/contact" className="nav-link-enhanced">{t("contact")}</NavLink>
            </div>

            {/* أزرار الأكشن */}
            <div className="flex items-center space-x-reverse space-x-4">
              
              {/* زر السلة */}
              <button className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200 group shadow-sm">
                <ShoppingCart className="w-5 h-5 text-[#004D5A]" />
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30 hover:bg-white/40 transition-all duration-200 text-[#004D5A] font-medium shadow-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">{currentLanguage.name}</span>
                  <span className="sm:hidden text-sm">{currentLanguage.code.toUpperCase()}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isLanguageDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[140px] py-1 z-50">
                    {AVAILABLE_LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          currentLanguage.code === language.code ? 'bg-[#96EDD9]/20 text-[#004D5A] font-medium' : 'text-gray-700'
                        }`}
                        dir={language.code === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="flex-1">{language.name}</span>
                        {currentLanguage.code === language.code && (
                          <div className="w-2 h-2 rounded-full bg-[#004D5A]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* أزرار أخرى */}
              <div className="hidden lg:block">
                <ActionButtons />
              </div>

              {/* زر القائمة في الموبايل */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-[#004D5A]" /> : <Menu className="w-6 h-6 text-[#004D5A]" />}
              </button>
            </div>
          </div>
        </div>

        {/* القائمة في الموبايل */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-white/20">
            <div className="px-4 py-6 space-y-6">
              <div className="flex flex-col space-y-1">
                <NavLink href="/" className="block py-3 px-4">{t("home")}</NavLink>
                <NavLink href="/about" className="block py-3 px-4">{t("about")}</NavLink>
                <NavLink href="/Stores" className="block py-3 px-4">{t("stores")}</NavLink>
                <NavLink href="/contact" className="block py-3 px-4">{t("contact")}</NavLink>
              </div>
              
              {/* Language Selector في الموبايل */}
              <div className="pt-4 border-t border-gray-200">
                <div className="mb-4">
                  <div className="text-[#004D5A] font-medium mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {t("language") || "Language"}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_LANGUAGES.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          currentLanguage.code === language.code 
                            ? 'bg-[#96EDD9]/20 border-[#004D5A] text-[#004D5A] font-medium' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        dir={language.code === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <ActionButtons />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;