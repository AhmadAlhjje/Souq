// components/organisms/CustomerSatisfactionSection.tsx
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import CustomerCard from "../molecules/CustomerCard";
import EnhancedCallToAction from "../molecules/EnhancedCallToAction";

export default function CustomerSatisfactionSection() {
  const customerData = [
    {
      src: "/images/image 1.png",
      alt: "ثقة العملاء",
      title: "من العملاء تزداد ثقتهم في متاجر TMC",
      subtitle: "نسبة رضا عالية",
      percentage: "98%",
      color: "from-green-500 to-green-600",
      features: ["أمان المدفوعات", "سرعة التسليم", "جودة المنتجات"],
    },
    {
      src: "/images/image2.png",
      alt: "سهولة الشراء",
      title: "شراء مباشر دون تعقيد أو إنشاء حساب",
      subtitle: "تجربة سلسة",
      percentage: "3 خطوات",
      color: "from-blue-500 to-blue-600",
      features: ["تسجيل سريع", "دفع مرن", "متابعة الطلبات"],
    },
    {
      src: "/images/image3.png",
      alt: "انتشار واسع",
      title: "5 من أصل 5 في سوريا اشتروا من متاجر TMC",
      subtitle: "ثقة منتشرة",
      percentage: "100%",
      color: "from-purple-500 to-purple-600",
      features: ["تغطية شاملة", "خدمة 24/7", "دعم محلي"],
    },
  ];

  return (
    <Section
      className="py-20 px-6 bg-gradient-to-br from-[#96EDD9]/10 via-white to-[#96EDD9]/5"
      background="light"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            text="😊 رضا العملاء أولويتنا"
            variant="primary"
            className="mb-4"
          />
          <Heading
            text="أسعد عملاءك بتجربة شراء سهلة"
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-6"
          />
          <Text
            text="تجربة تسوق متميزة تبني الثقة وتحقق رضا العملاء مع كل عملية شراء"
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