// ===========================================
// 3. CTASection.tsx
// ===========================================
'use client';
import React from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import useTheme from '@/hooks/useTheme';

const CTASection: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mt-16 text-center">
      <div className={`rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-800' 
          : 'bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600'
      }`}>
        {/* Decorative Background */}
        <div className={`absolute top-0 right-0 w-24 h-12 rounded-full blur-3xl transition-colors duration-300 ${
          isDark ? 'bg-emerald-500/15' : 'bg-teal-500/15'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl transition-colors duration-300 ${
          isDark ? 'bg-emerald-500/10' : 'bg-teal-500/10'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full transition-colors duration-300 ${
          isDark ? 'border border-emerald-500/20' : 'border border-white/10'
        }`}></div>
        <div className={`absolute top-4 left-4 w-4 h-4 rotate-45 transition-colors duration-300 ${
          isDark ? 'bg-emerald-500/30' : 'bg-teal-500/20'
        }`}></div>
        <div className={`absolute bottom-4 right-4 w-5 h-5 rounded-full transition-colors duration-300 ${
          isDark ? 'border border-emerald-500/30' : 'border border-white/20'
        }`}></div>
                
        <div className="relative text-center" dir="rtl">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm transition-colors duration-300 ${
            isDark ? 'bg-emerald-500/20' : 'bg-teal-500/20'
          }`}>
            <Icon 
              name="cart" 
              size="xl" 
              color={isDark ? "#10B981" : "#0D9488"} 
            />
          </div>
                    
          <Typography 
            variant="h2" 
            className={`mb-4 transition-colors duration-300 ${
              isDark ? 'text-emerald-300' : 'text-white'
            }`}
          >
            هل أنت مستعد للبدء معنا؟
          </Typography>
                    
          <Typography className={`text-base lg:text-lg mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-slate-300' : 'text-white/90'
          }`}>
            انضم إلى آلاف العملاء الذين يثقون في خدماتنا ويحققون النجاح معنا.
            دعنا نساعدك في تحويل أفكارك إلى واقع رقمي مميز
          </Typography>
                    
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="secondary"
              size="lg"
              startIcon={<Icon name="cart" size="sm" />}
              className={`relative overflow-hidden group transition-colors duration-300 ${
                isDark 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'bg-white text-teal-900 hover:bg-gray-100'
              }`}
            >
              ابدأ رحلتك الآن
            </Button>
                        
            <Button
              variant="outline"
              size="lg"
              startIcon={<Icon name="users" size="sm" />}
              className={`transition-colors duration-300 ${
                isDark 
                  ? 'border-emerald-400 text-emerald-300 hover:bg-emerald-500/10' 
                  : 'border-white text-white hover:bg-white/10'
              }`}
            >
              تواصل معنا
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;