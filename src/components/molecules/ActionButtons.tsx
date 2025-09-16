import React from 'react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";

const ActionButtons: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <Link
        href="/LoginPage"
        className={`px-5 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block text-center font-medium whitespace-nowrap shadow-sm ${
          isDark
            ? 'bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
            : 'bg-[#004D5A] text-white border border-[#004D5A] hover:bg-[#013f4a]  hover:text-white focus:ring-blue-500'
        }`}
        prefetch={true}
      >
        {t("create_store_free")}
      </Link>
      <Link
        href="/LoginPage"
        className={`px-4 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block text-center font-medium whitespace-nowrap shadow-sm ${
          isDark
            ? 'bg-transparent text-emerald-300 border border-emerald-600 hover:bg-emerald-600 hover:text-white focus:ring-emerald-500'
            : 'bg-transparent text-[#004D5A] border border-[#004D5A] hover:bg-[#004D5A]  hover:text-white focus:ring-blue-500'
        }`}
        prefetch={true}
      >
        {t("login")}
      </Link>
    </div>
  );
};

export default ActionButtons;