import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from "./locales/ar.json";
import en from "./locales/en.json";

// تكوين اللغات المتاحة
export const SUPPORTED_LANGUAGES = {
  ar: { translation: ar },
  en: { translation: en },
} as const;

// أسماء اللغات للعرض
export const LANGUAGE_NAMES = {
  ar: 'العربية',
  en: 'English',
} as const;

// الأعلام للغات
export const LANGUAGE_FLAGS = {
  ar: '🇸🇦',
  en: '🇺🇸',
} as const;

// تحديد ما إذا كنا في بيئة المتصفح
const isBrowser = typeof window !== 'undefined';

// إعداد i18n
const i18nInstance = i18n.use(initReactI18next);

// إضافة LanguageDetector فقط في المتصفح
if (isBrowser) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  resources: SUPPORTED_LANGUAGES,
  
  // اللغة الافتراضية
  lng: "ar",
  fallbackLng: "ar",
  
  // خيارات اكتشاف اللغة - فقط في المتصفح
  ...(isBrowser && {
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  }),
  
  interpolation: {
    escapeValue: false
  },
  
  // تمكين namespace إذا كنت تريد تنظيم الترجمات
  defaultNS: 'translation',
  ns: ['translation'],
  
  // خيارات إضافية لتحسين الأداء
  react: {
    useSuspense: false // مهم جداً لمنع مشاكل SSR
  },
  
  // تعطيل debug في production
  debug: false,
});

// دالة مساعدة لتغيير اللغة مع حفظها - تعمل فقط في المتصفح
export const changeLanguage = (langCode: string) => {
  if (!isBrowser) return;
  
  i18n.changeLanguage(langCode);
  localStorage.setItem('lang', langCode);
  
  // تحديث dir في document
  document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;
};

// دالة للحصول على معلومات اللغة الحالية
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language || 'ar';
  return {
    code: currentLang,
    name: LANGUAGE_NAMES[currentLang as keyof typeof LANGUAGE_NAMES] || 'العربية',
    flag: LANGUAGE_FLAGS[currentLang as keyof typeof LANGUAGE_FLAGS] || '🇸🇦',
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