"use client";
import React from "react";
import { useTranslation } from "react-i18next";

export default function EnhancedCallToAction() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const benefits = [
    t('enhancedCallToAction.benefits.benefit1'),
    t('enhancedCallToAction.benefits.benefit2'),
    t('enhancedCallToAction.benefits.benefit3'),
    t('enhancedCallToAction.benefits.benefit4')
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-[#96EDD9]/10 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#004D5A] to-[#96EDD9]"></div>
      </div>
             
      {/* Content Grid */}
      <div className={`relative grid lg:grid-cols-2 gap-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                 
        {/* Text Content */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-[#004D5A] mb-4">
              {t('enhancedCallToAction.title')}
            </h3>
            <p className="text-[#004D5A]/70 text-lg leading-relaxed mb-6">
              {t('enhancedCallToAction.description')}
            </p>
          </div>

          {/* Benefits List */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className={`flex items-center gap-2 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#004D5A] to-[#96EDD9] flex-shrink-0"></div>
                <span className="text-[#004D5A] font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {t('enhancedCallToAction.buttonText')}
          </button>
        </div>

        {/* Visual Side */}
        <div className="relative p-8 lg:p-12 min-h-[300px]">
          <div className="relative h-full">
                             
            {/* Main Dashboard Image */}
            <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-4/5 h-3/4 group`}>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/image 1.png"
                  alt={t('enhancedCallToAction.images.dashboard.alt')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D5A]/20 to-transparent"></div>
              </div>
            </div>

            {/* Secondary Mobile Image */}
            <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-1/2 h-1/2 group`}>
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-500 delay-100">
                <img
                  src="/images/image2.png"
                  alt={t('enhancedCallToAction.images.mobile.alt')}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Success Stats */}
            <div className={`absolute top-1/3 ${isRTL ? 'left-0' : 'right-0'} bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl`}>
              <div className="text-center">
                <div className="text-lg font-bold text-[#004D5A]">{t('enhancedCallToAction.stats.number')}</div>
                <div className="text-xs text-[#004D5A]/70">{t('enhancedCallToAction.stats.label')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
