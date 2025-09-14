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
export const getStoreOrdersStats = async (
  storeId: number
): Promise<StoreOrdersStats> => {
  const response = await api.get<StoreOrdersStats>(
    `/orders/store/${storeId}/stats`
  );
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


// إضافة إلى ملف orders.ts

// نوع البيانات للفلاتر
interface OrderFilters {
  customerName?: string;
  productName?: string;
  orderStatus?: string;
  shippingStatus?: string;
  dateFrom?: string;
  dateTo?: string;
}

// نوع رد API للطلبات المفلترة (محدث حسب الاستجابة الفعلية)
interface FilteredOrdersResponse {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string;
  logo_image: string;
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
  Products: Array<{
    product_id: number;
    store_id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    images: string;
    created_at: string;
    averageRating: number;
    reviewsCount: number;
    stockStatus: string;
    // بيانات الطلب
    order_id?: number;
    customer_name?: string;
    order_status?: string;
    shipping_status?: string;
    quantity_ordered?: number;
    total_price?: string;
  }>;
  statistics: {
    totalProducts: number;
    availableProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    averageRating: number;
    totalReviews: number;
    totalOrders: number;
    totalRevenue: string;
    ordersByStatus: {
      pending: number;
      shipped: number;
    };
    averageOrderValue: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    ordersPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    customerName: string | null;
    productName: string | null;
    orderStatus: string | null;
    shippingStatus: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    appliedFilters: {
      customerSearch: boolean;
      productSearch: boolean;
      statusFilter: boolean;
      shippingFilter: boolean;
      dateFilter: boolean;
    };
  };
}

// دالة للبحث في الطلبات مع الفلترة
export const getFilteredOrders = async (
  storeId: number,
  filters: OrderFilters
): Promise<FilteredOrdersResponse> => {
  const params = new URLSearchParams();

  if (filters.customerName) params.append("customerName", filters.customerName);
  if (filters.productName) params.append("productName", filters.productName);
  if (filters.orderStatus) params.append("orderStatus", filters.orderStatus);
  if (filters.shippingStatus) params.append("shippingStatus", filters.shippingStatus);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);

  const response = await api.get<FilteredOrdersResponse>(
    `/orders/store/${storeId}/filter?${params.toString()}`
  );
  console.log("Filtered orders response:", response.data);
  return response.data;
};

// طلبات التصفير
export const requestSettlement = async (storeId: number) => {
  console.log(`📡 Requesting settlement for store=${storeId}`);
  const response = await api.post(
    `/orders/store/${storeId}/request-settlement`
  );
  console.log("✅ Settlement request response:", response.data);
  return response.data;
};