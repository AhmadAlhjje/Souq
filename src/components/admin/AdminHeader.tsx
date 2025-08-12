"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import { AdminNotification } from "@/types/admin";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onToggleSidebar, 
  title 
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { 
    t, 
    changeLanguage, 
    currentLanguage, 
    availableLanguages, 
    isRTL,
    setArabic,
    setEnglish,
    isInitialized 
  } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // استخدام الترجمة للعنوان الافتراضي
  const displayTitle = title || t('dashboard');

  // Mock notifications data with translation
  const [notifications] = useState<AdminNotification[]>([
    {
      id: "1",
      title: t('new_order'),
      message: t('new_order_message'),
      type: "info",
      isRead: false,
      createdAt: new Date(),
      actionUrl: "/admin/orders/123",
    },
    {
      id: "2", 
      title: t('low_stock'),
      message: t('low_stock_message'),
      type: "warning",
      isRead: false,
      createdAt: new Date(),
      actionUrl: "/admin/products/456",
    },
    {
      id: "3",
      title: t('payment_completed'),
      message: t('payment_completed_message'),
      type: "success",
      isRead: true,
      createdAt: new Date(),
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تبديل اللغة
  const toggleLanguage = () => {
    if (currentLanguage.code === 'ar') {
      setEnglish();
    } else {
      setArabic();
    }
  };

  const getNotificationIcon = (type: AdminNotification['type']) => {
    const iconClass = "w-3 h-3";
    switch (type) {
      case 'success': return <div className={`${iconClass} bg-green-500 rounded-full`} />;
      case 'warning': return <div className={`${iconClass} bg-yellow-500 rounded-full`} />;
      case 'error': return <div className={`${iconClass} bg-red-500 rounded-full`} />;
      default: return <div className={`${iconClass} bg-blue-500 rounded-full`} />;
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t('now');
    if (minutes < 60) return isRTL ? `${minutes} ${t('minutes')}` : `${minutes} ${t('minutes')}`;
    if (minutes < 1440) return isRTL ? `${Math.floor(minutes / 60)} ${t('hours')}` : `${Math.floor(minutes / 60)} ${t('hours')}`;
    return isRTL ? `${Math.floor(minutes / 1440)} ${t('days')}` : `${Math.floor(minutes / 1440)} ${t('days')}`;
  };

  // عدم عرض المحتوى قبل تهيئة الترجمة لتجنب الوميض
  if (!isInitialized) {
    return (
      <header className={`
        h-16 border-b transition-all duration-200
        ${isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-[#96EDD9]'
        }
      `}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">
            <div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`
        h-16 border-b transition-all duration-200
        ${isDark 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white border-[#96EDD9]'
        }
      `}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left/Right Section based on RTL */}
        <div className={`flex items-center gap-4 ${isRTL ? 'order-1' : 'order-0'}`}>
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className={`
              p-2 rounded-lg transition-colors lg:hidden
              ${isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-[#CFF7EE] text-[#004D5A]'
              }
            `}
          >
            <Menu size={20} />
          </button>

          {/* Title */}
          <div>
            <h1 className={`
              text-lg font-semibold
              ${isDark ? 'text-white' : 'text-[#004D5A]'}
            `}>
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className={`
              absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4
              ${isDark ? 'text-gray-400' : 'text-[#5CA9B5]'}
            `} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className={`
                w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-lg border transition-colors
                ${isDark 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-[#CFF7EE] border-[#96EDD9] text-[#004D5A] placeholder-[#5CA9B5] focus:border-[#004D5A]'
                }
                focus:outline-none focus:ring-2 focus:ring-[#96EDD9]/30
              `}
            />
          </div>
        </div>

        {/* Right/Left Section based on RTL */}
        <div className={`flex items-center gap-2 ${isRTL ? 'order-0' : 'order-1'}`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`
              p-2 rounded-lg transition-colors
              ${isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-[#96EDD9] text-[#004D5A]'
              }
            `}
            title={isDark ? t('light_mode') : t('dark_mode')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`
              p-2 rounded-lg transition-colors relative
              ${isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-[#96EDD9] text-[#004D5A]'
              }
            `}
            title={t('change_language')}
          >
            <Globe size={18} />
            <span className="absolute -bottom-1 -right-1 text-xs font-bold bg-[#5CA9B5] text-white rounded-full w-4 h-4 flex items-center justify-center">
              {currentLanguage.code.toUpperCase()}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`
                relative p-2 rounded-lg transition-colors
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-[#96EDD9] text-[#004D5A]'
                }
              `}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className={`
                  absolute -top-1 ${isRTL ? '-right-1' : '-left-1'} bg-[#5CA9B5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center
                `}>
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
                  className={`
                    absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-80 rounded-lg shadow-lg border z-50
                    ${isDark 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-[#96EDD9]'
                    }
                  `}
                >
                  <div className="p-4">
                    <h3 className={`font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-[#004D5A]'
                    }`}>
                      {t('notifications')} ({unreadCount} {t('unread')})
                    </h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`
                            p-3 rounded-lg border cursor-pointer transition-colors
                            ${notification.isRead 
                              ? isDark ? 'bg-gray-700 border-gray-600' : 'bg-[#CFF7EE] border-[#96EDD9]'
                              : isDark ? 'bg-gray-600 border-gray-500' : 'bg-[#BAF3E6] border-[#95EDD8]'
                            }
                          `}
                        >
                          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${
                                isDark ? 'text-white' : 'text-[#004D5A]'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-1 ${
                                isDark ? 'text-gray-300' : 'text-[#666666]'
                              }`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 ${
                                isDark ? 'text-gray-400' : 'text-[#5CA9B5]'
                              }`}>
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#96EDD9] dark:border-gray-600">
                      <button className={`
                        text-sm w-full text-center py-2 rounded-lg transition-colors
                        ${isDark 
                          ? 'text-blue-400 hover:bg-gray-700' 
                          : 'text-[#004D5A] hover:bg-[#CFF7EE]'
                        }
                      `}>
                        {t('view_all_notifications')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu - Modified positioning */}
          <div className={`relative ${!isRTL ? '-ml-4' : ''}`} ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`
                flex items-center gap-2 p-2 rounded-lg transition-colors
                ${isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-[#96EDD9] text-[#004D5A]'
                }
              `}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#004D5A] to-[#5CA9B5] flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <ChevronDown size={14} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`
                    absolute mt-2 w-56 rounded-lg shadow-lg border z-50
                    ${isRTL ? 'right-0' : '-right-8'}
                    ${isDark 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-[#96EDD9]'
                    }
                  `}
                >
                  <div className="p-4 border-b border-[#96EDD9] dark:border-gray-600">
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-[#004D5A]'
                    }`}>
                      {t('admin_name')}
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-[#666666]'
                    }`}>
                      {t('store_manager')}
                    </p>
                  </div>
                  
                  <div className="py-2">
                    {[
                      { icon: User, label: t('profile'), href: "/admin/profile" },
                      { icon: Settings, label: t('settings'), href: "/admin/settings" },
                      { icon: MessageSquare, label: t('messages'), href: "/admin/messages" },
                      { icon: HelpCircle, label: t('help'), href: "/admin/help" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className={`
                          flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors
                          ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}
                          ${isDark 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-[#004D5A] hover:bg-[#CFF7EE] hover:text-[#004D5A]'
                          }
                        `}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#96EDD9] dark:border-gray-600 py-2">
                    <button className={`
                      flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors
                      ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}
                      ${isDark 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-[#5CA9B5] hover:bg-[#CFF7EE]'
                      }
                    `}>
                      <LogOut size={16} />
                      {t('logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;