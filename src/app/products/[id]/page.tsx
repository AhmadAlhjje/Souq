
// app/products/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsPage from '@/components/templates/ProductDetailsPage';
import { Product } from '@/types/Product';

// بيانات المنتجات (نفس البيانات من ProductLayout)
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "سماعات لاسلكية عالية الجودة",
    rating: 4.5,
    reviewCount: 128,
    originalPrice: 299,
    salePrice: 199,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 2,
    name: "ساعة ذكية رياضية مقاومة للماء",
    rating: 4.8,
    reviewCount: 89,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    isNew: true
  },  {
    id: 7,
    name: "لابتوب محمول عالي الأداء",
    rating: 4.9,
    reviewCount: 156,
    originalPrice: 2999,
    salePrice: 2499,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    isNew: false
  },
  // ... باقي المنتجات
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
    console.log(`إضافة ${quantity} من ${product.name} للسلة`);
    alert(`تم إضافة ${quantity} × ${product.name} للسلة!`);
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