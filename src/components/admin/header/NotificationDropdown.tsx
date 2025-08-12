"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { AdminNotification } from "@/types/admin";

interface NotificationDropdownProps {
  notifications: AdminNotification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  isRTL: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  showNotifications,
  setShowNotifications,
  isRTL,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowNotifications]);

  const getNotificationIcon = (type: AdminNotification["type"]) => {
    const iconClass = "w-3 h-3";
    switch (type) {
      case "success":
        return <div className={`${iconClass} bg-green-500 rounded-full`} />;
      case "warning":
        return <div className={`${iconClass} bg-yellow-500 rounded-full`} />;
      case "error":
        return <div className={`${iconClass} bg-red-500 rounded-full`} />;
      default:
        return <div className={`${iconClass} bg-blue-500 rounded-full`} />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return t("now");
    if (minutes < 60)
      return isRTL ? `${minutes} ${t("minutes")}` : `${minutes} ${t("minutes")}`;
    if (minutes < 1440)
      return isRTL
        ? `${Math.floor(minutes / 60)} ${t("hours")}`
        : `${Math.floor(minutes / 60)} ${t("hours")}`;
    return isRTL
      ? `${Math.floor(minutes / 1440)} ${t("days")}`
      : `${Math.floor(minutes / 1440)} ${t("days")}`;
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative w-10 h-10 rounded-full transition-colors flex items-center justify-center ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="p-4">
              <h3
                className={`font-semibold mb-3 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {t("notifications")} ({unreadCount} {t("unread")})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.isRead
                        ? isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                        : isDark
                        ? "bg-gray-600 border-gray-500"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            isDark ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`mt-3 pt-3 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <button
                  className={`text-sm w-full text-center py-2 rounded-lg transition-colors ${
                    isDark
                      ? "text-blue-400 hover:bg-gray-700"
                      : "text-teal-600 hover:bg-gray-50"
                  }`}
                >
                  {t("view_all_notifications")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;