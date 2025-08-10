"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";
import ClientOnly from "../ClientOnly";

// Import Components
import Logo from "../atoms/Logo";
import NavigationMenu from "../molecules/NavigationMenu";
import ShoppingCartButton from "../atoms/ShoppingCartButton";
import ThemeSelector from "../molecules/ThemeSelector";
import LanguageSelector from "../molecules/LanguageSelector";
import ActionButtons from "../molecules/ActionButtons";
import MobileMenuButton from "../atoms/MobileMenuButton";
import MobileMenu from "../organisms/MobileMenu";

// Import i18n
import "../../i18n";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n } = useTranslation();
  const { isDark, isLoaded } = useTheme();

  // تحميل اللغة المحفوظة - فقط في العميل
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedLang = localStorage.getItem("lang") || "ar";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fallback للتحميل
  const LoadingFallback = () => (
    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <nav className={`shadow-lg backdrop-blur-sm border-b transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-l from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
          : 'bg-gradient-to-l from-[#96EDD9] via-[#A8F0DC] to-[#96EDD9] border-white/20'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Logo */}
            <Logo />

            {/* Navigation Menu - Desktop */}
            <NavigationMenu />

            {/* Action Buttons */}
            <div className="flex items-center space-x-reverse space-x-4">
              
              {/* Shopping Cart */}
              <ShoppingCartButton itemCount={3} />

              {/* Theme Selector - Client Only */}
              <ClientOnly fallback={<LoadingFallback />}>
                {isLoaded && <ThemeSelector />}
              </ClientOnly>

              {/* Language Selector - Client Only */}
              <ClientOnly fallback={<LoadingFallback />}>
                <LanguageSelector />
              </ClientOnly>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:block">
                <ActionButtons />
              </div>

              {/* Mobile Menu Button */}
              <MobileMenuButton 
                isOpen={isMobileMenuOpen} 
                onToggle={toggleMobileMenu} 
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu - Client Only */}
        <ClientOnly>
          <MobileMenu isOpen={isMobileMenuOpen} />
        </ClientOnly>
      </nav>
    </header>
  );
};

export default Header;