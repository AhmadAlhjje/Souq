"use client";

import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import ServiceCard from "../molecules/ServiceCard";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const services = [
    {
      title: t("services.ecommerce.title"),
      description: t("services.ecommerce.description"),
      imageSrc: "/images/image 1.png",
      buttonText: t("services.ecommerce.buttonText"),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: t("services.payments.title"),
      description: t("services.payments.description"),
      imageSrc: "/images/image22.png",
      buttonText: t("services.payments.buttonText"),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: t("services.shipping.title"),
      description: t("services.shipping.description"),
      imageSrc: "/images/image3.png",
      buttonText: t("services.shipping.buttonText"),
      gradient: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <Section
      className="py-20 px-6 bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#96EDD9]/5"
      background="light"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge
            text={t("services.badge")}
            variant="primary"
            className="mb-4"
          />
          <Heading
            text={t("services.title")}
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-4"
          />
          <Text
            text={t("services.subtitle")}
            variant="subtitle"
            className="text-[#004D5A]/70 text-lg max-w-3xl mx-auto leading-relaxed"
          />
        </div>

        {/* Services Container */}
        <div
          className={`${
            isRTL ? "text-right" : "text-left"
          } bg-gradient-to-br from-[#96EDD9] via-[#96EDD9]/90 to-[#96EDD9]/80 p-8 md:p-12 rounded-3xl shadow-xl border border-[#96EDD9]/20`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                imageSrc={service.imageSrc}
                buttonText={service.buttonText}
                gradient={service.gradient}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
