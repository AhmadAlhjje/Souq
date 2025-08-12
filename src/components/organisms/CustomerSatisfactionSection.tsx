"use client";
// components/organisms/CustomerSatisfactionSection.tsx
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import CustomerCard from "../molecules/CustomerCard";
import EnhancedCallToAction from "../molecules/EnhancedCallToAction";
import { useTranslation } from "react-i18next";

export default function CustomerSatisfactionSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const customerData = [
    {
      src: "/images/image 1.png",
      alt: t('customerSatisfactionSection.customerData.customer1.alt'),
      title: t('customerSatisfactionSection.customerData.customer1.title'),
      subtitle: t('customerSatisfactionSection.customerData.customer1.subtitle'),
      percentage: t('customerSatisfactionSection.customerData.customer1.percentage'),
      color: "from-green-500 to-green-600",
      features: [
        t('customerSatisfactionSection.customerData.customer1.features.feature1'),
        t('customerSatisfactionSection.customerData.customer1.features.feature2'),
        t('customerSatisfactionSection.customerData.customer1.features.feature3'),
      ],
    },
    {
      src: "/images/image2.png",
      alt: t('customerSatisfactionSection.customerData.customer2.alt'),
      title: t('customerSatisfactionSection.customerData.customer2.title'),
      subtitle: t('customerSatisfactionSection.customerData.customer2.subtitle'),
      percentage: t('customerSatisfactionSection.customerData.customer2.percentage'),
      color: "from-blue-500 to-blue-600",
      features: [
        t('customerSatisfactionSection.customerData.customer2.features.feature1'),
        t('customerSatisfactionSection.customerData.customer2.features.feature2'),
        t('customerSatisfactionSection.customerData.customer2.features.feature3'),
      ],
    },
    {
      src: "/images/image3.png",
      alt: t('customerSatisfactionSection.customerData.customer3.alt'),
      title: t('customerSatisfactionSection.customerData.customer3.title'),
      subtitle: t('customerSatisfactionSection.customerData.customer3.subtitle'),
      percentage: t('customerSatisfactionSection.customerData.customer3.percentage'),
      color: "from-purple-500 to-purple-600",
      features: [
        t('customerSatisfactionSection.customerData.customer3.features.feature1'),
        t('customerSatisfactionSection.customerData.customer3.features.feature2'),
        t('customerSatisfactionSection.customerData.customer3.features.feature3'),
      ],
    },
  ];

  return (
    <Section
      className="py-20 px-6 bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#96EDD9]/5"
      background="light"
    >
      <div className={`max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            text={t('customerSatisfactionSection.header.badge')}
            variant="primary"
            className="mb-4"
          />
          <Heading
            text={t('customerSatisfactionSection.header.title')}
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-6"
          />
          <Text
            text={t('customerSatisfactionSection.header.subtitle')}
            variant="subtitle"
            className="text-[#004D5A]/70 text-lg max-w-4xl mx-auto leading-relaxed"
          />
        </div>

        {/* Customer Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {customerData.map((item, index) => (
            <CustomerCard key={index} {...item} />
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <EnhancedCallToAction />
      </div>
    </Section>
  );
}
