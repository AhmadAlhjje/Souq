"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
        isDark
          ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      }`}
      title={isDark ? t("light_mode") : t("dark_mode")}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;