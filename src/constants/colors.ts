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

// Utility function to get colors based on theme
export const getColors = (theme: ColorTheme = 'light') => COLORS[theme];

// CSS Variables for both themes
export const CSS_VARIABLES = `
:root {
  /* Light Mode */
  --color-primary: ${COLORS.light.primary};
  --color-secondary: ${COLORS.light.secondary};
  --color-accent: ${COLORS.light.accent};
  --color-neutral: ${COLORS.light.neutral};
  --color-success: ${COLORS.light.success};
  --color-info: ${COLORS.light.info};
  --color-warning: ${COLORS.light.warning};
  
  --bg-primary: ${COLORS.light.background.primary};
  --bg-secondary: ${COLORS.light.background.secondary};
  --bg-accent: ${COLORS.light.background.accent};
  --bg-muted: ${COLORS.light.background.muted};
  
  --text-primary: ${COLORS.light.text.primary};
  --text-secondary: ${COLORS.light.text.secondary};
  --text-muted: ${COLORS.light.text.muted};
  --text-inverse: ${COLORS.light.text.inverse};
  
  --border-light: ${COLORS.light.border.light};
  --border-medium: ${COLORS.light.border.medium};
  --border-dark: ${COLORS.light.border.dark};
}

[data-theme="dark"] {
  /* Dark Mode */
  --color-primary: ${COLORS.dark.primary};
  --color-secondary: ${COLORS.dark.secondary};
  --color-accent: ${COLORS.dark.accent};
  --color-neutral: ${COLORS.dark.neutral};
  --color-success: ${COLORS.dark.success};
  --color-info: ${COLORS.dark.info};
  --color-warning: ${COLORS.dark.warning};
  
  --bg-primary: ${COLORS.dark.background.primary};
  --bg-secondary: ${COLORS.dark.background.secondary};
  --bg-accent: ${COLORS.dark.background.accent};
  --bg-muted: ${COLORS.dark.background.muted};
  
  --text-primary: ${COLORS.dark.text.primary};
  --text-secondary: ${COLORS.dark.text.secondary};
  --text-muted: ${COLORS.dark.text.muted};
  --text-inverse: ${COLORS.dark.text.inverse};
  
  --border-light: ${COLORS.dark.border.light};
  --border-medium: ${COLORS.dark.border.medium};
  --border-dark: ${COLORS.dark.border.dark};
}
`;