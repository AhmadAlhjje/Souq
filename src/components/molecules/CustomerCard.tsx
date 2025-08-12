"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface CustomerCardProps {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  percentage: string;
  color: string;
  features: string[];
}

export default function CustomerCard({
  src,
  alt,
  title,
  subtitle,
  percentage,
  color,
  features,
}: CustomerCardProps) {
  const { t, i18n } = useTranslation();

  // تحديد اتجاه النص بناءً على اللغة الحالية
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden rounded-t-3xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

        {/* Stats Badge */}
        <div className={`absolute top-6 ${isRTL ? "right-6" : "left-6"}`}>
          <div
            className={`bg-gradient-to-r ${color} rounded-2xl px-4 py-2 shadow-lg backdrop-blur-sm`}
          >
            <div className="text-white font-bold text-lg">{percentage}</div>
            <div className="text-white/80 text-xs">{subtitle}</div>
          </div>
        </div>

        {/* Title on Image */}
        <div
          className={`absolute bottom-6 ${
            isRTL ? "right-6 left-6" : "left-6 right-6"
          }`}
        >
          <h3 className="text-white font-bold text-lg md:text-xl leading-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Features List */}
        <div className="space-y-2 mb-4">
          {features.map((feature, featureIndex) => (
            <div
              key={featureIndex}
              className={`flex items-center gap-3 ${
                isRTL ? "justify-start" : "justify-start"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} flex-shrink-0`}
              ></div>
              <span className="text-[#004D5A]/70 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          className={`w-full bg-gradient-to-r ${color} hover:shadow-lg text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform group-hover:scale-105`}
        >
          {t("customerCard.learnMore")}
        </button>
      </div>
    </div>
  );
}
