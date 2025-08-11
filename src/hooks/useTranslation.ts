"use client";
import { useTranslation as useI18nTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguageInfo, getAvailableLanguages } from "../i18n";
import { useEffect, useState } from "react";

// دوال الكوكيز (نفسها في i18n.ts)
function getCookie(name: string) {
  if (typeof window === "undefined") return "";
  return document.cookie.split('; ').reduce((res, cookie) => {
    const [key, val] = cookie.split('=');
    return key === name ? decodeURIComponent(val) : res;
  }, '');
}

const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedLanguage = getCookie('language') || 'ar';
      
      if (i18n.language !== savedLanguage) {
        i18n.changeLanguage(savedLanguage).then(() => {
          setIsInitialized(true);
        });
      } else {
        setIsInitialized(true);
      }
    }
  }, [i18n, isInitialized]);

  const handleChangeLanguage = (langCode: string) => {
    if (typeof window !== 'undefined') {
      document.cookie = `language=${langCode}; path=/; max-age=${60 * 60 * 24 * 365}`; // تخزين الكوكيز لمدة سنة
    }
    changeLanguage(langCode);
  };

  const currentLanguage = isInitialized ? getCurrentLanguageInfo() : {
    code: typeof window !== 'undefined' ? getCookie('language') || 'ar' : 'ar',
    name: typeof window !== 'undefined' && getCookie('language') === 'en' ? 'English' : 'العربية',
    isRTL: typeof window !== 'undefined' ? getCookie('language') !== 'en' : true,
  };

  const availableLanguages = getAvailableLanguages();

  return { 
    t, 
    changeLanguage: handleChangeLanguage,
    currentLanguage,
    availableLanguages,
    isRTL: currentLanguage.isRTL,
    language: i18n.language,
    setArabic: () => handleChangeLanguage('ar'),
    setEnglish: () => handleChangeLanguage('en'),
    isClient: typeof window !== 'undefined',
    isInitialized
  };
};

export default useTranslation;
