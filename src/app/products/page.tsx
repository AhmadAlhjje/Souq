
// app/products/page.tsx
// app/products/page.tsx

import React from 'react';
import ProductLayout from '@/components/templates/ProductLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المنتجات - سوق إلكتروني',
  description: 'تصفح مجموعة واسعة من المنتجات عالية الجودة بأفضل الأسعار',
  keywords: 'منتجات، تسوق، إلكترونيات، أزياء، كتب',
};

export default function ProductsPage() {
  return <ProductLayout />;
}


