import { useThemeContext } from '@/contexts/ThemeContext';

export default function useTheme() {
  const context = useThemeContext();
  
  // دوال مساعدة إضافية
  const setLightTheme = () => context.setTheme('light');
  const setDarkTheme = () => context.setTheme('dark');
  
  return {
    ...context,
    // دوال سريعة
    setLightTheme,
    setDarkTheme,
    // أليس مفيدة للشروط
    themeClasses: {
      light: context.isLight,
      dark: context.isDark,
    },
    // حماية إضافية
    isClient: typeof window !== 'undefined'
  };
}