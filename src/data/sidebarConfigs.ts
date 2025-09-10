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
  FileSpreadsheet,
  Upload,
  Table,
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
        // {
        //   id: "import-products",
        //   label: t("sidebar.products.importExcel"), 
        //   icon: FileSpreadsheet, 
        //   href: "/admin/dashboard/import-products", 
        // },
        {
          id: "upload-excel",
          label: t("sidebar.products.excelUI"),
          icon: Table, 
          href: "/admin/dashboard/excelLikeInterface", 
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

    {
      id: "profile",
      label: t("sidebar.profile"),
      icon: User, // أو User2, UserCircle, Settings
      href: "/admin/dashboard/profile",
    },
  ],
  bottomMenuItems: [
    {
      id: "help",
      label: t("sidebar.bottom.help"),
      icon: HelpCircle,
      href: "/admin/dashboard/help",
    },
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
    {
      id: "help",
      label: t("customer.sidebar.help"),
      icon: HelpCircle,
      href: "/customer/help",
    },
    {
      id: "logout",
      label: t("customer.sidebar.logout"),
      icon: LogOut,
      href: "/LoginPage",
    },
  ],
});
