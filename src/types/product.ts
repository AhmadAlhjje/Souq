// src/types/product.ts

// ✅ المنتج الأساسي — متوافق تمامًا مع page.tsx و ProductDetailsPageTemplate.tsx
export interface Product {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string; // الصورة الرئيسية
  images: string[]; // ✅ مصفوفة مباشرة من أسماء الملفات (مثل: ["img1.jpg", "img2.jpg"])
  isNew: boolean;
  stock: number;
  status: "active" | "out_of_stock" | "low_stock";
  description: string;
  descriptionAr: string;
  brand: string;
  brandAr: string;
  sales: number;
  inStock: boolean;
  createdAt: string;
  discountPercentage?: number;
  discountAmount?: number;
  hasDiscount?: boolean;
}

// ✅ عنصر في سلة التسوق — متوافق مع CartContext.tsx
export interface CartItem extends Product {
  cartQuantity: number;
  addedAt: Date;
}

// ⭐️ إضافات لتفاصيل المنتج (للصفحة الداخلية)
export interface ProductDetails extends Product {
  longDescription?: string;
  features?: string[];
  warranty?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

// ⭐️ مراجعات المنتج
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

// ✅ أنواع متغيرات النجوم
export type StarVariant =
  | "filled"
  | "outlined"
  | "half"
  | "empty"
  | "string"
  | "default"
  | "new";

// ✅ فلاتر المنتجات
export interface ProductFilters {
  search: string;
  category: string;
  status: string;
  priceRange?: [number, number];
  ratingRange?: [number, number];
}

// ✅ إحصائيات المنتجات
export interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
}

// ✅ حالة المنتج — موسعة قليلاً
export type ProductStatus =
  | "active"
  | "out_of_stock"
  | "low_stock"
  | "discontinued";

// ✅ أنماط العرض
export type ViewMode = "grid" | "table" | "list";
export type SupportedViewMode = "grid" | "table"; // الأنواع المدعومة حالياً
export type FutureViewMode = "list"; // الأنواع المخططة للمستقبل

// ✅ الفرز
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

// ✅ واجهات مكونات البطاقات والجداول
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

// ✅ فلاتر العرض
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

// ✅ إحصائيات المنتجات
export interface ProductsStatsProps {
  products: Product[];
  loading?: boolean;
}

// ✅ مربع البحث
export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// ✅ الشارات (Badges)
export interface BadgeProps {
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// ✅ الأزرار — متوافقة مع Button component
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

// ✅ الحقول النصية
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

// ✅ واجهات عامة
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// ✅ استجابات API
export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ✅ طلبات إنشاء/تحديث المنتج
export interface ProductCreateRequest {
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  salePrice?: number;
  stock: number;
  image: string;
  images?: string; // ✅ سلسلة JSON أو اسم ملف واحد — سيتم تحويلها في الخلفية
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

// ✅ أخطاء النماذج
export interface ProductFormErrors {
  name?: string;
  nameAr?: string;
  category?: string;
  categoryAr?: string;
  price?: string;
  salePrice?: string;
  stock?: string;
  image?: string;
  images?: string; // ✅ للتحقق من صحة سلسلة JSON
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

// ✅ خيارات الفلاتر
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

// ✅ التصفح
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// ✅ حالات التحميل
export type LoadingState = "idle" | "loading" | "success" | "error";

// ✅ الأخطاء العامة
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

// ✅ أدوات دعم ViewMode
export const SUPPORTED_VIEW_MODES: SupportedViewMode[] = ["grid", "table"];
export const ALL_VIEW_MODES: ViewMode[] = ["grid", "table", "list"];

export const isViewModeSupported = (mode: ViewMode): mode is SupportedViewMode => {
  return SUPPORTED_VIEW_MODES.includes(mode as SupportedViewMode);
};

// ✅ أدوات معالجة الصور — متوافقة تمامًا مع page.tsx و ProductDetailsPageTemplate.tsx
export const parseProductImages = (images?: string): string[] => {
  if (!images) return [];

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [images];
  } catch (error) {
    console.warn('⚠️ تعذر تحليل images كـ JSON، سيتم اعتبارها كصورة واحدة:', images);
    return [images];
  }
};

export const formatImageUrls = (images: string[], baseUrl?: string): string[] => {
  const defaultBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.1.127";
  const imageBaseUrl = baseUrl || defaultBaseUrl;

  return images.map((img) => {
    // تنظيف المسار إذا كان يبدأ بـ /uploads/
    const cleanImg = img.replace(/^\/uploads\//, "");
    return `${imageBaseUrl}/uploads/${cleanImg}`;
  });
};

// ✅ تصدير افتراضي لتسهيل الاستيراد
export default Product;