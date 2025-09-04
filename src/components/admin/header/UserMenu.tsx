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
  Store,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useStore } from "@/contexts/StoreContext";
import { getStoreById } from "@/api/stores";
import { logout } from "@/api/api";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";

interface UserMenuProps {
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
}

interface StoreData {
  store_name: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({
  showUserMenu,
  setShowUserMenu,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { storeId, isLoaded } = useStore();
  
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // جلب بيانات المتجر عند تحميل المكون أو تغيير storeId
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId || !isLoaded) return;
      
      try {
        setLoading(true);
        const data = await getStoreById(storeId);
        setStoreData(data);
      } catch (error) {
        console.error('Error fetching store data:', error);
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setShowUserMenu(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const menuItems = [
    { icon: User, label: t("profile"), href: "/admin/dashboard/profile" },
    // { icon: Settings, label: t("settings"), href: "/admin/settings" },
    // { icon: MessageSquare, label: t("messages"), href: "/admin/messages" },
    // { icon: HelpCircle, label: t("help"), href: "/admin/help" },
  ];

  return (
    <>
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
              className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg border z-50 ${
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
                {loading ? (
                  <div className="animate-pulse">
                    <div className={`h-4 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                    <div className={`h-3 rounded w-3/4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                  </div>
                ) : storeData ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
                      <p
                        className={`font-medium text-sm ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {storeData.User.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Store size={14} className={isDark ? "text-gray-400" : "text-gray-500"} />
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {storeData.store_name}
                      </p>
                    </div>
                    {storeData.User.whatsapp_number && (
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {storeData.User.whatsapp_number}
                      </p>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {/* عناصر القائمة */}
              <div className="py-2">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowUserMenu(false)}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                      isDark
                        ? "text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </a>
                ))}
              </div>

              {/* تسجيل الخروج */}
              <div
                className={`border-t py-2 ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  onClick={handleLogoutClick}
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

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد من رغبتك في تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك."
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        type="warning"
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default UserMenu;