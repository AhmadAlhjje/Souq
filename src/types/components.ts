// types/components.ts

export interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' | 'teal' | 'teal-outline' | 'info' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export interface BadgeProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'default' | 'sale' | 'new' | 'saleNew' | 'defaultNew' | 'newNew' | 'primary' | 'hero';
  className?: string;
}

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  fillColor?: string;
  emptyColor?: string;
}

export interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
  badgeType?: 'sale' | 'new' | 'outOfStock';
  badgeText?: string;
  discountPercentage?: number;
  aspectRatio?: 'square' | 'wide' | 'tall';
  showZoomIcon?: boolean;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

export interface ProductInfoProps {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  brandAr?: string;
  category?: string;
  categoryAr?: string;
  stock?: number;
  sales?: number;
  inStock?: boolean;
  isNew?: boolean;
  showFullDescription?: boolean;
  className?: string;
  compact?: boolean;
}

export interface ImageThumbnailsProps {
  images: string[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  onImageClick?: (index: number) => void;
  maxVisible?: number;
  className?: string;
  thumbnailClassName?: string;
  fallbackSrc?: string;
}

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  selectedIndex?: number;
  onImageClick?: (index: number) => void;
  showBadge?: boolean;
  badgeType?: 'sale' | 'new' | 'outOfStock';
  badgeText?: string;
  discountPercentage?: number;
  inStock?: boolean;
  isNew?: boolean;
  className?: string;
  mainImageClassName?: string;
  thumbnailsClassName?: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  maxThumbnails?: number;
}

export interface ProductDetailsProps {
  product: {
    id: string | number;
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    originalPrice?: number;
    salePrice?: number;
    rating: number;
    reviewCount: number;
    brand?: string;
    brandAr?: string;
    category?: string;
    categoryAr?: string;
    stock?: number;
    sales?: number;
    inStock?: boolean;
    isNew?: boolean;
  };
  onAddToCart?: (productId: string | number, quantity: number) => void;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  isItemInCart?: boolean;
  cartQuantity?: number;
  onQuantityUpdate?: (productId: string | number, quantity: number) => void;
  loading?: boolean;
  className?: string;
}

export interface ImageGalleryModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelectImage: (index: number) => void;
  productName: string;
  className?: string;
}

export interface Product {
  id: string | number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  brandAr?: string;
  category?: string;
  categoryAr?: string;
  stock?: number;
  sales?: number;
  inStock?: boolean;
  isNew?: boolean;
  image?: string;
  images?: string;
}

export interface ProductDetailsPageTemplateProps {
  product: Product;
  onAddToCart?: (productId: string | number, quantity: number) => void;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  onBackToProducts?: () => void;
  isItemInCart?: boolean;
  cartQuantity?: number;
  onQuantityUpdate?: (productId: string | number, quantity: number) => void;
  loading?: boolean;
  className?: string;
}