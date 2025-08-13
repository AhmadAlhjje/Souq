// components/templates/ProductLayout.tsx
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product, CartItem } from '@/types/product';

// تحميل المكونات بشكل ديناميكي
const DynamicSaleCarousel = dynamic(() => import('../organisms/SaleProductsCarousel'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-64 mb-8"></div>
  ),
});

const DynamicProductsSection = dynamic(() => import('../organisms/ProductsSection'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
  ),
});

// نوع للبيانات التجريبية
interface SampleProduct {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  originalPrice: number;
  salePrice?: number;
  image: string;
  isNew: boolean;
}

// دالة لتحويل SampleProduct إلى Product - محدثة لتشمل جميع الخصائص
const convertToProduct = (sample: SampleProduct): Product => ({
  id: sample.id,
  name: sample.name,
  nameAr: sample.name, // استخدام نفس الاسم للعربية
  category: 'electronics', // فئة افتراضية
  categoryAr: 'إلكترونيات',
  price: sample.originalPrice,
  salePrice: sample.salePrice,
  originalPrice: sample.originalPrice,
  rating: sample.rating,
  reviewCount: sample.reviewCount,
  image: sample.image,
  isNew: sample.isNew,
  stock: 50, // مخزون افتراضي
  status: 'active' as const,
  description: `وصف تفصيلي لمنتج ${sample.name}`,
  descriptionAr: `وصف تفصيلي لمنتج ${sample.name}`,
  brand: 'علامة تجارية',
  brandAr: 'علامة تجارية',
  // إضافة الخصائص المفقودة
  sales: Math.floor(Math.random() * 1000) + 100, // مبيعات عشوائية
  inStock: true, // متوفر في المخزون
  createdAt: new Date().toISOString(), // تاريخ الإنشاء
});

function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get('store');
  const storeName = searchParams?.get('storeName');

  // البيانات التجريبية المبسطة
  const [sampleProducts] = useState<SampleProduct[]>([
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
    },
    {
      id: 3,
      name: "هاتف ذكي بكاميرا متطورة",
      rating: 4.7,
      reviewCount: 256,
      originalPrice: 1299,
      salePrice: 999,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      isNew: false
    },
    {
      id: 4,
      name: "حقيبة ظهر للسفر متعددة الجيوب",
      rating: 4.3,
      reviewCount: 67,
      originalPrice: 179,
      salePrice: 129,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      isNew: false
    },
    {
      id: 5,
      name: "كتاب إلكتروني عالي الدقة",
      rating: 4.6,
      reviewCount: 145,
      originalPrice: 399,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      isNew: true
    },
  ]);

  // تحويل البيانات التجريبية إلى منتجات كاملة
  const products: Product[] = sampleProducts.map(convertToProduct);
  const saleProducts = products.filter(product => product.salePrice);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const handleNavigateLeft = () => {
    console.log('التنقل لليسار');
  };
  
  const handleNavigateRight = () => {
    console.log('التنقل لليمين');
  };
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    console.log(`Product ${productId} quantity changed to ${quantity}`);
  };
  
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // إنشاء CartItem صحيح - فقط مع الخصائص الموجودة في واجهة CartItem
      const newCartItem: CartItem = {
        productId: product.id,
        id: product.id,
        name: product.name,
        // إضافة الخصائص فقط إذا كانت موجودة في واجهة CartItem
        ...(product.nameAr && { nameAr: product.nameAr }),
        price: product.price,
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        quantity: quantity,
        image: product.image,
        // إضافة الخصائص الاختيارية فقط إذا كانت مدعومة
        ...(product.stock && { stock: product.stock }),
        ...(product.status && { status: product.status }),
        ...(product.description && { description: product.description }),
        ...(product.descriptionAr && { descriptionAr: product.descriptionAr }),
        ...(product.brand && { brand: product.brand }),
        ...(product.brandAr && { brandAr: product.brandAr }),
      };
      
      return [...prev, newCartItem];
    });
    
    const storeMessage = storeName ? ` من ${decodeURIComponent(storeName)}` : '';
    alert(`تم إضافة ${product.name}${storeMessage} إلى السلة!`);
  };
  
  const handleViewDetails = (product: Product) => {
    alert(`عرض تفاصيل: ${product.name}\n\nسيتم توجيهك لصفحة تفاصيل المنتج...`);
  };
  
  return (
    <div className="min-h-screen mt-12 font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* رسالة ترحيب إذا جاء من متجر معين */}
        {storeId && storeName && (
          <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">🏪</span>
              <h2 className="text-xl font-bold text-teal-800">
                مرحباً بك في {decodeURIComponent(storeName)}!
              </h2>
            </div>
            <p className="text-teal-600">
              تتصفح الآن مجموعة مختارة من أفضل المنتجات
            </p>
          </div>
        )}

        <DynamicSaleCarousel 
          saleProducts={saleProducts}
          onNavigateLeft={handleNavigateLeft}
          onNavigateRight={handleNavigateRight}
          onAddToCart={handleAddToCart}
        />
        
        <div className="grid grid-cols-1 gap-8">
          <DynamicProductsSection
            products={products}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        </div>

        <div className="mt-12 p-8 rounded-2xl text-center shadow-lg" style={{ backgroundColor: "#f9fafb" }}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#111827" }}>
              شكراً لتسوقكم معنا! 🙏
            </h3>
            <p className="text-lg mb-2" style={{ color: "#1f2937" }}>
              نقدر ثقتكم بنا ونسعى دائماً لتقديم أفضل المنتجات والخدمات
            </p>
            <p className="text-base" style={{ color: "#374151" }}>
              تجربة تسوق ممتعة ومريحة هي هدفنا الأول
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductLayout: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل المنتجات...</p>
        </div>
      </div>
    }>
      <ProductContent />
    </Suspense>
  );
};

export default ProductLayout;