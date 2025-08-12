"use client";

import React from "react";
import Section from "../molecules/Section";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";
import { useTranslation } from "react-i18next";

export default function JoinUsSection() {
  const { t, i18n } = useTranslation();

  // تحديد اتجاه النص بناءً على اللغة الحالية
  const isRTL = i18n.language === "ar" || i18n.language === "he"; // عدل حسب اللغات التي تستخدم RTL

  return (
    <Section
      className="py-16 px-6 bg-gradient-to-r from-[#004D5A]/5 to-[#96EDD9]/5"
      background="gradient-light"
    >
      <div className="max-w-6xl mx-auto text-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-lg border border-[#004D5A]/10">
          <Heading
            text={t("joinUs.heading")}
            level={2}
            variant="cta"
            className={`text-2xl md:text-3xl font-bold text-[#004D5A] leading-tight mb-8 ${
              isRTL ? "text-right" : "text-left"
            }`}
          />

          {/* Stats */}
          <div className="flex justify-center">
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse space-x-8" : "space-x-8"
              }`}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#004D5A] to-[#005965] rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Text
                    text={t("joinUs.stats.traders.value")}
                    variant="counter"
                    className="text-white font-bold text-lg"
                  />
                </div>
                <Text
                  text={t("joinUs.stats.traders.label")}
                  variant="caption"
                  className="text-[#004D5A]/70 text-sm font-medium"
                />
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#96EDD9] to-[#7dd3bf] rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Text
                    text={t("joinUs.stats.success.value")}
                    variant="counter"
                    className="text-[#004D5A] font-bold text-lg"
                  />
                </div>
                <Text
                  text={t("joinUs.stats.success.label")}
                  variant="caption"
                  className="text-[#004D5A]/70 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
