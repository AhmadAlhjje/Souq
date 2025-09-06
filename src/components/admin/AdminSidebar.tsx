// components/admin/AdminSidebar.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { useLogout } from "@/hooks/useLogout";
import { SidebarConfig } from "@/types/admin";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarMenu from "./sidebar/SidebarMenu";
import { getAdminSidebarConfig } from "@/data/sidebarConfigs";
import LoadingSpinner from "@/components/ui/LoadingSpinner"; // تأكد من المسار الصحيح

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  config?: SidebarConfig; // جعل config اختياري
  className?: string;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  config,
  className = "",
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { handleLogout, isLoggingOut } = useLogout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // إنشاء config افتراضي إذا لم يتم تمريره
  const sidebarConfig = config || getAdminSidebarConfig(t);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId?: string) => {
    // إذا كان العنصر المنقور هو تسجيل الخروج
    if (itemId === 'logout') {
      handleLogout();
      return;
    }
    
    // إغلاق الشريط الجانبي على الأجهزة المحمولة
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  // عرض شاشة التحميل عند تسجيل الخروج
  if (isLoggingOut) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="🚪 جاري تسجيل الخروج... نراك قريباً!"
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed top-0 right-0 z-40 h-full overflow-hidden
          ${isDark ? "bg-gray-900 border-l border-gray-700" : "bg-white border-l border-[#96EDD9]"}
          lg:relative lg:z-10 lg:opacity-100
          shadow-xl lg:shadow-none
          ${className}
        `}
        style={{
          width: isOpen ? 280 : 0,
          minWidth: isOpen ? 280 : 0,
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <SidebarHeader
            title={sidebarConfig.header.title}
            subtitle={sidebarConfig.header.subtitle}
            icon={sidebarConfig.header.icon}
            isOpen={isOpen}
          />

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <SidebarMenu
              items={sidebarConfig.mainMenuItems}
              isOpen={isOpen}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onItemClick={handleItemClick}
            />
          </div>

          {/* Bottom Menu */}
          <div className={`border-t p-3 ${isDark ? "border-gray-700" : "border-[#96EDD9]"}`}>
            <SidebarMenu
              items={sidebarConfig.bottomMenuItems}
              isOpen={isOpen}
              expandedItems={expandedItems}
              onToggleExpanded={toggleExpanded}
              onItemClick={handleItemClick}
              className="space-y-2"
            />
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;