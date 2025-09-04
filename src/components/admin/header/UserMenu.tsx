"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ChevronDown,
  Settings,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

interface UserMenuProps {
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  showUserMenu,
  setShowUserMenu,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUserMenu]);

  const menuItems = [
    { icon: User, label: t("profile"), href: "/admin/profile" },
    // { icon: Settings, label: t("settings"), href: "/admin/settings" },
    // { icon: MessageSquare, label: t("messages"), href: "/admin/messages" },
    // { icon: HelpCircle, label: t("help"), href: "/admin/help" },
  ];

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center gap-2 transition-colors ${
          isDark
            ? "text-gray-300 hover:text-gray-100"
            : "text-gray-700 hover:text-gray-900"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDark ? "bg-teal-600" : "bg-teal-500"
          }`}
        >
          <User size={18} className="text-white" />
        </div>
        <ChevronDown
          size={16}
          className={`${isDark ? "text-gray-400" : "text-gray-400"}`}
        />
      </button>

      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={`font-medium ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t("admin_name")}
              </p>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("store_manager")}
              </p>
            </div>

            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                    isDark
                      ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>

            <div
              className={`border-t py-2 ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  isDark
                    ? "text-red-400 hover:bg-gray-700"
                    : "text-red-600 hover:bg-gray-50"
                }`}
              >
                <LogOut size={16} />
                {t("logout")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;