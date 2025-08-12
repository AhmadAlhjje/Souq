"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

interface SidebarHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  isOpen: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  isOpen,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`p-6 border-b ${isDark ? "border-gray-700" : "border-[#96EDD9]"}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isDark ? "bg-blue-600" : "bg-[#004D5A]"}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`${!isOpen && "hidden"} lg:block`}>
          <h2 className={`font-bold text-lg ${isDark ? "text-white" : "text-[#004D5A]"}`}>
            {title}
          </h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;