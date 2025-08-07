// components/organisms/HeroTitleSection.tsx
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";

export default function HeroTitleSection() {
  return (
    <Section
      className="relative py-16 px-6 bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] overflow-hidden"
      background="gradient"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#96EDD9]/5 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center">
        <Badge
          text="🚀 المنصة الرائدة في سوريا"
          variant="hero"
          className="mb-6"
        />
        <Heading
          text="أكبر منصة سورية للتجارة في الشرق الأوسط"
          level={1}
          variant="hero"
          className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
        />
        <Text
          text="منصة متكاملة تجمع بين التكنولوجيا المتقدمة والحلول المبتكرة لتمكين التجار من تحقيق أهدافهم"
          variant="hero"
          className="text-[#96EDD9]/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
        />
      </div>
    </Section>
  );
}