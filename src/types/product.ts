// types/product.ts
export interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description?: string;
  price: number;
  discount_percentage?: number | null; // نسبة الخصم أو null إذا لم يكن هناك خصم
  stock_quantity: number ;
  images?: string | string[]; // يمكن أن تكون string (JSON) أو array
  created_at?: string;

  // خصائص محسوبة (تأتي من الخادم أو يتم تحويلها في الواجهة)
  discounted_price?: number; // السعر بعد الخصم
  discount_amount?: number; // مقدار الخصم
  has_discount?: boolean; // هل يوجد خصم
  original_price?: number; // السعر الأصلي

  // معلومات المتجر (في حالة جلب بيانات المنتج مع بيانات المتجر)
  Store?: {
    store_name: string;
    logo_image: string;
    description: string;
  };

  // التقييمات (في حالة جلب بيانات المنتج مع التقييمات)
  reviews?: any[];
  averageRating?: number;
  reviewsCount?: number;

  // ✅ إضافات مطلوبة لملف ProductsPage.tsx
  id?: string; // alias لـ product_id
  status?: "active" | "out_of_stock" | "low_stock"; // الحالة
  image?: string; // أول صورة مع baseUrl
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  sales?: number;
  brand?: string;
  createdAt?: string; // تاريخ معروض بشكل منسق

  // ✅ إضافات عربية
  nameAr?: string;
  descriptionAr?: string;
  category?: string;
  categoryAr?: string;
  brandAr?: string;
}

// نوع للمنتج عند الإنشاء أو التحديث
export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  discount_percentage?: number | null;
  stock_quantity: number;
  images?: File[]; // للصور الجديدة
}

// نوع للمنتج عند التحديث مع الصور الجديدة
export interface UpdateProductData extends Partial<Product> {
  newImages?: File[]; // للصور الجديدة
}

// نوع عنصر السلة - ✅ إضافة المفقود
export interface CartItem {
  id: number;
  nameAr?: string;
  productId: number;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  originalPrice?: number;
}

// أنواع متغيرات النجوم - ✅ إضافة المفقود
export type StarVariant =
  | "filled"
  | "outlined"
  | "half"
  | "empty"
  | "string"
  | "default"
  | "new";

export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  priceRange?: [number, number];
  ratingRange?: [number, number];
}

export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

export type ProductStatus =
  | "active"
  | "out_of_stock"
  | "low_stock"
  | "discontinued";

// ViewMode types - مع دعم أفضل للأنواع المختلفة
export type ViewMode = "grid" | "table" | "list";
export type SupportedViewMode = "grid" | "table"; // الأنواع المدعومة حالياً
export type FutureViewMode = "list"; // الأنواع المخططة للمستقبل

export type SortBy =
  | "name"
  | "price"
  | "stock"
  | "sales"
  | "rating"
  | "createdAt";

export type SortOrder = "asc" | "desc";

export interface ProductSorting {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

// Props interfaces for components
export interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export interface ProductsGridProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  loading?: boolean;
}

export interface ProductsTableProps {
  products: Product[];
  onViewProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
  loading?: boolean;
  sorting?: ProductSorting;
  onSort?: (sortBy: SortBy) => void;
}

// محدث ليدعم showListView
export interface ProductsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddProduct?: () => void;
  loading?: boolean;
  className?: string;
  showListView?: boolean; // خيار لإظهار List View
}

export interface ProductsStatsProps {
  products: Product[];
  loading?: boolean;
}

// Search Box Props
export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Badge Props
export interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Button Props (Updated to match current Button component)
export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

// Input Props
export interface InputProps {
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<unknown>;
  iconPosition?: "left" | "right";
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API Response interfaces
export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductCreateRequest {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  salePrice?: number; // ✅ إضافة للطلبات
  stock: number;
  image: string;
  description?: string;
  descriptionAr?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags?: string[];
  tagsAr?: string[];
  isNew?: boolean; // ✅ إضافة للطلبات
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: number;
}

// Form validation interfaces
export interface ProductFormErrors {
  name?: string;
  nameAr?: string;
  category?: string;
  categoryAr?: string;
  price?: string;
  salePrice?: string; // ✅ إضافة للتحقق
  stock?: string;
  image?: string;
  description?: string;
  descriptionAr?: string;
  sku?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
}

// Filter options
export interface FilterOption {
  value: string;
  label: string;
}

export interface CategoryOption extends FilterOption {
  count?: number;
}

export interface StatusOption extends FilterOption {
  color?: string;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// Loading states
export type LoadingState = "idle" | "loading" | "success" | "error";

// Error handling
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  errors?: ApiError[];
}

// ✅ إضافة واجهات جديدة للمكونات المحدثة
export interface ProductDetails extends Product {
  longDescription?: string;
  features?: string[];
  warranty?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ViewMode utilities
export const SUPPORTED_VIEW_MODES: SupportedViewMode[] = ["grid", "table"];
export const ALL_VIEW_MODES: ViewMode[] = ["grid", "table", "list"];

export const isViewModeSupported = (
  mode: ViewMode
): mode is SupportedViewMode => {
  return SUPPORTED_VIEW_MODES.includes(mode as SupportedViewMode);
};

export default Product;
