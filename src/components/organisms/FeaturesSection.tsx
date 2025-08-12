"use client";
import React from "react";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import Badge from "../atoms/Badge";
import { useTranslation } from "react-i18next"; // استيراد من مكتبة react-i18next
import {
  FaBullhorn,
  FaRocket,
  FaCreditCard,
  FaTruck,
  FaStore,
  FaPlug,
  FaUsers,
  FaExchangeAlt,
  FaBolt,
  FaCalendarCheck,
  FaShieldAlt,
  FaGlobe,
  FaBox,
  FaMapMarkerAlt,
  FaGift,
  FaSlidersH,
  FaHandshake,
  FaShoppingCart,
} from "react-icons/fa";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start space-x-4 space-x-reverse group">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <Text
          text={title}
          className="text-[#004D5A] font-semibold text-base leading-tight mb-1"
        />
        {description && (
          <Text
            text={description}
            variant="caption"
            className="text-[#004D5A]/60 text-sm"
          />
        )}
      </div>
    </div>
  );
}

interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string;
}

function IconWrapper({
  icon,
  gradient = "from-[#5CA9B5] to-[#4a9aa7]",
}: IconWrapperProps) {
  return (
    <div
      className={`w-10 h-10 bg-gradient-to-br ml-4 ${gradient} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300`}
    >
      <div className="text-white text-base text-right">{icon}</div>
    </div>
  );
}

