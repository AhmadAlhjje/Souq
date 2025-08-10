import { useTranslation as useI18nTranslation } from "react-i18next";
import { changeLanguage, getCurrentLanguageInfo, getAvailableLanguages } from "../i18n";

const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const handleChangeLanguage = (langCode: string) => {
    changeLanguage(langCode);
  };

  const currentLanguage = getCurrentLanguageInfo();
  const availableLanguages = getAvailableLanguages();

  return { 
    t, 
    changeLanguage: handleChangeLanguage,
    currentLanguage,
    availableLanguages,
    isRTL: currentLanguage.isRTL,
    language: i18n.language,
  };
};

export default useTranslation;