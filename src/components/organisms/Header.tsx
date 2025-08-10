"use client";
// components/organisms/Header.tsx
import React, { useState } from "react";
import NavLink from "../atoms/NavLink";
import ActionButtons from "../molecules/ActionButtons";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" dir="rtl">
      {/* Main Navigation */}
      <nav className="bg-gradient-to-l from-[#96EDD9] via-[#A8F0DC] to-[#96EDD9] shadow-lg backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo/Brand - Right Side (للعربية) */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#004D5A] to-[#006B7A] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">ت</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[#004D5A] font-bold text-xl leading-tight">
                      التجارة الرقمية
                    </div>
                    <div className="text-[#004D5A]/70 text-xs font-medium">
                      TMC Store
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden lg:flex items-center space-x-reverse space-x-8">
              <NavLink href="/" className="nav-link-enhanced">
                الرئيسية
              </NavLink>
              <NavLink href="/about" className="nav-link-enhanced">
                من نحن
              </NavLink>
              <NavLink href="/Stores" className="nav-link-enhanced">
                المتاجر
              </NavLink>
              <NavLink href="/contact" className="nav-link-enhanced">
                تواصل معنا
              </NavLink>
            </div>

            {/* Action Section - Left Side */}
            <div className="flex items-center space-x-reverse space-x-6">
              {/* Cart Button - منفصلة ومبعدة */}
              <button className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-200 group shadow-sm">
                <ShoppingCart className="w-5 h-5 text-[#004D5A] group-hover:scale-105 transition-transform" />
                {/* Badge ثابت بدون تأثيرات */}
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Action Buttons - Desktop مع مسافة أكبر */}
              <div className="hidden lg:block mr-4">
                <ActionButtons />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
                aria-label="قائمة التنقل"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#004D5A]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#004D5A]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white/95 backdrop-blur-sm border-t border-white/20`}
        >
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1">
              <NavLink
                href="/"
                className="block py-3 px-4 hover:bg-white/50 rounded-xl transition-colors font-medium text-[#004D5A]"
              >
                🏠 الرئيسية
              </NavLink>
              <NavLink
                href="/about"
                className="block py-3 px-4 hover:bg-white/50 rounded-xl transition-colors font-medium text-[#004D5A]"
              >
                ℹ️ من نحن
              </NavLink>
              <NavLink
                href="/Stores"
                className="block py-3 px-4 hover:bg-white/50 rounded-xl transition-colors font-medium text-[#004D5A]"
              >
                🏪 المتاجر
              </NavLink>
              <NavLink
                href="/contact"
                className="block py-3 px-4 hover:bg-white/50 rounded-xl transition-colors font-medium text-[#004D5A]"
              >
                📞 تواصل معنا
              </NavLink>
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <ActionButtons />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
