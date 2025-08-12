"use client";
// components/organisms/BusinessLaunchSection.tsx
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import FeatureCard from "../molecules/FeatureCard";
import ImageShowcase from "../molecules/ImageShowcase";
import { PiFactory, PiShoppingBag, PiCubeTransparent } from "react-icons/pi";
import { useTranslation } from "react-i18next";

export default function BusinessLaunchSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const features = [
    {
      text: t('businessLaunchSection.features.feature1.text'),
      description: t('businessLaunchSection.features.feature1.description'),
      icon: <PiFactory className="text-xl text-white" />,
      color: "from-[#004D5A] to-[#005965]",
    },
    {
      text: t('businessLaunchSection.features.feature2.text'),
      description: t('businessLaunchSection.features.feature2.description'),
      icon: <PiShoppingBag className="text-xl text-[#004D5A]" />,
      color: "from-[#96EDD9] to-[#7dd3bf]",
    },
    {
      text: t('businessLaunchSection.features.feature3.text'),
      description: t('businessLaunchSection.features.feature3.description'),
      icon: <PiCubeTransparent className="text-xl text-white" />,
      color: "from-[#004D5A] to-[#005965]",
    },
  ];

  // Dynamic classes based on direction
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const gridOrder = isRTL ? 'lg:order-2' : 'lg:order-1';
  const gridOrderReverse = isRTL ? 'lg:order-1' : 'lg:order-2';

  return (
    <Section className="py-20 px-6" background="white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 ${textAlign}`}>
          <Badge 
            text={t("businessLaunchSection.badgeText")} 
            variant="primary" 
            className="mb-4" 
          />
          <Heading
            text={t("businessLaunchSection.heading")}
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-6"
          />
          <Text
            text={t("businessLaunchSection.subtitle")}
            variant="subtitle"
            className="text-[#004D5A]/70 text-lg max-w-4xl mx-auto leading-relaxed"
          />
        </div>

        {/* Content */}
        <div className={`${textAlign} bg-gradient-to-br from-gray-50 via-white to-[#96EDD9]/10 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden`}>
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Images Side */}
            <div className={gridOrder}>
              <ImageShowcase />
            </div>
            
            {/* Features Side */}
            <div className={`p-8 lg:p-12 ${gridOrderReverse}`}>
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[#004D5A] mb-4">
                  {t("businessLaunchSection.featuresHeading")}
                </h3>
                <p className="text-[#004D5A]/70 text-lg leading-relaxed">
                  {t("businessLaunchSection.featuresDescription")}
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} index={index} />
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button className="bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {t("businessLaunchSection.ctaButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
