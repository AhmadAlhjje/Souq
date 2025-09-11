// types/orders.ts

export interface Product {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// إضافة interface جديد لمعلومات الشحن
export interface ShippingInfo {
  shipping_id: number;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  recipient_name: string;
  shipping_address: string;
  source_address: string;
  destination: string;
  shipping_method: string;
  tracking_number?: string;
  shipping_status: string;
  shipped_at?: string;
  delivered_at?: string;
  identity_images?: string | string[]; // دعم التنسيقين: string (JSON) أو string[] (array)
  created_at: string;
}

// تحديث Order interface لتشمل معلومات الشحن
export interface Order {
  id: string;
  customerName: string;
  productImage: string;
  productName?: string;
  status: "active" | "pending";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
  orderDate: string;
  customerPhone: string;
  customerAddress: string;
  isMonitored?: boolean;
  products?: Product[];
  // إضافة معلومات الشحن
  shipping?: ShippingInfo;
}

export type TabType = "all" | "shipped" | "unshipped" | "monitored";

export interface OrderStats {
  totalOrders: number;
  shippedOrders: number;
  unshippedOrders: number;
  monitoredOrders: number;
  totalShippedPrice: number;
  totalUnshippedPrice: number;
  totalMonitoredPrice: number;
}

// إضافة types إضافية قد تكون مفيدة لمعلومات الشحن
export type ShippingStatus = 
  | "preparing" 
  | "shipped" 
  | "in_transit" 
  | "delivered" 
  | "cancelled";

export type ShippingMethod = 
  | "express" 
  | "standard" 
  | "overnight";

// نوع للفلاتر المستخدمة في البحث
export interface SearchFilters {
  customerName: string;
  productName: string;
}

// نوع لحالة تأكيد العمليات
export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  variant: "warning" | "success" | "danger";
  loading: boolean;
}