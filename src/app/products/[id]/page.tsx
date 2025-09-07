// app/products/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsPage from '@/components/templates/ProductDetailsPage';
import { Product } from '@/types/product';
import { getProduct } from '@/api/stores';
import ProductDetailsPageTemplate from '@/components/templates/ProductDetailsPageTemplate';

// نوع للمنتج من الـ API مع التفاصيل
interface ApiProductDetails {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  images: string;
  created_at: string;
  Store: {
    store_name: string;
    logo_image: string;
    description: string;
  };
  Reviews: Array<{
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

// دالة لتحويل بيانات الـ API إلى Product
const convertApiProductToProduct = (apiProduct: ApiProductDetails): Product => {
  // تحليل الصور باستخدام نفس الطريقة المستخدمة في المتاجر
  let images: string[] = [];
  try {
    const parsed = JSON.parse(apiProduct.images);
    images = Array.isArray(parsed) ? parsed : [apiProduct.images];
  } catch (error) {
    console.error('خطأ في تحليل الصور:', error);
    images = [];
  }

  // بناء رابط الصورة
  const baseImageUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.152:4000';
  const imageUrl = images.length > 0 
    ? `${baseImageUrl}/uploads/${images[0]}` 
    : '/images/default-product.jpg';

  // حساب متوسط التقييم
  const avgRating = apiProduct.Reviews.length > 0 
    ? apiProduct.Reviews.reduce((sum, review) => sum + review.rating, 0) / apiProduct.Reviews.length
    : 0;

  // تحديد إذا كان المنتج جديد (أقل من شهر)
  const createdDate = new Date(apiProduct.created_at);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const isNew = createdDate > oneMonthAgo;

  return {
    id: apiProduct.product_id,
    name: apiProduct.name,
    nameAr: apiProduct.name,
    category: 'general',
    categoryAr: 'عام',
    price: parseFloat(apiProduct.price),
    salePrice: undefined,
    originalPrice: parseFloat(apiProduct.price),
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: apiProduct.Reviews.length,
    image: imageUrl,
    isNew: isNew,
    stock: apiProduct.stock_quantity,
    status: apiProduct.stock_quantity > 0 ? 'active' as const : 'out_of_stock' as const,
    description: apiProduct.description,
    descriptionAr: apiProduct.description,
    brand: apiProduct.Store.store_name,
    brandAr: apiProduct.Store.store_name,
    sales: Math.floor(Math.random() * 100) + 5,
    inStock: apiProduct.stock_quantity > 0,
    createdAt: apiProduct.created_at,
    storeInfo: {
      store_name: apiProduct.Store.store_name,
      store_description: apiProduct.Store.description,
      logo_image: apiProduct.Store.logo_image
    },
    reviews: apiProduct.Reviews,
    // إضافة الصور كحقل منفصل
    ...({ images: apiProduct.images })
  } as Product;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params?.id as string);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || isNaN(productId)) {
        setError('معرف المنتج غير صحيح');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`🔄 جلب المنتج برقم ${productId}...`);
        const productData = await getProduct(productId);
        
        console.log('✅ تم جلب المنتج:', productData);
        const convertedProduct = convertApiProductToProduct(productData);
        setProduct(convertedProduct);
        
      } catch (err: any) {
        console.error('❌ خطأ في جلب المنتج:', err);
        
        if (err.response?.status === 404) {
          setError('المنتج غير موجود');
        } else if (err.response?.status === 403) {
          setError('ليس لديك صلاحية لعرض هذا المنتج');
        } else if (err.response?.status >= 500) {
          setError('خطأ في الخادم، يرجى المحاولة لاحقاً');
        } else if (!err.response) {
          setError('خطأ في الاتصال، تحقق من الإنترنت');
        } else {
          setError(err.response?.data?.message || 'حدث خطأ في جلب المنتج');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل تفاصيل المنتج...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center font-cairo" style={{ backgroundColor: '#F6F8F9' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error === 'المنتج غير موجود' ? 'المنتج غير موجود' : 'خطأ في التحميل'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'حدث خطأ أثناء تحميل المنتج'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => router.back()}
              className="w-full border border-teal-600 text-teal-600 px-6 py-3 rounded-lg hover:bg-teal-50 transition-colors"
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }
const handleAddToCart = (productId: string | number, quantity: number) => {
  console.log(`إضافة ${quantity} من ${product.nameAr} للسلة`);
  // هنا يمكنك إضافة منطق إضافة المنتج للسلة الفعلي
};

const handleBuyNow = (productId: string | number, quantity: number) => {
  console.log(`شراء فوري لـ ${quantity} من ${product.nameAr}`);
  // هنا يمكنك إضافة منطق الشراء المباشر
};

const handleBackToProducts = () => {
  router.back();
};

return (
  <ProductDetailsPageTemplate
    product={product}
    onAddToCart={handleAddToCart}
    onBuyNow={handleBuyNow}
    onBackToProducts={handleBackToProducts}
  />
);
}