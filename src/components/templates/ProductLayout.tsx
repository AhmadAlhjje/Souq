// components/templates/ProductLayout.tsx (النسخة النهائية المحدثة)
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Product, CartItem } from '@/types/Product';

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

function ProductContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams?.get('store');
  const storeName = searchParams?.get('storeName');

  const [products] = useState<Product[]>([
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
  {
    id: 6,
    name: "مكبر صوت محمول بلوتوث",
    rating: 4.4,
    reviewCount: 92,
    originalPrice: 149,
    salePrice: 99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 7,
    name: "لابتوب محمول عالي الأداء",
    rating: 4.9,
    reviewCount: 156,
    originalPrice: 2999,
    salePrice: 2499,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 8,
    name: "كاميرا رقمية احترافية",
    rating: 4.6,
    reviewCount: 203,
    originalPrice: 1899,
    salePrice: 1599,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 9,
    name: "قميص قطني أنيق للرجال",
    rating: 4.2,
    reviewCount: 84,
    originalPrice: 129,
    salePrice: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 10,
    name: "حذاء رياضي للجري",
    rating: 4.7,
    reviewCount: 234,
    originalPrice: 349,
    salePrice: 249,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 11,
    name: "نظارات شمسية عصرية",
    rating: 4.1,
    reviewCount: 76,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 12,
    name: "محفظة جلدية فاخرة",
    rating: 4.5,
    reviewCount: 112,
    originalPrice: 189,
    salePrice: 149,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 13,
    name: "سجادة يوجا مريحة",
    rating: 4.4,
    reviewCount: 98,
    originalPrice: 89,
    salePrice: 69,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 14,
    name: "مصباح مكتب LED ذكي",
    rating: 4.6,
    reviewCount: 145,
    originalPrice: 159,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 15,
    name: "كوب قهوة حراري ذكي",
    rating: 4.3,
    reviewCount: 67,
    originalPrice: 79,
    salePrice: 59,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 16,
    name: "طاولة قابلة للطي",
    rating: 4.2,
    reviewCount: 89,
    originalPrice: 249,
    salePrice: 199,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 17,
    name: "مجموعة أدوات طبخ احترافية",
    rating: 4.8,
    reviewCount: 178,
    originalPrice: 299,
    salePrice: 229,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 18,
    name: "خزانة تنظيم متعددة الأدراج",
    rating: 4.1,
    reviewCount: 134,
    originalPrice: 199,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 19,
    name: "شاحن لاسلكي سريع",
    rating: 4.5,
    reviewCount: 212,
    originalPrice: 89,
    salePrice: 69,
    image: "https://images.unsplash.com/photo-1609592909083-7e3fb50fe26c?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 20,
    name: "مروحة مكتب صامتة",
    rating: 4.4,
    reviewCount: 156,
    originalPrice: 119,
    salePrice: 89,
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 21,
    name: "لوحة مفاتيح ميكانيكية",
    rating: 4.7,
    reviewCount: 298,
    originalPrice: 189,
    salePrice: 149,
    image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 22,
    name: "ماوس لاسلكي ergonomic",
    rating: 4.3,
    reviewCount: 167,
    originalPrice: 79,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 23,
    name: "حامل هاتف مكتب متحرك",
    rating: 4.2,
    reviewCount: 89,
    originalPrice: 49,
    salePrice: 35,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 24,
    name: "عطر رجالي فاخر",
    rating: 4.6,
    reviewCount: 234,
    originalPrice: 299,
    salePrice: 199,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 25,
    name: "جاكيت شتوي دافئ",
    rating: 4.5,
    reviewCount: 187,
    originalPrice: 459,
    salePrice: 329,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 26,
    name: "حقيبة لابتوب أنيقة",
    rating: 4.4,
    reviewCount: 145,
    originalPrice: 179,
    salePrice: 129,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    isNew: true
  },
  {
    id: 27,
    name: "مقلاة سيراميك غير لاصقة",
    rating: 4.3,
    reviewCount: 98,
    originalPrice: 129,
    salePrice: 99,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    isNew: false
  },
  {
    id: 28,
    name: "ميزان ذكي لقياس الوزن",
    rating: 4.1,
    reviewCount: 67,
    originalPrice: 89,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    isNew: true
  },
  
]);
  
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
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCartItems(prev => [...prev, { ...product, quantity }]);
    }
    
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