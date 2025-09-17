// src/types/product.ts

// ✅ المنتج الأساسي — موحد من الفرعين ومتوافق مع الصفحة والتيمبلت
export interface Product {
  // الحقول القادمة من الـ API
  product_id?: number;
  store_id?: number;
  name: string;
  description?: string;
  price: number;
  discount_percentage?: number | null;
  stock_quantity?: number;
  images?: string | string[];
  created_at?: string;

  // خصائص محسوبة أو مضافة في الواجهة
  id?: number; // alias لـ product_id
  salePrice?: number;
  originalPrice?: number;
  discounted_price?: number;
  discount_amount?: number;
  has_discount?: boolean;
  discountPercentage?: number;
  discountAmount?: number;
  hasDiscount?: boolean;

  // الحالة والمخزون
  stock?: number;
  status?: "active" | "out_of_stock" | "low_stock";
  inStock?: boolean;
  isNew?: boolean;
  sales?: number;

  // الصور والعرض
  image?: string;
  imagesList?: string[];
  createdAt?: string;

  // التقييمات
  reviews?: any[];
  averageRating?: number;
  reviewsCount?: number;
  rating?: number;
  reviewCount?: number;

  // معلومات المتجر
  Store?: {
    store_name: string;
    logo_image: string;
    description: string;
  };

  // العلامة التجارية
  brand?: string;
  brandAr?: string;

  // التصنيفات
  category?: string;
  categoryAr?: string;

  // نسخ بالعربية
  nameAr?: string;
  descriptionAr?: string;
   reviewsData?: {
    total?: number;
    verified?: number;
    pending?: number;
    averageRating?: number;
    overallAverageRating?: number;
    ratingDistribution?: {
      [key: string]: number;
    };
    reviews?: Array<{
      review_id: number;
      product_id: number;
      reviewer_name: string;
      reviewer_phone?: string;
      rating: number;
      comment: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
    }>;
    comments?: Array<{
      review_id: number;
      reviewer_name: string;
      comment: string;
      rating?: number;
      is_verified: boolean;
      created_at: string;
      time_ago: string;
    }>;
    latestVerified?: any[];
    performance?: {
      excellentReviews: number;
      poorReviews: number;
      averageReviews: number;
      recommendationRate: number;
    };
  };
}


// ✅ عنصر في سلة التسوق
export interface CartItem extends Product {
  cartQuantity: number;
  addedAt: Date;
}

// ⭐️ تفاصيل المنتج
export interface ProductDetails extends Product {
  longDescription?: string;
  features?: string[];
  warranty?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

// ⭐️ مراجعة منتج
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

// ⭐️ ملخص المراجعات
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

// ✅ أنواع مساعدة
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

export type ViewMode = "grid" | "table" | "list";
export type SupportedViewMode = "grid" | "table";
export type FutureViewMode = "list";

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
  showListView?: boolean;
}

export interface ProductsStatsProps {
  products: Product[];
  loading?: boolean;
}

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

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

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

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
  salePrice?: number;
  stock: number;
  image: string;
  images?: string;
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
  isNew?: boolean;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: number;
}

export interface ProductFormErrors {
  name?: string;
  nameAr?: string;
  category?: string;
  categoryAr?: string;
  price?: string;
  salePrice?: string;
  stock?: string;
  image?: string;
  images?: string;
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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

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

export const SUPPORTED_VIEW_MODES: SupportedViewMode[] = ["grid", "table"];
export const ALL_VIEW_MODES: ViewMode[] = ["grid", "table", "list"];

export const isViewModeSupported = (
  mode: ViewMode
): mode is SupportedViewMode => {
  return SUPPORTED_VIEW_MODES.includes(mode as SupportedViewMode);
};

// ✅ أدوات معالجة الصور
export const parseProductImages = (images?: string): string[] => {
  if (!images) return [];

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [images];
  } catch (error) {
    console.warn("⚠️ تعذر تحليل images كـ JSON، سيتم اعتبارها كصورة واحدة:", images);
    return [images];
  }
};

export const formatImageUrls = (images: string[], baseUrl?: string): string[] => {
  const defaultBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.1.127";
  const imageBaseUrl = baseUrl || defaultBaseUrl;

  return images.map((img) => {
    const cleanImg = img.replace(/^\/uploads\//, "");
    return `${imageBaseUrl}/uploads/${cleanImg}`;
  });
};

// ✅ تصدير افتراضي
export default Product;