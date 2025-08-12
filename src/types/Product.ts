//types/index.ts
export interface Product {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice?: number;
  image: string;
  isNew: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'sale' | 'new' | 'saleNew' | 'defaultNew' | 'newNew';
export type StarVariant = 'default' | 'new';
