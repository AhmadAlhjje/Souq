"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuBadge from "./SidebarMenuBadge";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { logout } from "@/api/api";
import { useTranslation } from "react-i18next";

interface SidebarMenuContentProps {
  item: SidebarMenuItem;
  isActive: boolean;
  isExpanded: boolean;
  isOpen: boolean;
  hasChildren: boolean;
  onToggleExpanded: (itemId: string) => void;
  onItemClick: () => void;
}

const SidebarMenuContent: React.FC<SidebarMenuContentProps> = ({
  item,
  isActive,
  isExpanded,
  isOpen,
  hasChildren,
  onToggleExpanded,
  onItemClick,
}) => {
  const { t } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClick = () => {
    // التحقق من إذا كان العنصر هو تسجيل الخروج
    if (item.id === 'logout') {
      setShowLogoutConfirm(true);
      return;
    }

    if (hasChildren) {
      onToggleExpanded(item.id);
    } else {
      onItemClick();
    }
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

  const menuContent = (
    <div className="flex items-center flex-1 gap-3">
      {item.id === 'logout' && isLoggingOut ? (
        <div className="animate-spin">
          <item.icon size={18} />
        </div>
      ) : (
        <item.icon size={18} />
      )}
      <span className={`${!isOpen && "hidden"} lg:block truncate`}>
        {item.id === 'logout' && isLoggingOut ? 'جاري تسجيل الخروج...' : item.label}
      </span>
      {item.badge && <SidebarMenuBadge badge={item.badge} isActive={isActive} />}
    </div>
  );

  if (hasChildren) {
    return (
      <>
        <div className="flex items-center justify-between w-full" onClick={handleClick}>
          {menuContent}
          {isOpen && (
            <div
              className={`p-1 rounded-md transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </>
    );
  }

  // للعناصر التي لها href وليست تسجيل خروج
  if (item.href && item.id !== 'logout') {
    return (
      <Link href={item.href} className="flex items-center flex-1 gap-3" onClick={onItemClick}>
        <item.icon size={18} />
        <span className={`${!isOpen && "hidden"} lg:block truncate`}>
          {item.label}
        </span>
        {item.badge && <SidebarMenuBadge badge={item.badge} isActive={isActive} />}
      </Link>
    );
  }

  // لتسجيل الخروج أو العناصر الأخرى بدون href
  return (
    <>
      <div 
        className={`flex items-center flex-1 gap-3 cursor-pointer transition-opacity ${
          isLoggingOut && item.id === 'logout' ? 'opacity-60 pointer-events-none' : ''
        }`}
        onClick={handleClick}
      >
        {menuContent}
      </div>

      {/* Logout Confirmation Dialog */}
      {item.id === 'logout' && (
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
      )}
    </>
  );
};

export default SidebarMenuContent;