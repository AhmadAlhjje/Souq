'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailsPageTemplate from '@/components/templates/ProductDetailsPageTemplate';
import { Product } from '@/types/product';
import { getProduct } from '@/api/stores';
import { useCart } from '@/hooks/useCart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { useThemeContext } from '@/contexts/ThemeContext';

// دالة محسّنة لتحليل الصور
const parseImagesSafe = (images: string | string[] | null): string[] => {
  console.log('🖼️ تحليل الصور - البيانات الأولية:', images);
  
  if (!images) {
    console.log('🚫 لا توجد صور');
    return [];
  }

  if (Array.isArray(images)) {
    console.log('✅ الصور عبارة عن مصفوفة:', images);
    return images.filter(img => img && img.trim() !== '');
  }

  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      console.log('🔄 تم تحليل JSON:', parsed);
      
      if (Array.isArray(parsed)) {
        return parsed.filter(img => img && img.trim() !== '');
      } else {
        return [parsed].filter(img => img && img.trim() !== '');
      }
    } catch (error) {
      console.log('📝 النص ليس JSON، معاملة كاسم ملف:', images);
      return images.trim() ? [images.trim()] : [];
    }
  }

  console.log('⚠️ نوع غير متوقع للصور:', typeof images);
  return [];
};

// دالة لبناء رابط الصورة
const buildImageUrl = (imageName: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const cleanImageName = imageName.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
  const fullUrl = `${baseUrl}/uploads/${cleanImageName}`;
  console.log('🔗 رابط الصورة المبني:', fullUrl);
  return fullUrl;
};

// ✅ تعريف ApiProductDetails هنا — داخل الملف
interface ApiProductDetails {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  discount_percentage?: string | null;
  stock_quantity: number;
  images: string | string[] | null;
  created_at: string;
  discounted_price?: number;
  discount_amount?: number;
  has_discount?: boolean;
  original_price?: number;
  Store: {
    store_id?: number;
    store_name: string;
    logo_image: string;
    description: string;
  };
  Reviews?: Array<{
    review_id: number;
    product_id: number;
    reviewer_name: string;
    reviewer_phone?: string;
    rating: number;
    comment: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  }>;
  reviewsData?: {
    total: number;
    verified: number;
    pending: number;
    averageRating: number;
    overallAverageRating: number;
    ratingDistribution: {
      [key: string]: number;
    };
    reviews: Array<{
      review_id: number;
      product_id: number;
      reviewer_name: string;
      reviewer_phone?: string;
      rating: number;
      comment: string;
      is_verified: boolean;
      created_at: string;
      updated_at: string;
    }>;
    latestVerified: any[];
    performance: {
      excellentReviews: number;
      poorReviews: number;
      averageReviews: number;
      recommendationRate: number;
    };
  };
}

