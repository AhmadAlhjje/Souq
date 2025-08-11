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
import useTranslation from "../../hooks/useTranslation";

export default function BusinessLaunchSection() {
  const { t, isRTL } = useTranslation();

  const features = [
    {
      text: isRTL 
        ? "تسهّل إدارة متجرك وتقدّم تجربة تسوق استثنائية لعملائك"
        : "Simplify store management and provide exceptional shopping experience for your customers",
      description: isRTL 
        ? "واجهة إدارية متقدمة مع تحليلات مفصلة"
        : "Advanced admin interface with detailed analytics",
      icon: <PiFactory className="text-xl text-white" />,
      color: "from-[#004D5A] to-[#005965]",
    },
    {
      text: isRTL 
        ? "استقبل طلبات شراء سهلة ومرنة لكل عميل"
        : "Receive easy and flexible purchase orders for every customer",
      description: isRTL 
        ? "نظام طلبات ذكي يتكيف مع احتياجات عملائك"
        : "Smart ordering system that adapts to your customers' needs",
      icon: <PiShoppingBag className="text-xl text-[#004D5A]" />,
      color: "from-[#96EDD9] to-[#7dd3bf]",
    },
    {
      text: isRTL 
        ? "عرض صور ثلاثية الأبعاد تبرز أناقة التفاصيل"
        : "Display 3D images that highlight elegant details",
      description: isRTL 
        ? "تقنيات عرض متطورة لإبراز جمال منتجاتك"
        : "Advanced display technologies to showcase your products' beauty",
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
            text={isRTL ? "🚀 قوة التكنولوجيا" : "🚀 Technology Power"} 
            variant="primary" 
            className="mb-4" 
          />
          <Heading
            text={isRTL ? "انطلق بتجارتك أينما كنت" : "Launch Your Business Anywhere"}
            level={2}
            variant="section"
            className="text-3xl md:text-4xl font-bold text-[#004D5A] mb-6"
          />
          <Text
            text={isRTL 
              ? "تكنولوجيا متقدمة وحلول مرنة تمكنك من إدارة تجارتك بكفاءة من أي مكان"
              : "Advanced technology and flexible solutions enable you to manage your business efficiently from anywhere"
            }
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
                  {isRTL 
                    ? "حيث تتلاقى السهولة بالأناقة"
                    : "Where Simplicity Meets Elegance"
                  }
                </h3>
                <p className="text-[#004D5A]/70 text-lg leading-relaxed">
                  {isRTL 
                    ? "تجربة فريدة تجمع بين البساطة في الاستخدام والتطور التقني"
                    : "A unique experience combining ease of use with technical advancement"
                  }
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
                  {isRTL ? "جرب المنصة مجاناً" : "Try Platform for Free"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}