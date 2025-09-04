import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
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
  User,
} from "lucide-react";
import { SidebarConfig } from "@/types/admin";

// Admin Dashboard Sidebar Configuration
export const getAdminSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("sidebar.header.title"),
    subtitle: t("sidebar.header.subtitle"),
    icon: Store,
  },
  mainMenuItems: [
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
          href: "/admin/dashboard/addproducts",
        },
      ],
    },
    {
      id: "orders",
      label: t("sidebar.orders.main"),
      icon: ShoppingCart,
      // badge: 12,
      children: [
        {
          id: "all-orders",
          label: t("sidebar.orders.all"),
          icon: ShoppingCart,
          href: "/admin/dashboard/orders",
        },
        // {
        //   id: "pending-orders",
        //   label: t("sidebar.orders.pending"),
        //   icon: ShoppingCart,
        //   href: "/admin/dashboard/orders/pending",
        //   badge: 5,
        // },
        // {
        //   id: "shipped-orders",
        //   label: t("sidebar.orders.shipped"),
        //   icon: Truck,
        //   href: "/admin/dashboard/orders/shipped",
        // },
        // {
        //   id: "completed-orders",
        //   label: t("sidebar.orders.completed"),
        //   icon: ShoppingCart,
        //   href: "/admin/dashboard/orders/completed",
        // },
      ],
    },
    // {
    //   id: "customers",
    //   label: t("sidebar.customers.main"),
    //   icon: Users,
    //   children: [
    //     {
    //       id: "all-customers",
    //       label: t("sidebar.customers.all"),
    //       icon: Users,
    //       href: "/admin/customers",
    //     },
    //     {
    //       id: "customer-groups",
    //       label: t("sidebar.customers.groups"),
    //       icon: Users,
    //       href: "/admin/customers/groups",
    //     },
    //   ],
    // },
    // {
    //   id: "financial-reports",
    //   label: t("sidebar.financialReports.main"),
    //   icon: FileText,
    //   children: [
    //     {
    //       id: "sales-report",
    //       label: t("sidebar.financialReports.sales"),
    //       icon: BarChart3,
    //       href: "/admin/financial-reports/sales",
    //     },
    //     {
    //       id: "profit-loss",
    //       label: t("sidebar.financialReports.profitLoss"),
    //       icon: DollarSign,
    //       href: "/admin/financial-reports/profit-loss",
    //     },
    //     {
    //       id: "revenue-report",
    //       label: t("sidebar.financialReports.revenue"),
    //       icon: BarChart3,
    //       href: "/admin/financial-reports/revenue",
    //     },
    //     {
    //       id: "expense-report",
    //       label: t("sidebar.financialReports.expenses"),
    //       icon: CreditCard,
    //       href: "/admin/financial-reports/expenses",
    //     },
    //     {
    //       id: "tax-report",
    //       label: t("sidebar.financialReports.tax"),
    //       icon: FileText,
    //       href: "/admin/financial-reports/tax",
    //     },
    //   ],
    // },
    // {
    //   id: "analytics",
    //   label: t("sidebar.analytics.main"),
    //   icon: BarChart3,
    //   children: [
    //     {
    //       id: "dashboard-analytics",
    //       label: t("sidebar.analytics.general"),
    //       icon: BarChart3,
    //       href: "/admin/analytics/dashboard",
    //     },
    //     {
    //       id: "products-analytics",
    //       label: t("sidebar.analytics.products"),
    //       icon: Package,
    //       href: "/admin/analytics/products",
    //     },
    //     {
    //       id: "customers-analytics",
    //       label: t("sidebar.analytics.customers"),
    //       icon: Users,
    //       href: "/admin/analytics/customers",
    //     },
    //   ],
    // },
    // {
    //   id: "payments",
    //   label: t("sidebar.payments.main"),
    //   icon: CreditCard,
    //   children: [
    //     {
    //       id: "payment-methods",
    //       label: t("sidebar.payments.methods"),
    //       icon: CreditCard,
    //       href: "/admin/payments/methods",
    //     },
    //     {
    //       id: "transactions",
    //       label: t("sidebar.payments.transactions"),
    //       icon: DollarSign,
    //       href: "/admin/payments/transactions",
    //     },
    //     {
    //       id: "refunds",
    //       label: t("sidebar.payments.refunds"),
    //       icon: CreditCard,
    //       href: "/admin/payments/refunds",
    //     },
    //   ],
    // },
    // {
    //   id: "shipping",
    //   label: t("sidebar.shipping.main"),
    //   icon: Truck,
    //   children: [
    //     {
    //       id: "shipping-methods",
    //       label: t("sidebar.shipping.methods"),
    //       icon: Truck,
    //       href: "/admin/shipping/methods",
    //     },
    //     {
    //       id: "shipping-zones",
    //       label: t("sidebar.shipping.zones"),
    //       icon: Truck,
    //       href: "/admin/shipping/zones",
    //     },
    //   ],
    // },
    // {
    //   id: "store-settings",
    //   label: t("sidebar.storeSettings.main"),
    //   icon: Store,
    //   children: [
    //     {
    //       id: "general-settings",
    //       label: t("sidebar.storeSettings.general"),
    //       icon: Settings,
    //       href: "/admin/store-settings/general",
    //     },
    //     {
    //       id: "theme-settings",
    //       label: t("sidebar.storeSettings.theme"),
    //       icon: Settings,
    //       href: "/admin/store-settings/theme",
    //     },
    //     {
    //       id: "seo-settings",
    //       label: t("sidebar.storeSettings.seo"),
    //       icon: Settings,
    //       href: "/admin/store-settings/seo",
    //     },
    //     {
    //       id: "currency-settings",
    //       label: t("sidebar.storeSettings.currency"),
    //       icon: DollarSign,
    //       href: "/admin/store-settings/currency",
    //     },
    //   ],
    // },
    // {
    //   id: "settings",
    //   label: t("sidebar.settings.main"),
    //   icon: Settings,
    //   children: [
    //     {
    //       id: "user-settings",
    //       label: t("sidebar.settings.users"),
    //       icon: Users,
    //       href: "/admin/settings/users",
    //     },
    //     {
    //       id: "security-settings",
    //       label: t("sidebar.settings.security"),
    //       icon: Settings,
    //       href: "/admin/settings/security",
    //     },
    //     {
    //       id: "notification-settings",
    //       label: t("sidebar.settings.notifications"),
    //       icon: Bell,
    //       href: "/admin/settings/notifications",
    //     },
    //     {
    //       id: "backup-settings",
    //       label: t("sidebar.settings.backup"),
    //       icon: Settings,
    //       href: "/admin/settings/backup",
    //     },
    //   ],
    // },
    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: User, // أو User2, UserCircle, Settings
      href: "/admin/dashboard/profile",
    },
    // {
    //   id: "create-store",
    //   label: t("sidebar.createStore"),
    //   icon: Store,
    //   href: "/admin/dashboard/creatingStore",
    // },
  ],
  bottomMenuItems: [
    {
      id: "notifications",
      label: t("sidebar.bottom.notifications"),
      icon: Bell,
      href: "/admin/notifications",
      // badge: 7,
    },
    // {
    //   id: "help",
    //   label: t("sidebar.bottom.help"),
    //   icon: HelpCircle,
    //   href: "/admin/help",
    // },
    {
      id: "logout",
      label: t("sidebar.bottom.logout"),
      icon: LogOut,
      href: "/LoginPage",
    },
  ],
});

// Customer Dashboard Sidebar Configuration
export const getCustomerSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("customer.sidebar.header.title"),
    subtitle: t("customer.sidebar.header.subtitle"),
    icon: Users,
  },
  mainMenuItems: [
    {
      id: "dashboard",
      label: t("customer.sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/customer/dashboard",
    },
    {
      id: "orders",
      label: t("customer.sidebar.orders"),
      icon: ShoppingCart,
      href: "/customer/orders",
      // badge: 3,
    },
    {
      id: "profile",
      label: t("customer.sidebar.profile"),
      icon: Users,
      href: "/customer/profile",
    },
  ],
  bottomMenuItems: [
    // {
    //   id: "help",
    //   label: t("customer.sidebar.help"),
    //   icon: HelpCircle,
    //   href: "/customer/help",
    // },
    {
      id: "logout",
      label: t("customer.sidebar.logout"),
      icon: LogOut,
      href: "/LoginPage",
    },
  ],
});
