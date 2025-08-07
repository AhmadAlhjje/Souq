// components/organisms/ServicesSection.tsx (المحدث)
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import ServiceCard from "../molecules/ServiceCard";

export default function ServicesSection() {
  const services = [
    {
      title: "إنشاء المتاجر الإلكترونية",
      description: "منصة متكاملة لإنشاء متجرك الإلكتروني بأحدث التقنيات وأسهل الطرق",
      imageSrc: "/images/image 1.png",
      buttonText: "ابدأ الآن",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "نظام المدفوعات الآمن",
      description: "حلول دفع متنوعة وآمنة تدعم جميع وسائل الدفع المحلية والدولية",
      imageSrc: "/images/image22.png",
      buttonText: "تعرف أكثر",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "خدمات الشحن والتوصيل",
      description: "شبكة واسعة من شركات الشحن لضمان وصول منتجاتك لعملائك في الوقت المحدد",
      imageSrc: "/images/image3.png",
      buttonText: "استكشف الخدمة",
      gradient: "from-purple-500 to-purple-600"
    }
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
            text="✨ خدماتنا المميزة"
            variant="primary"
            className="mb-4"
          />
          <Heading
            text="نقدم لك كل ما تحتاجه لبناء متجر ناجح مع TMC"
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-4"
          />
          <Text
            text="حلول شاملة ومتكاملة تدعمك في كل خطوة من رحلتك التجارية"
            variant="subtitle"
            className="text-[#004D5A]/70 text-lg max-w-3xl mx-auto leading-relaxed"
          />
        </div>

        {/* Services Container */}
        <div className=" text-right bg-gradient-to-br from-[#96EDD9] via-[#96EDD9]/90 to-[#96EDD9]/80 p-8 md:p-12 rounded-3xl shadow-xl border border-[#96EDD9]/20">
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