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
  FileText,
  DollarSign,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { SidebarMenuItem } from "@/types/admin";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation();
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
      label: t("sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: t("sidebar.products.main"),
      icon: Package,
      children: [
        {
          id: "all-products",
          label: t("sidebar.products.all"),
          icon: Package,
          href: "/admin/dashboard/products",
        },
        {
          id: "add-product",
          label: t("sidebar.products.add"),
          icon: Plus,
          href: "/admin/products/add",
        },
        // {
        //   id: "categories",
        //   label: t("sidebar.products.categories"),
        //   icon: Tag,
        //   href: "/admin/products/categories",
        // },
        // {
        //   id: "inventory",
        //   label: t("sidebar.products.inventory"),
        //   icon: Package,
        //   href: "/admin/products/inventory",
        // },
      ],
    },
    {
      id: "orders",
      label: t("sidebar.orders.main"),
      icon: ShoppingCart,
      badge: 12,
      children: [
        {
          id: "all-orders",
          label: t("sidebar.orders.all"),
          icon: ShoppingCart,
          href: "/admin/orders",
        },
        {
          id: "pending-orders",
          label: t("sidebar.orders.pending"),
          icon: ShoppingCart,
          href: "/admin/orders/pending",
          badge: 5,
        },
        {
          id: "shipped-orders",
          label: t("sidebar.orders.shipped"),
          icon: Truck,
          href: "/admin/orders/shipped",
        },
        {
          id: "completed-orders",
          label: t("sidebar.orders.completed"),
          icon: ShoppingCart,
          href: "/admin/orders/completed",
        },
      ],
    },
    {
      id: "customers",
      label: t("sidebar.customers.main"),
      icon: Users,
      children: [
        {
          id: "all-customers",
          label: t("sidebar.customers.all"),
          icon: Users,
          href: "/admin/customers",
        },
        {
          id: "customer-groups",
          label: t("sidebar.customers.groups"),
          icon: Users,
          href: "/admin/customers/groups",
        },
      ],
    },
    {
      id: "financial-reports",
      label: t("sidebar.financialReports.main"),
      icon: FileText,
      children: [
        {
          id: "sales-report",
          label: t("sidebar.financialReports.sales"),
          icon: BarChart3,
          href: "/admin/financial-reports/sales",
        },
        {
          id: "profit-loss",
          label: t("sidebar.financialReports.profitLoss"),
          icon: DollarSign,
          href: "/admin/financial-reports/profit-loss",
        },
        {
          id: "revenue-report",
          label: t("sidebar.financialReports.revenue"),
          icon: BarChart3,
          href: "/admin/financial-reports/revenue",
        },
        {
          id: "expense-report",
          label: t("sidebar.financialReports.expenses"),
          icon: CreditCard,
          href: "/admin/financial-reports/expenses",
        },
        {
          id: "tax-report",
          label: t("sidebar.financialReports.tax"),
          icon: FileText,
          href: "/admin/financial-reports/tax",
        },
      ],
    },
    {
      id: "analytics",
      label: t("sidebar.analytics.main"),
      icon: BarChart3,
      children: [
        {
          id: "dashboard-analytics",
          label: t("sidebar.analytics.general"),
          icon: BarChart3,
          href: "/admin/analytics/dashboard",
        },
        {
          id: "products-analytics",
          label: t("sidebar.analytics.products"),
          icon: Package,
          href: "/admin/analytics/products",
        },
        {
          id: "customers-analytics",
          label: t("sidebar.analytics.customers"),
          icon: Users,
          href: "/admin/analytics/customers",
        },
      ],
    },
    {
      id: "payments",
      label: t("sidebar.payments.main"),
      icon: CreditCard,
      children: [
        {
          id: "payment-methods",
          label: t("sidebar.payments.methods"),
          icon: CreditCard,
          href: "/admin/payments/methods",
        },
        {
          id: "transactions",
          label: t("sidebar.payments.transactions"),
          icon: DollarSign,
          href: "/admin/payments/transactions",
        },
        {
          id: "refunds",
          label: t("sidebar.payments.refunds"),
          icon: CreditCard,
          href: "/admin/payments/refunds",
        },
      ],
    },
    {
      id: "shipping",
      label: t("sidebar.shipping.main"),
      icon: Truck,
      children: [
        {
          id: "shipping-methods",
          label: t("sidebar.shipping.methods"),
          icon: Truck,
          href: "/admin/shipping/methods",
        },
        {
          id: "shipping-zones",
          label: t("sidebar.shipping.zones"),
          icon: Truck,
          href: "/admin/shipping/zones",
        },
      ],
    },
    {
      id: "store-settings",
      label: t("sidebar.storeSettings.main"),
      icon: Store,
      children: [
        {
          id: "general-settings",
          label: t("sidebar.storeSettings.general"),
          icon: Settings,
          href: "/admin/store-settings/general",
        },
        {
          id: "theme-settings",
          label: t("sidebar.storeSettings.theme"),
          icon: Settings,
          href: "/admin/store-settings/theme",
        },
        {
          id: "seo-settings",
          label: t("sidebar.storeSettings.seo"),
          icon: Settings,
          href: "/admin/store-settings/seo",
        },
        {
          id: "currency-settings",
          label: t("sidebar.storeSettings.currency"),
          icon: DollarSign,
          href: "/admin/store-settings/currency",
        },
      ],
    },
    {
      id: "settings",
      label: t("sidebar.settings.main"),
      icon: Settings,
      children: [
        {
          id: "user-settings",
          label: t("sidebar.settings.users"),
          icon: Users,
          href: "/admin/settings/users",
        },
        {
          id: "security-settings",
          label: t("sidebar.settings.security"),
          icon: Settings,
          href: "/admin/settings/security",
        },
        {
          id: "notification-settings",
          label: t("sidebar.settings.notifications"),
          icon: Bell,
          href: "/admin/settings/notifications",
        },
        {
          id: "backup-settings",
          label: t("sidebar.settings.backup"),
          icon: Settings,
          href: "/admin/settings/backup",
        },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      id: "notifications",
      label: t("sidebar.bottom.notifications"),
      icon: Bell,
      href: "/admin/notifications",
      badge: 7,
    },
    {
      id: "help",
      label: t("sidebar.bottom.help"),
      icon: HelpCircle,
      href: "/admin/help",
    },
    {
      id: "logout",
      label: t("sidebar.bottom.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ];

  const isActiveRoute = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderMenuItem = (item: SidebarMenuItem, level = 0) => {
    const isActive = item.href ? isActiveRoute(item.href) : false;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="w-full">
        <div
          className={`
            flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
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
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              if (window.innerWidth < 768) {
                onToggle();
              }
            }
          }}
        >
          {hasChildren ? (
            <div className="flex items-center flex-1 gap-3">
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
            </div>
          ) : item.href ? (
            <Link
              href={item.href}
              className="flex items-center flex-1 gap-3"
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
          ) : (
            <div className="flex items-center flex-1 gap-3">
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
            </div>
          )}

          {hasChildren && isOpen && (
            <div
              className={`p-1 rounded-md transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <ChevronRight size={16} />
            </div>
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
                  {t("sidebar.header.title")}
                </h2>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-[#666666]"}`}>
                  {t("sidebar.header.subtitle")}
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