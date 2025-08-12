"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuBadge from "./SidebarMenuBadge";

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
  const handleClick = () => {
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
        {item.label}
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

  if (item.href) {
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

  return menuContent;
};

export default SidebarMenuContent;