import React from 'react';
import Link from 'next/link';
import { useTranslation } from "react-i18next";

const ActionButtons: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`flex ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <Link
        href="/LoginPage"
        className="bg-[#004D5A] text-white border border-[#004D5A] hover:bg-blue-500 hover:text-white px-5 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block text-center font-medium whitespace-nowrap"
        prefetch={true}
      >
        {t("create_store_free")}
      </Link>
      <Link
        href="/LoginPage"
        className="bg-transparent text-[#004D5A] border border-[#004D5A] hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block text-center font-medium whitespace-nowrap"
        prefetch={true}
      >
        {t("login")}
      </Link>
    </div>
  );
};

export default ActionButtons;