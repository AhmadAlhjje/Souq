"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Store,
  BarChart3,
  Bell,
  Tag,
  Truck,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next"; // استيراد react-i18next
import useTheme from "@/hooks/useTheme";
import { SidebarMenuItem } from "@/types/admin";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation();  // استخدم الـ hook من react-i18next
  const { isDark } = useTheme();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const menuItems: SidebarMenuItem[] = [
    {
      id: "dashboard",
      label: t("dashboard"),  // استخدم مفتاح الترجمة بدل النص الثابت
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: t("products"),
      icon: Package,
      href: "/admin/products",
      children: [
        {
          id: "all-products",
          label: t("all_products"),
          icon: Package,
          href: "/admin/products",
        },
        {
          id: "add-product",
          label: t("add_product"),
          icon: Package,
          href: "/admin/products/add",
        },
        {
          id: "categories",
          label: t("categories"),
          icon: Tag,
          href: "/admin/products/categories",
        },
      ],
    },
    {
      id: "orders",
      label: t("orders"),
      icon: ShoppingCart,
      href: "/admin/orders",
      badge: 5,
    },
    {
      id: "customers",
      label: t("customers"),
      icon: Users,
      href: "/admin/customers",
    },
    {
      id: "analytics",
      label: t("analytics"),
      icon: BarChart3,
      href: "/admin/analytics",
      children: [
        {
          id: "sales-report",
          label: t("sales_report"),
          icon: BarChart3,
          href: "/admin/analytics/sales",
        },
        {
          id: "products-report",
          label: t("products_report"),
          icon: Package,
          href: "/admin/analytics/products",
        },
      ],
    },
    {
      id: "shipping",
      label: t("shipping"),
      icon: Truck,
      href: "/admin/shipping",
    },
    {
      id: "payments",
      label: t("payments"),
      icon: CreditCard,
      href: "/admin/payments",
    },
    {
      id: "store",
      label: t("store_settings"),
      icon: Store,
      href: "/admin/store",
    },
    {
      id: "settings",
      label: t("settings"),
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const bottomMenuItems = [
    {
      id: "notifications",
      label: t("notifications"),
      icon: Bell,
      href: "/admin/notifications",
      badge: 3,
    },
    {
      id: "help",
      label: t("help"),
      icon: HelpCircle,
      href: "/admin/help",
    },
    {
      id: "logout",
      label: t("logout"),
      icon: LogOut,
      href: "/logout",
    },
  ];

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderMenuItem = (item: SidebarMenuItem, level = 0) => {
    const isActive = isActiveRoute(item.href);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
            ${level > 0 ? "mr-4" : ""}
            ${isActive
              ? isDark
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-[#004D5A] text-white shadow-lg"
              : isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-[#004D5A] hover:bg-[#CFF7EE] hover:text-[#004D5A]"
            }
          `}
        >
          <Link
            href={item.href}
            className="flex items-center flex-1 gap-3"
            onClick={() => {
              if (window.innerWidth < 768) {
                onToggle();
              }
            }}
          >
            <item.icon size={18} />
            <span className={`${!isOpen && "hidden"} lg:block truncate`}>
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`
                px-2 py-1 text-xs font-bold rounded-full min-w-[20px] text-center
                ${isActive ? "bg-white text-[#004D5A]" : "bg-[#5CA9B5] text-white"}
              `}
              >
                {item.badge}
              </span>
            )}
          </Link>

          {hasChildren && isOpen && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className={`p-1 rounded-md transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <ChevronRight size={16} />
            </button>
          )}
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
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed top-0 right-0 z-40 h-full overflow-hidden
          ${isDark ? "bg-gray-900 border-l border-gray-700" : "bg-white border-l border-[#96EDD9]"}
          lg:relative lg:z-10 lg:opacity-100
          shadow-xl lg:shadow-none
        `}
        style={{
          width: isOpen ? 280 : 0,
          minWidth: isOpen ? 280 : 0,
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div
            className={`p-6 border-b ${isDark ? "border-gray-700" : "border-[#96EDD9]"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-blue-600" : "bg-[#004D5A]"}`}>
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className={`${!isOpen && "hidden"} lg:block`}>
                <h2
                  className={`font-bold text-lg ${isDark ? "text-white" : "text-[#004D5A]"}`}
                >
                  {t("dashboard")}
                </h2>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
                  {t("store_management")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-2">{menuItems.map((item) => renderMenuItem(item))}</nav>
          </div>

          {/* Bottom Menu */}
          <div
            className={`border-t p-3 space-y-2 ${
              isDark ? "border-gray-700" : "border-[#96EDD9]"
            }`}
          >
            {bottomMenuItems.map((item) => renderMenuItem(item))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
