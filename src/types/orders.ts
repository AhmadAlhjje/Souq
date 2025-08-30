export interface Product {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  productImage: string;
  status: "active" | "pending";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
  orderDate: string;
  customerPhone: string;
  customerAddress: string;
  isMonitored?: boolean;
  products?:Product[];
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
