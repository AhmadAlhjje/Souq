"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";

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
  const { isDark } = useTheme();

  // تحميل اللغة المحفوظة - فقط في العميل
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedLang = localStorage.getItem("lang") || "ar";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  // دالة تبديل حالة القائمة
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // دالة إغلاق القائمة
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // إغلاق القائمة عند النقر خارجها (اختياري)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.querySelector('[data-mobile-menu]');
      const menuButton = document.querySelector('[data-menu-button]');
      
      if (isMobileMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(target) &&
          menuButton &&
          !menuButton.contains(target)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // منع التمرير عند فتح القائمة
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // إغلاق القائمة عند تغيير حجم الشاشة إلى حجم كبير
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            <div onClick={closeMobileMenu}>
              <Logo />
            </div>

            {/* Navigation Menu - Desktop */}
            <NavigationMenu />

            {/* Action Buttons */}
            <div className="flex items-center space-x-reverse space-x-4">
              
              {/* Shopping Cart */}
              <div onClick={closeMobileMenu}>
                <ShoppingCartButton />
              </div>

              {/* Theme Selector */}
              <ThemeSelector />

              {/* Language Selector */}
              <LanguageSelector />

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:block">
                <ActionButtons />
              </div>

              {/* Mobile Menu Button */}
              <div data-menu-button>
                <MobileMenuButton 
                  isOpen={isMobileMenuOpen} 
                  onToggle={toggleMobileMenu} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div data-mobile-menu>
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={closeMobileMenu}
          />
        </div>
      </nav>

      {/* Overlay للشاشات الصغيرة */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
          style={{ zIndex: -1 }}
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;