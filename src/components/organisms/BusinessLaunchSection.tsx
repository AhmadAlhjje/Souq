// components/organisms/BusinessLaunchSection.tsx
import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import FeatureCard from "../molecules/FeatureCard";
import ImageShowcase from "../molecules/ImageShowcase";
import { PiFactory, PiShoppingBag, PiCubeTransparent } from "react-icons/pi";

export default function BusinessLaunchSection() {
  const features = [
    {
      text: "تسهّل إدارة متجرك وتقدّم تجربة تسوق استثنائية لعملائك",
      description: "واجهة إدارية متقدمة مع تحليلات مفصلة",
      icon: <PiFactory className="text-xl text-white" />, // تصغير من text-3xl إلى text-xl
      color: "from-[#004D5A] to-[#005965]",
    },
    {
      text: "استقبل طلبات شراء سهلة ومرنة لكل عميل",
      description: "نظام طلبات ذكي يتكيف مع احتياجات عملائك",
      icon: <PiShoppingBag className="text-xl text-[#004D5A]" />, // تصغير من text-3xl إلى text-xl
      color: "from-[#96EDD9] to-[#7dd3bf]",
    },
    {
      text: "عرض صور ثلاثية الأبعاد تبرز أناقة التفاصيل",
      description: "تقنيات عرض متطورة لإبراز جمال منتجاتك",
      icon: <PiCubeTransparent className="text-xl text-white" />, // تصغير من text-3xl إلى text-xl
      color: "from-[#004D5A] to-[#005965]",
    },
  ];

  return (
    <Section className="py-20 px-6" background="white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            text="🚀 قوة التكنولوجيا"
            variant="primary"
            className="mb-4"
          />
          <Heading
            text="انطلق بتجارتك أينما كنت"
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-6"
          />
          <Text
            text="تكنولوجيا متقدمة وحلول مرنة تمكنك من إدارة تجارتك بكفاءة من أي مكان"
            variant="subtitle"
            className="text-[#004D5A]/70 text-lg max-w-4xl mx-auto leading-relaxed"
          />
        </div>

        {/* Content */}
        <div className=" text-right bg-gradient-to-br from-gray-50 via-white to-[#96EDD9]/10 rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Features Side */}
            <div className="p-8 lg:p-12">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-[#004D5A] mb-4">
                  حيث تتلاقى السهولة بالأناقة
                </h3>
                <p className="text-[#004D5A]/70 text-lg leading-relaxed">
                  تجربة فريدة تجمع بين البساطة في الاستخدام والتطور التقني
                </p>
              </div>

              <div className="space-y-6 ">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} index={index} />
                ))}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button className="bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  جرب المنصة مجاناً
                </button>
              </div>
            </div>

            {/* Images Side */}
            <ImageShowcase />
          </div>
        </div>
      </div>
    </Section>
  );
}