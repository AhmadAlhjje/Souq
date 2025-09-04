"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuBadge from "./SidebarMenuBadge";
import { useAuth } from "@/api/api"; // استيراد الـ hook

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
  const { handleLogout, isLoggingOut } = useAuth();

  const handleClick = () => {
    // التحقق من إذا كان العنصر هو تسجيل الخروج
    if (item.id === 'logout') {
      handleLogout();
      return;
    }

    if (hasChildren) {
      onToggleExpanded(item.id);
    } else {
      onItemClick();
    }
  };

  const menuContent = (
    <div className="flex items-center flex-1 gap-3">
      <item.icon size={18} />
      <span className={`${!isOpen && "hidden"} lg:block truncate`}>
        {item.id === 'logout' && isLoggingOut ? 'جاري تسجيل الخروج...' : item.label}
      </span>
      {item.badge && <SidebarMenuBadge badge={item.badge} isActive={isActive} />}
    </div>
  );

  if (hasChildren) {
    return (
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
    <div 
      className="flex items-center flex-1 gap-3 cursor-pointer" 
      onClick={handleClick}
      style={{ opacity: isLoggingOut && item.id === 'logout' ? 0.7 : 1 }}
    >
      <item.icon size={18} />
      <span className={`${!isOpen && "hidden"} lg:block truncate`}>
        {item.id === 'logout' && isLoggingOut ? 'جاري تسجيل الخروج...' : item.label}
      </span>
      {item.badge && <SidebarMenuBadge badge={item.badge} isActive={isActive} />}
    </div>
  );
};

export default SidebarMenuContent;