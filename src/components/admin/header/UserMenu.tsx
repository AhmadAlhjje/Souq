"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  ChevronDown,
  Settings,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks/useLogout";
import { useStore } from "@/contexts/StoreContext";
import { getStoreById } from "@/api/stores";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserMenuProps {
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
}

interface StoreData {
  id: number;
  store_name: string;
  User?: {
    username: string;
    email?: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({
  showUserMenu,
  setShowUserMenu,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { handleLogout, isLoggingOut } = useLogout();
  const { storeId, isLoaded } = useStore();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState("");

  // رسائل التحميل للتنقل
  const navigationMessages = {
    profile: "جاري تحميل الملف الشخصي...",
    help: "جاري فتح صفحة المساعدة...",
    settings: "جاري تحميل الإعدادات...",
    messages: "جاري تحميل الرسائل..."
  };

  // جلب بيانات المتجر
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId || !isLoaded) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getStoreById(storeId);
        console.log("Store data for UserMenu:", response);
        setStoreData(response);
      } catch (error) {
        console.error("Error fetching store data for UserMenu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, isLoaded]);

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

  const handleNavigation = async (path: string, messageKey: keyof typeof navigationMessages) => {
    setShowUserMenu(false);
    setNavigating(true);
    setNavigationMessage(navigationMessages[messageKey]);
    
    // تأخير صغير لإظهار التحميل
    await new Promise(resolve => setTimeout(resolve, 800));
    
    router.push(path);
    setNavigating(false);
  };

  const menuItems = [
    { 
      icon: User, 
      label: t("profile") || "الملف الشخصي", 
      onClick: () => handleNavigation("/admin/dashboard/profile", "profile")
    },
    // { 
    //   icon: Settings, 
    //   label: t("settings") || "الإعدادات", 
    //   onClick: () => handleNavigation("/admin/dashboard/settings", "settings")
    // },
    // { 
    //   icon: MessageSquare, 
    //   label: t("messages") || "الرسائل", 
    //   onClick: () => handleNavigation("/admin/dashboard/messages", "messages")
    // },
    { 
      icon: HelpCircle, 
      label: t("help") || "مساعدة", 
      onClick: () => handleNavigation("/admin/dashboard/help", "help")
    },
  ];

  // الحصول على اسم المستخدم واسم المتجر
  const getUserName = () => {
    if (loading) return "...";
    return storeData?.User?.username;
  };

  const getStoreName = () => {
    if (loading) return "...";
    return storeData?.store_name;
  };

  // عرض شاشة التحميل عند تسجيل الخروج
  if (isLoggingOut) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="جاري تسجيل الخروج... شكراً لك!"
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

  // عرض شاشة التحميل عند التنقل
  if (navigating) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message={navigationMessage}
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

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
            {/* معلومات المستخدم والمتجر */}
            <div
              className={`p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                <p
                  className={`font-medium ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {getUserName()}
                </p>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {getStoreName()}
              </p>
            </div>

            {/* عناصر القائمة */}
            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  disabled={navigating}
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

            {/* زر تسجيل الخروج */}
            <div
              className={`border-t py-2 ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                disabled={isLoggingOut || navigating}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                  isDark
                    ? "text-red-400 hover:bg-gray-700 disabled:opacity-50"
                    : "text-red-600 hover:bg-gray-50 disabled:opacity-50"
                } ${(isLoggingOut || navigating) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <LogOut size={16} />
                {t("logout") || "تسجيل الخروج"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;