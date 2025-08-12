"use client";

import React from "react";
import { Globe } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

const LanguageToggle: React.FC = () => {
  const { isDark } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const language = i18n.language || "ar";
    if (language === "ar") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ar");
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
        isDark
          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      }`}
      title={t("change_language")}
    >
      <Globe size={18} />
    </button>
  );
};

export default LanguageToggle;