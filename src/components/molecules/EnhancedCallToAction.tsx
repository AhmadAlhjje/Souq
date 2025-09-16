"use client";
import Link from "next/link";
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
          <Link
            href="/LoginPage"
            className="flex justify-center group relative bg-[#004D5A] hover:bg-[#003940] text-white font-bold py-4 px-8 sm:px-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg" 
            prefetch={true}
          >
            {t("create_store_free")}
          </Link>
        </div>

        {/* Visual Side - Single Full Image */}
        <div className="relative min-h-[400px]">
          <div className="relative h-full w-full">
            {/* Main Dashboard Image - Now fills the entire space */}
            <div className="absolute inset-0 group">
              <div className="relative w-full h-full overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/image_2025-09-12_21-28-30.png"
                  alt={t('enhancedCallToAction.images.dashboard.alt')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D5A]/20 to-transparent"></div>
              </div>
            </div>

            {/* Success Stats - Positioned over the image */}
            <div className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl z-10`}>
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