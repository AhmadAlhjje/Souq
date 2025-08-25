"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import useTheme from "@/hooks/useTheme";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuContent from "./SidebarMenuContent";

interface SidebarMenuItemProps {
  item: SidebarMenuItem;
  level?: number;
  isOpen: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
  onItemClick: () => void;
}

const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({
  item,
  level = 0,
  isOpen,
  expandedItems,
  onToggleExpanded,
  onItemClick,
}) => {
  const { isDark } = useTheme();
  const pathname = usePathname();

  const isActiveRoute = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isActive = item.href ? isActiveRoute(item.href) : false;
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  
  return (
    <div className="w-full">
      <div
        className={`
          flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
          ${level > 0 ? "mr-4" : ""}
          ${
            isActive
              ? item.id === "dashboard"
                ? isDark
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-[#004D5A] text-white shadow-lg"
                : "bg-teal-500 text-white shadow-lg"
              : isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-[#004D5A] hover:bg-[#CFF7EE] hover:text-[#004D5A]"
          }
        `}
      >
        <SidebarMenuContent
          item={item}
          isActive={isActive}
          isExpanded={isExpanded}
          isOpen={isOpen}
          hasChildren={hasChildren}
          onToggleExpanded={onToggleExpanded}
          onItemClick={onItemClick}
        />
      </div>

      {/* Sub Menu */}
      <AnimatePresence>
        {hasChildren && isExpanded && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {item.children?.map((child) => (
                <SidebarMenuItemComponent
                  key={child.id}
                  item={child}
                  level={level + 1}
                  isOpen={isOpen}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                  onItemClick={onItemClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarMenuItemComponent;