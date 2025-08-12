// types/admin.ts

import { LucideIcon } from "lucide-react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'merchant' | 'super_admin';
  avatar?: string;
  phone?: string;
  store?: Store;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  category: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  notes?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  addresses: Address[];
  orders: Order[];
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'bank_transfer'
  | 'cash_on_delivery';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
  topProducts: ProductStat[];
  recentOrders: Order[];
  salesData: SalesData[];
}

export interface ProductStat {
  product: Product;
  sales: number;
  revenue: number;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string; // جعل href اختياري
  badge?: number;
  children?: SidebarMenuItem[];
} 

// حالات التحميل والأخطاء
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SidebarConfig {
  header: {
    title: string;
    subtitle: string;
    icon: LucideIcon;
  };
  mainMenuItems: SidebarMenuItem[];
  bottomMenuItems: SidebarMenuItem[];
}