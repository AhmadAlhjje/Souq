// app/products/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsPage from '@/components/templates/ProductDetailsPage';
import { Product } from '../../../types/Product';

// بيانات المنتجات المحدثة - متوافقة مع البنية الجديدة
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    nameAr: "سماعات لاسلكية عالية الجودة",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    categoryAr: "إلكترونيات",
    price: 299,
    salePrice: 199,           // سعر العرض
    stock: 50,
    status: "active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.5,
    reviewCount: 128,         // عدد التقييمات
    sales: 324,
    isNew: false,             // ليس منتج جديد
    inStock: true,            // متوفر
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Smart Sports Watch",
    nameAr: "ساعة ذكية رياضية مقاومة للماء",
    description: "Advanced smartwatch with fitness tracking",
    category: "Accessories",
    categoryAr: "إكسسوارات",
    price: 599,
    stock: 30,
    status: "active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    sales: 156,
    isNew: true,              // منتج جديد
    inStock: true,
    createdAt: "2024-02-01T00:00:00Z"
  },
  {
    id: 7,
    name: "High Performance Laptop",
    nameAr: "لابتوب محمول عالي الأداء",
    description: "Powerful laptop for work and gaming",
    category: "Computers",
    categoryAr: "حاسوب",
    price: 2999,
    salePrice: 2499,          // سعر العرض
    stock: 15,
    status: "active",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    sales: 89,
    isNew: false,
    inStock: true,
    createdAt: "2024-01-15T00:00:00Z"
  },
  // يمكن إضافة المزيد من المنتجات هنا
];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params?.id as string);
  
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">المنتج غير موجود</h1>
          <button 
            onClick={() => router.push('/products')}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            العودة للمنتجات
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product, quantity: number) => {
    console.log(`إضافة ${quantity} من ${product.nameAr} للسلة`);
    alert(`تم إضافة ${quantity} × ${product.nameAr} للسلة!`);
  };

  const handleBackToProducts = () => {
    router.push('/products');
  };

  return (
    <ProductDetailsPage
      product={product}
      onAddToCart={handleAddToCart}
      onBackToProducts={handleBackToProducts}
    />
  );
}