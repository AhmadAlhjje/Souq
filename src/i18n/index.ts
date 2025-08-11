import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// استيراد ملفات الترجمة
import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

// دوال بسيطة للكوكيز
function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((res, cookie) => {
    const [key, val] = cookie.split('=');
    return key === name ? decodeURIComponent(val) : res;
  }, '');
}

// دالة للحصول على اللغة الابتدائية من الكوكيز أو الافتراضية 'ar'
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return getCookie('language') || 'ar';
  }
  return 'ar';
};

const resources = {
  ar: { translation: arTranslation },
  en: { translation: enTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'ar',
    detection: {
      order: ['cookie', 'navigator'], // تحقق أولاً من الكوكيز ثم المتصفح
      caches: ['cookie'],             // خزّن اللغة في الكوكيز
      lookupCookie: 'language',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // لمنع مشاكل SSR
    },
  });

const languageConfig = {
  ar: { code: 'ar', name: 'العربية', isRTL: true },
  en: { code: 'en', name: 'English', isRTL: false },
};

// دالة تغيير اللغة مع تخزينها في الكوكيز
export const changeLanguage = (langCode: string) => {
  if (typeof window !== 'undefined') {
    setCookie('language', langCode);
  }
  return i18n.changeLanguage(langCode);
};

// جلب معلومات اللغة الحالية
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language || getInitialLanguage();
  return languageConfig[currentLang as keyof typeof languageConfig] || languageConfig.ar;
};

// اللغات المتاحة
export const getAvailableLanguages = () => Object.values(languageConfig);

export default i18n;
