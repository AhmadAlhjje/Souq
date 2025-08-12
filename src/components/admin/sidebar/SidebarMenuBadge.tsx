"use client";

import React from "react";

interface SidebarMenuBadgeProps {
  badge: number | string;
  isActive: boolean;
}

const SidebarMenuBadge: React.FC<SidebarMenuBadgeProps> = ({ badge, isActive }) => {
  return (
    <span
      className={`
        px-2 py-1 text-xs font-bold rounded-full min-w-[20px] text-center
        ${isActive ? "bg-white text-[#004D5A]" : "bg-[#5CA9B5] text-white"}
      `}
    >
      {badge}
    </span>
  );
};

export default SidebarMenuBadge;