"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import "./styles/rtl.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const isRTL = i18n.language === "ar";

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تطبيق اتجاه الصفحة و اللغة
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;

    if (isRTL) {
      document.documentElement.classList.add("rtl");
      document.documentElement.classList.remove("ltr");
    } else {
      document.documentElement.classList.add("ltr");
      document.documentElement.classList.remove("rtl");
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isRTL, i18n.language, isDark]);

  // التحقق من الصلاحيات
  useEffect(() => {
    const isAuthenticated = true; // Replace with actual auth check
    const isAdmin = true; // Replace with actual role check

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      router.push("/unauthorized");
      return;
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-[#CFF7EE]"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex h-screen overflow-hidden ${
          isRTL ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader onToggleSidebar={toggleSidebar} />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div
              className={`max-w-7xl mx-auto ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
