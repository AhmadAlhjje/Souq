'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
  isLoaded: boolean; // إضافة حالة للتحقق من التحميل
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false); // حالة التحميل

  // دالة للحصول على الثيم المفضل من النظام
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // دالة لحساب الثيم الفعلي
  const calculateActualTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, [getSystemTheme]);

  // تحديث الثيم الفعلي
  const updateActualTheme = useCallback((newTheme: Theme) => {
    const calculated = calculateActualTheme(newTheme);
    setActualTheme(calculated);
    
    // تحديث DOM فقط في المتصفح
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(calculated);
      document.documentElement.setAttribute('data-theme', calculated);
      
      // تحديث localStorage
      localStorage.setItem('theme', newTheme);
    }
  }, [calculateActualTheme]);

  // تحديد الثيم
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    updateActualTheme(newTheme);
  }, [updateActualTheme]);

  // تبديل الثيم
  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = 
      theme === 'light' ? 'dark' : 
      theme === 'dark' ? 'system' : 
      'light';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // تحميل الثيم المحفوظ عند البدء - يحدث فقط في العميل
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme: Theme = storedTheme || 'system';
    
    setThemeState(initialTheme);
    updateActualTheme(initialTheme);
    setIsLoaded(true); // تعيين حالة التحميل
  }, [updateActualTheme]);

  // مراقبة تغييرات النظام للثيم
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        updateActualTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, updateActualTheme]);

  // خصائص مساعدة
  const isDark = actualTheme === 'dark';
  const isLight = actualTheme === 'light';

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      actualTheme,
      toggleTheme, 
      setTheme,
      isDark,
      isLight,
      isLoaded
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};