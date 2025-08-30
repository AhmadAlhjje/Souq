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
  status: "active" | "pending" | "cancelled" | "completed";
  orderNumber: string;
  price: number;
  quantity: number;
  category: string;
  products: Product[];
  orderDate: string;
  customerPhone?: string;
  customerAddress?: string;
}

export type TabType = "all" | "shipped" | "unshipped";

export interface OrderStats {
  totalOrders: number;
  shippedOrders: number;
  unshippedOrders: number;
  totalShippedPrice: number;
  totalUnshippedPrice: number;
}
