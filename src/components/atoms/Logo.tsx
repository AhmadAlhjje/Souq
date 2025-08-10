import React from 'react';
import { useTranslation } from "react-i18next";
import useTheme from "../../hooks/useTheme";

const Logo: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="flex items-center space-x-reverse space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700' 
              : 'bg-gradient-to-br from-[#004D5A] to-[#006B7A]'
          }`}>
            <span className="text-white font-bold text-lg">ت</span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-bold text-xl leading-tight transition-colors duration-300 ${
              isDark ? 'text-emerald-100' : 'text-[#004D5A]'
            }`}>
              {t("brand_name")}
            </div>
            <div className={`text-xs font-medium transition-colors duration-300 ${
              isDark ? 'text-emerald-200/70' : 'text-[#004D5A]/70'
            }`}>
              {t("brand_sub")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;