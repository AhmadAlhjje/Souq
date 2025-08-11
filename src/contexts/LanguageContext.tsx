'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  isLTR: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLang] = useState<Language>('ar');

  useEffect(() => {
    const storedLang = localStorage.getItem('lang') as Language | null;
    if (storedLang) setLang(storedLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // خصائص مساعدة
  const isRTL = language === 'ar';
  const isLTR = language === 'en';

  return (
    <LanguageContext.Provider
      value={{ 
        language, 
        toggleLanguage, 
        setLanguage: setLang,
        isRTL,
        isLTR
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguageContext must be used within a LanguageProvider');
  return context;
};