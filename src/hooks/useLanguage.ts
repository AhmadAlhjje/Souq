import { useLanguageContext } from '@/contexts/LanguageContext';

export default function useLanguage() {
  const context = useLanguageContext();
  
  // دوال مساعدة إضافية
  const setArabic = () => context.setLanguage('ar');
  const setEnglish = () => context.setLanguage('en');
  
  return {
    ...context,
    // دوال سريعة
    setArabic,
    setEnglish,
    // حماية إضافية
    isClient: typeof window !== 'undefined'
  };
}