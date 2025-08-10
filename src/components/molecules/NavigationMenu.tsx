import React from 'react';
import { useTranslation } from "react-i18next";
import NavLink from "../atoms/NavLink";

const NavigationMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex items-center space-x-reverse space-x-8">
      <NavLink href="/" className="nav-link-enhanced">{t("home")}</NavLink>
      <NavLink href="/about" className="nav-link-enhanced">{t("about")}</NavLink>
      <NavLink href="/Stores" className="nav-link-enhanced">{t("stores")}</NavLink>
      <NavLink href="/contact" className="nav-link-enhanced">{t("contact")}</NavLink>
    </div>
  );
};

export default NavigationMenu;