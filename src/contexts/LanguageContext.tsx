"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { changeLanguage as i18nChangeLanguage, getCurrentLanguageInfo } from '../i18n';

// دوال كوكيز
function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  if (typeof window === "undefined") return "";
  return document.cookie.split('; ').reduce((res, cookie) => {
    const [key, val] = cookie.split('=');
    return key === name ? decodeURIComponent(val) : res;
  }, '');
}

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  setLanguage: (lang: string) => void;
  currentLanguage: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('ar');
  const [currentLanguage, setCurrentLanguage] = useState(() => getCurrentLanguageInfo());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = getCookie('language') || 'ar';
      setLanguageState(savedLanguage);
      i18nChangeLanguage(savedLanguage);
      setCurrentLanguage(getCurrentLanguageInfo());
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (typeof window !== 'undefined') {
      setCookie('language', lang);
    }
    setLanguageState(lang);
    i18nChangeLanguage(lang);
    setTimeout(() => setCurrentLanguage(getCurrentLanguageInfo()), 100);
  };

  const value: LanguageContextType = {
    language,
    isRTL: currentLanguage.isRTL,
    setLanguage,
    currentLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
