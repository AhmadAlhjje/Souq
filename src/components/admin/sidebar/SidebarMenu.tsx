"use client";

import React from "react";
import { SidebarMenuItem } from "@/types/admin";
import SidebarMenuItemComponent from "./SidebarMenuItemComponent";

interface SidebarMenuProps {
  items: SidebarMenuItem[];
  isOpen: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
  onItemClick: () => void;
  className?: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  isOpen,
  expandedItems,
  onToggleExpanded,
  onItemClick,
  className = "",
}) => {
  return (
    <nav className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <SidebarMenuItemComponent
          key={item.id}
          item={item}
          isOpen={isOpen}
          expandedItems={expandedItems}
          onToggleExpanded={onToggleExpanded}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default SidebarMenu;