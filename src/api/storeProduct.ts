//storeProduct.ts
export interface Product {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  price: number;
  salePrice?: number;
  originalPrice: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  images?: string; // الصور الخام من الـ API كـ JSON string
  rating: number;
  reviewCount: number;
  sales: number;
  isNew: boolean;
  inStock: boolean;
  createdAt: string;
  brand: string;
  brandAr: string;
  
  // الحقول الإضافية من الـ API
  storeInfo?: {
    store_name: string;
    store_description: string;
    logo_image: string;
  };
  
  reviews?: Array<{
    review_id: number;
    product_id: number;
    reviewer_name: string;
    reviewer_phone: string;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  }>;
}