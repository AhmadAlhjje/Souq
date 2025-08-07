"use client";
// components/organisms/Header.tsx
import React, { useState } from "react";
import NavLink from "../atoms/NavLink";
import ActionButtons from "../molecules/ActionButtons";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navigation */}
      <nav className="bg-gradient-to-l from-[#96EDD9] via-[#A8F0DC] to-[#96EDD9] shadow-lg backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Action Buttons - Left Side (مبدلة) */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="hidden sm:block">
                <ActionButtons />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                aria-label="قائمة التنقل"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-5 h-0.5 bg-[#004D5A] transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-[#004D5A] mt-1 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-5 h-0.5 bg-[#004D5A] mt-1 transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links - Center */}
            <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
              <NavLink href="/">الرئيسية</NavLink>
              <NavLink href="/about">من نحن</NavLink>
              <NavLink href="/stores">المتاجر</NavLink>
              <NavLink href="/blog">المدونة</NavLink>
              <NavLink href="/cart" className="relative">
                السلة
                {/* Cart Badge */}
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </NavLink>
            </div>

            {/* Logo/Brand - Right Side (مبدلة) */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-8 h-8 bg-[#004D5A] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TMC</span>
                  </div>
                  <span className="text-[#004D5A] font-bold text-xl hidden sm:block">
                    التجارة الرقمية
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white/95 backdrop-blur-sm border-t border-white/20`}
        >
          <div className="px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-4 text-center">
              <NavLink
                href="/"
                className="block py-3 hover:bg-white/50 rounded-lg"
              >
                الرئيسية
              </NavLink>
              <NavLink
                href="/about"
                className="block py-3 hover:bg-white/50 rounded-lg"
              >
                من نحن
              </NavLink>
              <NavLink
                href="/stores"
                className="block py-3 hover:bg-white/50 rounded-lg"
              >
                المتاجر
              </NavLink>
              <NavLink
                href="/blog"
                className="block py-3 hover:bg-white/50 rounded-lg"
              >
                المدونة
              </NavLink>
              <NavLink
                href="/cart"
                className="block py-3 hover:bg-white/50 rounded-lg relative"
              >
                السلة
                <span className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </NavLink>
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-white/30">
              <ActionButtons />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
