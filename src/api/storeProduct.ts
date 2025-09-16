// في ملف /api/storeProduct.ts
// استبدل تعريف status في interface Product بهذا:

export interface Product {
  id: number;
  product_id?: number;
  store_id?: number;          
  stock_quantity?: number; 
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  price: number;
  salePrice?: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew: boolean;
  stock: number;
  status: "active" | "out_of_stock" | "low_stock"; // تغيير من "inactive" إلى "low_stock"
  description: string;
  descriptionAr: string;
  brand: string;
  brandAr: string;
  sales: number;
  inStock: boolean;
  createdAt: string;

  // الحقول الجديدة للخصومات
  discountPercentage?: number;
  discountAmount?: number;
  hasDiscount?: boolean;
}
