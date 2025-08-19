// components/organisms/SaleProductsCarousel.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Tag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart, useCartNotifications } from '@/contexts/CartContext';

interface SaleProductsCarouselProps {
  saleProducts: Product[];
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
  onViewDetails?: (product: Product) => void;
}

const SaleProductsCarousel: React.FC<SaleProductsCarouselProps> = ({ 
  saleProducts,
  onNavigateLeft,
  onNavigateRight,
  onViewDetails
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [addingProduct, setAddingProduct] = useState<number | null>(null);
  const [successProducts, setSuccessProducts] = useState<Set<number>>(new Set());

  // استخدام CartContext
  const { addToCart, isItemInCart } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();

  // تحديد عدد الشرائح المعروضة حسب حجم الشاشة
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(4); // ديسكتوب - 4 بطاقات
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(3); // تابلت - 3 بطاقات
      } else if (window.innerWidth >= 640) {
        setSlidesToShow(2); // موبايل كبير - 2 بطاقة
      } else {
        setSlidesToShow(1); // موبايل - بطاقة واحدة
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // إعادة تعيين الفهرس عند تغيير حجم الشاشة
  useEffect(() => {
    const maxIndex = Math.max(0, saleProducts.length - slidesToShow);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [slidesToShow, currentIndex, saleProducts.length]);

  const maxIndex = Math.max(0, saleProducts.length - slidesToShow);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
      onNavigateRight?.();
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
      onNavigateLeft?.();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  const handleAddToCart = async (product: Product) => {
    // التحقق من وجود المنتج في السلة
    if (isItemInCart(product.id)) {
      console.log('المنتج موجود بالفعل في السلة');
      return; // لا تفعل شيء إذا كان موجود
    }

    try {
      setAddingProduct(product.id);
      
      // إضافة المنتج للسلة بكمية 1 فقط
      addToCart(product, 1);
      
      // إظهار رسالة النجاح
      showAddToCartSuccess(product.name, 1);
      
      // إظهار أيقونة النجاح
      setSuccessProducts(prev => new Set([...prev, product.id]));
      
      // تأثير بصري
      const button = document.querySelector(`[data-product-id="${product.id}"]`);
      if (button) {
        button.classList.add('animate-bounce');
        setTimeout(() => button.classList.remove('animate-bounce'), 600);
      }
      
      // إخفاء أيقونة النجاح بعد ثانيتين
      setTimeout(() => {
        setSuccessProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.id);
          return newSet;
        });
      }, 2000);
      
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
    } finally {
      setAddingProduct(null);
    }
  };

  const calculateDiscount = (original: number, sale: number) => {
    return Math.round(((original - sale) / original) * 100);
  };

  const getProductBgColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-teal-50 to-teal-100',
      'bg-gradient-to-br from-emerald-50 to-emerald-100', 
      'bg-gradient-to-br from-cyan-50 to-cyan-100',
      'bg-gradient-to-br from-blue-50 to-blue-100',
      'bg-gradient-to-br from-indigo-50 to-indigo-100'
    ];
    return colors[index % colors.length];
  };

  if (!saleProducts.length) {
    return (
      <div className="relative max-w-6xl mx-auto mb-8 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            العروض الخاصة
            <span className="text-orange-500">🔥</span>
          </h2>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-600">لا توجد عروض متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto mb-8 px-4" dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          العروض الخاصة
          <span className="text-orange-500">🔥</span>
        </h2>
      </div>

      {/* الحاوية الرئيسية */}
      <div className="relative">
        {/* زر السابق (يمين في RTL) */}
        <button
          onClick={prevSlide}
          disabled={!canGoPrev}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            canGoPrev 
              ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg hover:scale-110' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="العرض السابق"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* زر التالي (يسار في RTL) */}
        <button
          onClick={nextSlide}
          disabled={!canGoNext}
          className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            canGoNext 
              ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg hover:scale-110' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="العرض التالي"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* حاوية البطاقات */}
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${currentIndex * (100 / slidesToShow)}%)`
            }}
          >
            {saleProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 px-1.5"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div className={`${getProductBgColor(index)} rounded-xl p-4 h-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  {/* رأس البطاقة */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-1.5 bg-white/80 rounded-lg shadow-sm">
                      <Tag className="w-3 h-3 text-teal-600" />
                    </div>
                    <div className="text-right">
                      {product.salePrice && (
                        <>
                          <div className="text-lg font-bold text-gray-800">
                            {calculateDiscount(product.price, product.salePrice)}%
                          </div>
                          <div className="text-xs text-gray-600">خصم</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* الصورة */}
                  <div 
                    className="mb-3 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => onViewDetails?.(product)}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={140}
                      className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                      priority={index < slidesToShow}
                    />
                  </div>

                  {/* المحتوى */}
                  <div className="mb-3">
                    <h3 
                      className="text-sm font-bold text-gray-800 mb-2 text-right line-clamp-2 min-h-[2.5rem] leading-tight cursor-pointer hover:text-teal-600 transition-colors"
                      onClick={() => onViewDetails?.(product)}
                    >
                      {product.name}
                    </h3>
                    
                    {/* التقييم */}
                    <div className="flex items-center justify-end gap-1 mb-2">
                      <span className="text-xs text-gray-600">({product.rating})</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* السعر */}
                    <div className="flex items-center justify-end gap-1 text-right">
                      {product.salePrice ? (
                        <>
                          <span className="text-base font-bold text-teal-700">
                            {product.salePrice} ر.س
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-teal-700">
                          {product.price} ر.س
                        </span>
                      )}
                    </div>
                  </div>

                  {/* زر الإضافة للسلة */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    data-product-id={product.id}
                    disabled={addingProduct === product.id || isItemInCart(product.id)}
                    className={`w-full py-2 px-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs flex items-center justify-center gap-1 ${
                      isItemInCart(product.id)
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : successProducts.has(product.id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    } ${addingProduct === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isItemInCart(product.id) ? (
                      <>
                        <Check className="w-3 h-3" />
                        في السلة
                      </>
                    ) : successProducts.has(product.id) ? (
                      <>
                        <Check className="w-3 h-3" />
                        تمت الإضافة
                      </>
                    ) : addingProduct === product.id ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإضافة
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3 h-3" />
                        أضف للسلة
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* مؤشرات التنقل */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-4 gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-200 rounded-full ${
                  currentIndex === index
                    ? 'bg-teal-600 w-6 h-1.5'
                    : 'bg-gray-300 hover:bg-gray-400 w-1.5 h-1.5'
                }`}
                aria-label={`الانتقال إلى الصفحة ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleProductsCarousel;