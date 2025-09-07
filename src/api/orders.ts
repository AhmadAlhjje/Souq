import { api } from "./api";

// أولاً: تعريف الأنواع الأساسية
interface Store {
  store_name: string;
  logo_image: string;
  store_address: string;
}

interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  images: string;
  created_at: string;
}

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_time: string;
  Product: Product;
}

interface Shipping {
  shipping_id: number;
  order_id: number;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  recipient_name: string;
  shipping_address: string;
  source_address: string | null;
  destination: string;
  shipping_method: string;
  tracking_number: string | null;
  shipping_status: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

interface Order {
  order_id: number;
  store_id: number;
  customer_session_id: string;
  total_price: string;
  status: string;
  is_programmatic: boolean;
  created_at: string;
  Store: Store;
  OrderItems: OrderItem[];
  Shipping: Shipping;
}

interface OrdersGroup {
  orders: Order[];
  count: number;
  totalAmount: number;
}

interface OrderStatistics {
  totalOrders: number;
  shippedCount: number;
  unshippedCount: number;
  shippedPercentage: string;
  unshippedPercentage: string;
  totalRevenue: number;
  shippedRevenue: number;
  unshippedRevenue: number;
  averageOrderValue: number;
  revenuePercentageShipped: string;
  revenuePercentageUnshipped: string;
}

// النوع الرئيسي للبيانات المُرجعة
interface StoreOrdersStats {
  storeId: number;
  storeName: string;
  allOrders: OrdersGroup;
  shippedOrders: OrdersGroup;
  unshippedOrders: OrdersGroup;
  statistics: OrderStatistics;
}

// جلب إحصائيات وطلبات المتجر
export const getStoreOrdersStats = async (storeId: number): Promise<StoreOrdersStats> => {
  const response = await api.get<StoreOrdersStats>(`/orders/store/${storeId}/stats`);
  return response.data;
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId: number, status: string) => {
  console.log(
    `📡 Updating order status | orderId=${orderId}, status=${status}`
  );
  const response = await api.put(`/orders/ship/${orderId}`, { status });
  console.log("✅ Update order response:", response.data);
  return response.data;
};

// ✅ تحديث حالة الطلب المرصود (Programmatic)
export const updateProgrammaticShipped = async (storeId: number) => {
  console.log(`📡 Updating programmatic shipped for store=${storeId}`);
  const response = await api.put(
    `/orders/store/${storeId}/programmatic/update-shipped`
  );
  console.log("✅ Programmatic update response:", response.data);
  return response.data;
};
