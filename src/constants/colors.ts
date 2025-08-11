// constants/colors.ts

export const COLORS = {
  // Light Mode Colors
  light: {
    primary: '#004D5A',      // الأخضر الداكن
    secondary: '#CFF7EE',    // الأخضر الفاتح جداً
    accent: '#96EDD9',       // الأخضر الفاتح
    neutral: '#666666',      // الرمادي
    success: '#95EDD8',      // الأخضر للنجاح
    info: '#BAF3E6',         // الأخضر الفاتح للمعلومات
    warning: '#5CA9B5',      // الأزرق المخضر للتحذير
    
    // Background variants
    background: {
      primary: '#FFFFFF',
      secondary: '#CFF7EE',
      accent: '#96EDD9',
      muted: '#BAF3E6',
    },
    
    // Text variants
    text: {
      primary: '#004D5A',
      secondary: '#666666',
      muted: '#5CA9B5',
      inverse: '#FFFFFF',
    },
    
    // Border variants
    border: {
      light: '#CFF7EE',
      medium: '#96EDD9',
      dark: '#5CA9B5',
    }
  },
  
  // Dark Mode Colors (existing)
  dark: {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#6366F1',
    neutral: '#9CA3AF',
    success: '#10B981',
    info: '#3B82F6',
    warning: '#F59E0B',
    
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      accent: '#374151',
      muted: '#4B5563',
    },
    
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      muted: '#9CA3AF',
      inverse: '#111827',
    },
    
    border: {
      light: '#374151',
      medium: '#4B5563',
      dark: '#6B7280',
    }
  }
} as const;

export type ColorTheme = keyof typeof COLORS;
export type ColorVariant = keyof typeof COLORS.light;