// ✅ تعريف convertApiProductToProduct هنا — داخل الملف
const convertApiProductToProduct = (apiProduct: ApiProductDetails): Product => {
  console.log('🔄 بدء تحويل المنتج:', apiProduct);
  console.log('📝 فحص reviewsData في التحويل:', apiProduct.reviewsData);

  const imageNames = parseImagesSafe(apiProduct.images);
  const imageUrls = imageNames.map(name => buildImageUrl(name));
  const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : '/images/default-product.jpg';
  
  // معالجة التقييمات من reviewsData أو Reviews
  let avgRating = 0;
  let reviewCount = 0;
  
  if (apiProduct.reviewsData) {
    avgRating = apiProduct.reviewsData.averageRating || 0;
    reviewCount = apiProduct.reviewsData.total || 0;
    console.log('📊 استخدام reviewsData:', { avgRating, reviewCount });
  } else if (apiProduct.Reviews && apiProduct.Reviews.length > 0) {
    avgRating = apiProduct.Reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / apiProduct.Reviews.length;
    reviewCount = apiProduct.Reviews.length;
    console.log('📊 استخدام Reviews:', { avgRating, reviewCount });
  }

  const createdDate = new Date(apiProduct.created_at);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const isNew = createdDate > oneMonthAgo;

  let status: 'active' | 'out_of_stock' | 'low_stock' = 'active';
  if (apiProduct.stock_quantity === 0) {
    status = 'out_of_stock';
  } else if (apiProduct.stock_quantity > 0 && apiProduct.stock_quantity <= 5) {
    status = 'low_stock';
  }

  const originalPrice = parseFloat(apiProduct.price) || 0;
  let salePrice: number | undefined;
  let hasDiscount = false;
  let discountAmount = 0;
  let discountPercentage = 0;

  if (apiProduct.has_discount && apiProduct.discounted_price) {
    salePrice = apiProduct.discounted_price;
    hasDiscount = true;
    discountAmount = originalPrice - salePrice;
    discountPercentage = Math.round((discountAmount / originalPrice) * 100);
  } else if (apiProduct.discount_percentage && parseFloat(apiProduct.discount_percentage) > 0) {
    discountPercentage = parseFloat(apiProduct.discount_percentage);
    discountAmount = (originalPrice * discountPercentage) / 100;
    salePrice = originalPrice - discountAmount;
    hasDiscount = true;
  }

  const convertedProduct: Product = {
    id: apiProduct.product_id,
    name: apiProduct.name || '',
    nameAr: apiProduct.name || '',
    category: 'general',
    categoryAr: 'عام',
    price: hasDiscount && salePrice ? salePrice : originalPrice,
    salePrice: hasDiscount ? salePrice : undefined,
    originalPrice: apiProduct.original_price || originalPrice,
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: reviewCount,
    image: primaryImageUrl,
    images: imageUrls,
    isNew,
    stock: apiProduct.stock_quantity || 0,
    inStock: apiProduct.stock_quantity > 0,
    status,
    description: apiProduct.description || '',
    descriptionAr: apiProduct.description || '',
    brand: apiProduct.Store?.store_name || 'غير محدد',
    brandAr: apiProduct.Store?.store_name || 'غير محدد',
    sales: Math.floor(Math.random() * 100) + 5,
    createdAt: apiProduct.created_at,
    discountPercentage,
    discountAmount,
    hasDiscount,
    reviewsData: apiProduct.reviewsData,
  } as any;

  console.log('✅ المنتج بعد التحويل مع reviewsData:', convertedProduct);
  console.log('📝 reviewsData في المنتج النهائي:', convertedProduct.reviewsData);
  
  return convertedProduct;
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useThemeContext();

  const rawId = params?.id;
  const productId = rawId && !isNaN(Number(rawId)) ? parseInt(rawId as string, 10) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('جاري تحميل بيانات المنتج...');

  const { addToCart, fetchCart } = useCart();
  const { showToast } = useToast();

  const loadingMessages = useMemo(() => [
    'البحث عن تفاصيل المنتج...',
    'تحميل الصور والمعلومات...',
    'إعداد صفحة المنتج...',
    'جاري تحضير العرض...'
  ], []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 1500);

    const fetchProduct = async () => {
      if (!productId) {
        console.error('❌ معرف المنتج غير صحيح:', rawId);
        setError('معرف المنتج غير صحيح');
        setLoading(false);
        clearInterval(messageInterval);
        return;
      }

      try {
        console.log('🔄 بدء جلب المنتج برقم:', productId);
        setLoading(true);
        setError(null);
        setLoadingMessage('جاري الاتصال بالخادم...');

        const apiResponse = await getProduct(productId);
        console.log('📦 استجابة API الخام:', apiResponse);

        let productData: ApiProductDetails; // ✅ الآن TypeScript يعرف هذا النوع

        if (apiResponse && typeof apiResponse === 'object' && 'product' in apiResponse) {
          productData = apiResponse.product;
          console.log('✅ تم استخراج المنتج من response.product');
        } else if (apiResponse && 'product_id' in apiResponse) {
          productData = apiResponse;
          console.log('✅ البيانات مباشرة كمنتج');
        } else {
          console.error('❌ تنسيق استجابة غير متوقع:', apiResponse);
          throw new Error('تنسيق استجابة API غير متوقع');
        }

        console.log('📋 بيانات المنتج المستخرجة:', productData);

        if (!productData) {
          throw new Error('لم يتم العثور على بيانات المنتج');
        }

        setLoadingMessage('جاري معالجة البيانات...');
        await new Promise(resolve => setTimeout(resolve, 500));

        const convertedProductData = {
          ...productData,
          Reviews: productData.reviewsData?.reviews || productData.Reviews || [],
          Store: productData.Store || {
            store_name: 'متجر غير محدد',
            logo_image: '',
            description: ''
          }
        };

        const converted = convertApiProductToProduct(convertedProductData); // ✅ الآن TypeScript يعرف هذه الدالة
        console.log('🎯 المنتج النهائي بعد التحويل:', converted);

        setProduct(converted);
        console.log('✅ تم تعيين المنتج في الحالة');

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
          setError(err.response?.data?.message || err.message || 'حدث خطأ في جلب المنتج');
        }
      } finally {
        setLoading(false);
        clearInterval(messageInterval);
      }
    };

    fetchProduct();

    return () => {
      clearInterval(messageInterval);
    };
  }, [productId, rawId, loadingMessages]);

  const handleBuyNow = async (pid: string | number, qty: number) => {
    try {
      console.log('🛒 شراء المنتج:', { pid, qty });
      
      if (product) {
        const productIdNum = Number(pid);
        await addToCart(productIdNum, qty);
        await fetchCart();
        
        showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح!`, "success");
      }
      
      router.push('/Shipping');
    } catch (error) {
      console.error('❌ خطأ في الشراء:', error);
      
      let errorMessage = 'حدث خطأ أثناء معالجة طلبك.';
      
      if (error instanceof Error) {
        if (error.message.includes('الكمية المطلوبة غير متوفرة')) {
          errorMessage = 'الكمية المطلوبة غير متوفرة في المخزون.';
        } else if (error.message.includes('المخزون غير كافٍ')) {
          errorMessage = 'المخزون غير كافي لهذه الكمية.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showToast(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)' 
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #F1F3F4 100%)',
        }}
      >
        <LoadingSpinner
          size="lg"
          color="green"
          message={loadingMessage}
          overlay={false}
          pulse={true}
          dots={true}
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center font-cairo"
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)' 
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #F1F3F4 100%)',
        }}
      >
        <div className={`text-center max-w-md mx-auto p-8 rounded-2xl shadow-lg ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>
            {error === 'المنتج غير موجود' ? 'المنتج غير موجود' : 'خطأ في التحميل'}
          </h2>
          <p className={`mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {error || 'حدث خطأ أثناء تحميل المنتج'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                window.location.reload();
              }}
              className={`w-full px-6 py-3 rounded-lg transition-colors ${
                isDark
                  ? 'bg-teal-700 hover:bg-teal-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              إعادة المحاولة
            </button>
            <button
              onClick={() => router.back()}
              className={`w-full px-6 py-3 rounded-lg transition-colors ${
                isDark
                  ? 'border border-teal-600 text-teal-400 hover:bg-teal-900/30'
                  : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
              }`}
            >
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎬 عرض ProductDetailsPageTemplate مع المنتج:', product.name);

  return (
    <ProductDetailsPageTemplate
      product={product}
      onBuyNow={handleBuyNow}
      onBackToProducts={() => router.back()}
      loading={loading}
    />
  );
}