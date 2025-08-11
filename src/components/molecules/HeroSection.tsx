"use client";

// components/molecules/HeroSection.tsx
import React from 'react';
import Heading from '../atoms/Heading';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import useTranslation from '../../hooks/useTranslation';

const HeroSection: React.FC = () => {
  const { t, isRTL } = useTranslation();

  // Dynamic classes based on direction
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const justifyContent = isRTL ? 'justify-start' : 'justify-end';
  const marginAuto = isRTL ? 'ml-auto' : 'mr-auto';
  const gradientDirection = isRTL ? 'to-l' : 'to-r';
  const bannerPosition = isRTL ? 'right-4 sm:right-8 md:right-12' : 'left-4 sm:left-8 md:left-12';

  return (
    <div className="relative mt-16 min-h-screen bg-gradient-to-br from-[#96EDD9] via-[#A8F0DC] to-[#B8F3E0] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
      </div>

      {/* Top Banner */}
      <div className={`absolute top-6 ${bannerPosition} z-10`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#004D5A] rounded-full animate-pulse"></div>
            <span className="text-sm sm:text-base font-bold text-[#004D5A]">
              {t('hero_banner')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className={`flex items-center ${justifyContent} min-h-screen px-6 sm:px-12 md:px-16 lg:px-20`}>
        <div className={`max-w-2xl ${textAlign} space-y-8 relative z-10`}>
          
          {/* Main Heading */}
          <div className="space-y-4">
            <Heading 
              text={t('hero_title')} 
              level={1} 
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#004D5A] leading-tight"
            />
            
            {/* Decorative Line */}
            <div className={`w-20 h-1 bg-gradient-${gradientDirection} from-[#004D5A] to-transparent ${marginAuto} rounded-full`}></div>
          </div>

          {/* Description Text */}
          <div className="space-y-6">
            <Text 
              text={t('hero_subtitle')} 
              className="text-xl sm:text-2xl text-[#003940] font-medium leading-relaxed"
            />
            
            <Text 
              text={t('hero_description')} 
              className="text-lg sm:text-xl text-[#004D5A]/80 leading-relaxed"
            />
          </div>

          {/* Call to Action */}
          <div className="pt-4">
            <Button
              text={t('hero_cta_primary')}
              className="group relative bg-[#004D5A] hover:bg-[#003940] text-white font-bold py-4 px-8 sm:px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg"
            />
            
            {/* Secondary CTA */}
            <div className={`mt-6 flex items-center ${isRTL ? 'justify-start' : 'justify-end'} gap-4 text-sm text-[#004D5A]/70`}>
              <span>{t('hero_cta_or')}</span>
              <button className="underline hover:text-[#004D5A] transition-colors duration-200">
                {t('hero_cta_secondary')}
              </button>
            </div>
          </div>

          {/* Stats or Features Preview */}
          <div className="pt-8 border-t border-white/30">
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-8 text-center`}>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#004D5A]">60K+</div>
                <div className="text-sm text-[#004D5A]/70">
                  {t('hero_stats_active_traders')}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#004D5A]">24/7</div>
                <div className="text-sm text-[#004D5A]/70">
                  {t('hero_stats_tech_support')}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#004D5A]">99%</div>
                <div className="text-sm text-[#004D5A]/70">
                  {t('hero_stats_customer_satisfaction')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;