// types/product.ts
export interface Product {
  id: number;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  stock: number;
  status: 'active' | 'out_of_stock' | 'low_stock';
  image: string;
  rating: number;
  sales: number;
  createdAt: string;
  updatedAt?: string;
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
}

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

export type ProductStatus = 'active' | 'out_of_stock' | 'low_stock' | 'discontinued';

// ViewMode types - مع دعم أفضل للأنواع المختلفة
export type ViewMode = 'grid' | 'table' | 'list';
export type SupportedViewMode = 'grid' | 'table'; // الأنواع المدعومة حالياً
export type FutureViewMode = 'list'; // الأنواع المخططة للمستقبل

export type SortBy = 'name' | 'price' | 'stock' | 'sales' | 'rating' | 'createdAt';

export type SortOrder = 'asc' | 'desc';

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
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Button Props (Updated to match current Button component)
export interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Input Props
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<any>;
  iconPosition?: 'left' | 'right';
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
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

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

// ViewMode utilities
export const SUPPORTED_VIEW_MODES: SupportedViewMode[] = ['grid', 'table'];
export const ALL_VIEW_MODES: ViewMode[] = ['grid', 'table', 'list'];

export const isViewModeSupported = (mode: ViewMode): mode is SupportedViewMode => {
  return SUPPORTED_VIEW_MODES.includes(mode as SupportedViewMode);
};