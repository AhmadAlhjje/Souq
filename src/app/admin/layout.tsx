"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import useTheme from "@/hooks/useTheme";
import useTranslation from "@/hooks/useTranslation";
import "./styles/rtl.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  const { isRTL, isInitialized, currentLanguage } = useTranslation();
  const router = useRouter();

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // تطبيق اتجاه الصفحة على العنصر الجذر
  useEffect(() => {
    if (isInitialized && typeof document !== 'undefined') {
      // تطبيق الاتجاه على الـ HTML element
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage.code;
      
      // إضافة أو إزالة كلاسات CSS للاتجاه
      if (isRTL) {
        document.documentElement.classList.add('rtl');
        document.documentElement.classList.remove('ltr');
      } else {
        document.documentElement.classList.add('ltr');
        document.documentElement.classList.remove('rtl');
      }
      
      // إضافة كلاس للـ dark mode إذا لزم الأمر
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isRTL, isInitialized, currentLanguage.code, isDark]);

  // Mock authentication check - replace with real auth logic
  useEffect(() => {
    const isAuthenticated = true; // Replace with actual auth check
    const isAdmin = true; // Replace with actual role check

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isAdmin) {
      router.push('/unauthorized');
      return;
    }
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // عرض شاشة تحميل أثناء تهيئة الترجمة
  if (!isInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-[#CFF7EE]'
      }`}>
        <div className="flex flex-col items-center gap-4">
          {/* شاشة تحميل جميلة */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#96EDD9] border-t-[#004D5A] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-[#5CA9B5] rounded-full animate-pulse"></div>
          </div>
          <div className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-[#004D5A]'
          }`}>
            جاري التحميل...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-[#CFF7EE]'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={`flex h-screen overflow-hidden ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Sidebar - موضعه يتغير حسب اللغة */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader onToggleSidebar={toggleSidebar} />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className={`max-w-7xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;