"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface AuthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
      <button
        onClick={() => setActiveTab("login")}
        className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          activeTab === "login"
            ? "bg-teal-400 text-white"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        {t("authTabs.login")}
      </button>
      <button
        onClick={() => setActiveTab("register")}
        className={`flex-1 py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
          activeTab === "register"
            ? "bg-teal-400 text-white"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        {t("authTabs.register")}
      </button>
    </div>
  );
};

export default AuthTabs;
