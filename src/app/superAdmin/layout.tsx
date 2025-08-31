"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import useTheme from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { getSuperAdminSidebarConfig } from "@/data/sidebarConfigsSuper";
import "../admin/styles/rtl.css";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const { i18n, t } = useTranslation();
  const router = useRouter();

  const isRTL = i18n.language === "ar";

  // الحصول على config لوحة تحكم المعلمين
  const teacherSidebarConfig = getSuperAdminSidebarConfig(t);

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

  // التحقق من الصلاحيات - منطق مختلف للمعلمين
  useEffect(() => {
    const isAuthenticated = true; // Replace with actual auth check
    const isTeacher = true; // Replace with actual teacher role check

    if (!isAuthenticated) {
      router.push("/teacher/login");
      return;
    }

    if (!isTeacher) {
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
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
          config={teacherSidebarConfig} // تمرير config خاص بالمعلمين
        />

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

export default TeacherLayout;