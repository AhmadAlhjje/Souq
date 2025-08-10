import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from "./locales/ar.json";
import en from "./locales/en.json";
// إضافة المزيد من اللغات هنا عند الحاجة
// import fr from "./locales/fr.json";
// import es from "./locales/es.json";

// تكوين اللغات المتاحة
export const SUPPORTED_LANGUAGES = {
  ar: { translation: ar },
  en: { translation: en },
  // fr: { translation: fr },
  // es: { translation: es },
} as const;

// أسماء اللغات للعرض
export const LANGUAGE_NAMES = {
  ar: 'العربية',
  en: 'English',
  // fr: 'Français',
  // es: 'Español',
} as const;

// الأعلام للغات
export const LANGUAGE_FLAGS = {
  ar: '🇸🇦',
  en: '🇺🇸',
  // fr: '🇫🇷',
  // es: '🇪🇸',
} as const;

i18n
  .use(LanguageDetector) // اكتشاف اللغة تلقائياً
  .use(initReactI18next)
  .init({
    resources: SUPPORTED_LANGUAGES,
    
    // اللغة الافتراضية
    lng: "ar",
    fallbackLng: "en",
    
    // خيارات اكتشاف اللغة
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false
    },
    
    // تمكين namespace إذا كنت تريد تنظيم الترجمات
    defaultNS: 'translation',
    ns: ['translation'],
    
    // خيارات إضافية لتحسين الأداء
    react: {
      useSuspense: false
    },
    
    // تمكين debug في development
    debug: process.env.NODE_ENV === 'development',
  });

// دالة مساعدة لتغيير اللغة مع حفظها
export const changeLanguage = (langCode: string) => {
  i18n.changeLanguage(langCode);
  localStorage.setItem('lang', langCode);
  // تحديث dir في document
  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;
};

// دالة للحصول على معلومات اللغة الحالية
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language;
  return {
    code: currentLang,
    name: LANGUAGE_NAMES[currentLang as keyof typeof LANGUAGE_NAMES],
    flag: LANGUAGE_FLAGS[currentLang as keyof typeof LANGUAGE_FLAGS],
    isRTL: currentLang === 'ar'
  };
};

// دالة للحصول على جميع اللغات المتاحة
export const getAvailableLanguages = () => {
  return Object.keys(SUPPORTED_LANGUAGES).map(code => ({
    code,
    name: LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES],
    flag: LANGUAGE_FLAGS[code as keyof typeof LANGUAGE_FLAGS],
    isRTL: code === 'ar'
  }));
};

export default i18n;