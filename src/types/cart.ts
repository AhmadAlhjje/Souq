// types/cart.ts

// API Response Types - كما تأتي من الخادم
export interface APIProduct {
  id: number;
  name: string;
  description?: string;
  price: string; // يأتي كـ string من API
  images: string; // JSON string
  stock_quantity: number;
  Store: {
    id: number;
    store_name: string;
  };
}

export interface APICartItem {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  Product: APIProduct;
}

export interface APICartResponse {
  cart_id: number;
  session_id: string;
  created_at: string;
  updated_at: string;
  CartItems?: APICartItem[]; // يمكن أن تكون فارغة
}

// UI Types - كما نستخدمها في الواجهة
export interface CartItem {
  id: number; // cart_item_id
  product_id: number;
  cart_item_id: number;
  name: string;
  description?: string;
  price: number; // محول لـ number
  originalPrice?: number;
  quantity: number;
  image: string; // URL كامل للصورة
  total: number; // محسوب
  inStock?: boolean;
  discount?: number;
  store_name?: string;
}

export interface CartData {
  cart_id: number;
  session_id: string;
  created_at: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

// API Request Types
export interface AddToCartRequest {
  session_id: string;
  product_id: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface ClearCartRequest {
  session_id: string;
}

// API Response Types للعمليات
export interface AddToCartResponse {
  success: boolean;
  message: string;
  cart_item?: APICartItem;
}

export interface UpdateQuantityResponse {
  success: boolean;
  message: string;
  cart_item?: APICartItem;
}

export interface RemoveItemResponse {
  success: boolean;
  message: string;
}

export interface ClearCartResponse {
  success: boolean;
  message: string;
}

export interface CartTotalResponse {
  session_id: string;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  items_count: number;
}

// Hook Return Types
export interface UseCartReturn {
  cartData: CartData | null;
  selectedItems: Set<number>;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  removeSelectedItems: () => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCartTotal: () => Promise<CartTotalResponse | undefined>;
  handleSelectItem: (itemId: number, selected: boolean) => void;
  handleSelectAll: () => void;
  handleCheckout: () => Promise<void>;
}

export interface UseAddToCartReturn {
  handleAddToCart: (productId: number, quantity?: number) => Promise<boolean>;
}

// Error Types
export interface CartError {
  message: string;
  status?: number;
  code?: string;
}

// Constants
export const CART_CONSTANTS = {
  FREE_DELIVERY_THRESHOLD: 200,
  DELIVERY_FEE: 25,
  TAX_RATE: 0.15,
  DEFAULT_CURRENCY: 'ر.س',
} as const;