export default function FeaturesSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // تعديل لتحديد اتجاه اللغة حسب اللغة الحالية

  const solutions = [
    {
      id: 1,
      title: t("featuresSection.solutions.solution1.title"),
      description: t("featuresSection.solutions.solution1.description"),
      image: "/images/image 1.png",
      buttonIcon: <FaStore className="text-sm" />,
      buttonText: t("featuresSection.solutions.solution1.buttonText"),
      features: [
        {
          icon: <IconWrapper icon={<FaPlug />} />,
          title: t(
            "featuresSection.solutions.solution1.features.feature1.title"
          ),
          description: t(
            "featuresSection.solutions.solution1.features.feature1.description"
          ),
        },
        {
          icon: <IconWrapper icon={<FaRocket />} />,
          title: t(
            "featuresSection.solutions.solution1.features.feature2.title"
          ),
          description: t(
            "featuresSection.solutions.solution1.features.feature2.description"
          ),
        },
        {
          icon: <IconWrapper icon={<FaUsers />} />,
          title: t(
            "featuresSection.solutions.solution1.features.feature3.title"
          ),
          description: t(
            "featuresSection.solutions.solution1.features.feature3.description"
          ),
        },
      ],
      background: "bg-white/80",
      reverse: false,
    },
    {
      id: 2,
      title: t("featuresSection.solutions.solution2.title"),
      description: t("featuresSection.solutions.solution2.description"),
      image: "/images/image22.png",
      buttonIcon: <FaCreditCard className="text-sm" />,
      buttonText: t("featuresSection.solutions.solution2.buttonText"),
      features: [
        {
          icon: (
            <IconWrapper
              icon={<FaExchangeAlt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: t(
            "featuresSection.solutions.solution2.features.feature1.title"
          ),
          description: t(
            "featuresSection.solutions.solution2.features.feature1.description"
          ),
        },
        {
          icon: (
            <IconWrapper
              icon={<FaBolt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: t(
            "featuresSection.solutions.solution2.features.feature2.title"
          ),
          description: t(
            "featuresSection.solutions.solution2.features.feature2.description"
          ),
        },
        {
          icon: (
            <IconWrapper
              icon={<FaCalendarCheck />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: t(
            "featuresSection.solutions.solution2.features.feature3.title"
          ),
          description: t(
            "featuresSection.solutions.solution2.features.feature3.description"
          ),
        },
        {
          icon: (
            <IconWrapper
              icon={<FaShieldAlt />}
              gradient="from-emerald-500 to-emerald-600"
            />
          ),
          title: t(
            "featuresSection.solutions.solution2.features.feature4.title"
          ),
          description: t(
            "featuresSection.solutions.solution2.features.feature4.description"
          ),
        },
      ],
      background: "bg-gradient-to-br from-[#96EDD9]/5 via-white to-[#96EDD9]/10",
      reverse: true,
    },
    {
      id: 3,
      title: t("featuresSection.solutions.solution3.title"),
      description: t("featuresSection.solutions.solution3.description"),
      image: "/images/image3.png",
      buttonIcon: <FaTruck className="text-sm" />,
      buttonText: t("featuresSection.solutions.solution3.buttonText"),
      features: [
        {
          icon: (
            <IconWrapper icon={<FaPlug />} gradient="from-blue-500 to-blue-600" />
          ),
          title: t(
            "featuresSection.solutions.solution3.features.feature1.title"
          ),
          description: t(
            "featuresSection.solutions.solution3.features.feature1.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaGlobe />} gradient="from-blue-500 to-blue-600" />
          ),
          title: t(
            "featuresSection.solutions.solution3.features.feature2.title"
          ),
          description: t(
            "featuresSection.solutions.solution3.features.feature2.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaBox />} gradient="from-blue-500 to-blue-600" />
          ),
          title: t(
            "featuresSection.solutions.solution3.features.feature3.title"
          ),
          description: t(
            "featuresSection.solutions.solution3.features.feature3.description"
          ),
        },
        {
          icon: (
            <IconWrapper
              icon={<FaMapMarkerAlt />}
              gradient="from-blue-500 to-blue-600"
            />
          ),
          title: t(
            "featuresSection.solutions.solution3.features.feature4.title"
          ),
          description: t(
            "featuresSection.solutions.solution3.features.feature4.description"
          ),
        },
      ],
      background: "bg-gradient-to-br from-gray-50 to-gray-100/50",
      reverse: false,
    },
    {
      id: 4,
      title: t("featuresSection.solutions.solution4.title"),
      description: t("featuresSection.solutions.solution4.description"),
      image: "/images/image4.png",
      buttonIcon: <FaBullhorn className="text-sm" />,
      buttonText: t("featuresSection.solutions.solution4.buttonText"),
      features: [
        {
          icon: (
            <IconWrapper icon={<FaGift />} gradient="from-purple-500 to-purple-600" />
          ),
          title: t(
            "featuresSection.solutions.solution4.features.feature1.title"
          ),
          description: t(
            "featuresSection.solutions.solution4.features.feature1.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaSlidersH />} gradient="from-purple-500 to-purple-600" />
          ),
          title: t(
            "featuresSection.solutions.solution4.features.feature2.title"
          ),
          description: t(
            "featuresSection.solutions.solution4.features.feature2.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaHandshake />} gradient="from-purple-500 to-purple-600" />
          ),
          title: t(
            "featuresSection.solutions.solution4.features.feature3.title"
          ),
          description: t(
            "featuresSection.solutions.solution4.features.feature3.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaShoppingCart />} gradient="from-purple-500 to-purple-600" />
          ),
          title: t(
            "featuresSection.solutions.solution4.features.feature4.title"
          ),
          description: t(
            "featuresSection.solutions.solution4.features.feature4.description"
          ),
        },
        {
          icon: (
            <IconWrapper icon={<FaBullhorn />} gradient="from-purple-500 to-purple-600" />
          ),
          title: t(
            "featuresSection.solutions.solution4.features.feature5.title"
          ),
          description: t(
            "featuresSection.solutions.solution4.features.feature5.description"
          ),
        },
      ],
      background: "bg-white/90",
      reverse: true,
    },
  ];

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <Badge
          text={t("featuresSection.header.badge")}
          variant="primary"
          className="mb-6"
        />
        <Heading
          text={t("featuresSection.header.title")}
          level={2}
          variant="section"
          className="text-3xl md:text-4xl font-bold text-[#004D5A] leading-tight mb-4"
        />
        <Text
          text={t("featuresSection.header.subtitle")}
          variant="subtitle"
          className="text-[#004D5A]/70 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
        />
      </div>

      {/* Solutions Container */}
      <div className={`${isRTL ? "text-right" : "text-left"} space-y-16`}>
        {solutions.map((solution) => (
          <div key={solution.id} className="relative">
            {/* Background Effect */}
            <div
              className={`absolute inset-0 ${
                solution.id % 2 === 0
                  ? `bg-gradient-to-${isRTL ? "r" : "l"} from-[#96EDD9]/20 to-transparent`
                  : `bg-gradient-to-${isRTL ? "l" : "r"} from-[#004D5A]/5 to-transparent`
              } rounded-3xl blur-3xl`}
            ></div>

            {/* Solution Card */}
            <div
              className={`relative ${solution.background} backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden`}
            >
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 p-6 lg:p-10 items-center">
                {/* Content Side */}
                <div
                  className={`${
                    solution.reverse ? "lg:order-2" : ""
                  } space-y-6`}
                >
                  {/* Header */}
                  <div>
                    <Heading
                      text={solution.title}
                      level={3}
                      className="text-xl lg:text-2xl font-bold text-[#004D5A] mb-3"
                    />
                    <Text
                      text={solution.description}
                      variant="subtitle"
                      className="text-[#004D5A]/70 leading-relaxed text-sm"
                    />
                  </div>
                  {/* Features List */}
                  <div className="space-y-4">
                    {solution.features.map((feature, index) => (
                      <FeatureItem
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                      />
                    ))}
                  </div>
                  {/* Action Button */}
                  <div className="pt-3">
                    <button
                      className={`inline-flex items-center ${
                        isRTL
                          ? "space-x-reverse space-x-2"
                          : "space-x-2"
                      } bg-gradient-to-r from-[#004D5A] to-[#005965] hover:from-[#005965] hover:to-[#006670] text-white font-semibold py-3 px-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm`}
                    >
                      <span>{solution.buttonText}</span>
                      {solution.buttonIcon}
                    </button>
                  </div>
                </div>
                {/* Image Side */}
                <div className={`${solution.reverse ? "lg:order-1" : ""}`}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#004D5A]/10 to-[#96EDD9]/10 rounded-3xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500"></div>
                    <div className="relative bg-white rounded-3xl p-4 shadow-xl transform group-hover:-rotate-0.5 transition-transform duration-500">
                      <img
                        src={solution.image}
                        alt={solution.title}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-br from-[#004D5A] via-[#005965] to-[#006670] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#96EDD9]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#96EDD9]/5 rounded-full blur-2xl"></div>
          <div
            className={`relative text-center ${isRTL ? "rtl" : "ltr"}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Heading
              text={t("featuresSection.cta.title")}
              level={3}
              className="text-xl md:text-2xl font-bold text-white mb-3"
            />
            <Text
              text={t("featuresSection.cta.description")}
              className="text-white text-base mb-6 max-w-2xl mx-auto"
            />
            <button className="bg-[#96EDD9] hover:bg-[#7dd3bf] text-[#004D5A] font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm">
              {t("featuresSection.cta.buttonText")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
