import { useLanguageContext } from '@/contexts/LanguageContext';

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function useLanguage() {
  const context = useLanguageContext();

  const setArabic = () => {
    if (typeof window !== 'undefined') {
      setCookie('language', 'ar');
    }
    context.setLanguage('ar');
  };

  const setEnglish = () => {
    if (typeof window !== 'undefined') {
      setCookie('language', 'en');
    }
    context.setLanguage('en');
  };

  return {
    ...context,
    setArabic,
    setEnglish,
    isClient: typeof window !== 'undefined',
  };
}
