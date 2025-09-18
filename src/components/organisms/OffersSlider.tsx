// components/organisms/OffersSlider.tsx - النسخة المُصححة والكاملة مع دعم الثيم
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Tag, Gift, Truck } from "lucide-react";
import { Product } from '@/api/storeProduct';
import { api } from "@/api/api";
import { useCart } from '@/hooks/useCart';
import { useSessionContext } from '@/components/SessionProvider';

// نوع المنتج من API مع التحديثات الجديدة
interface ApiProduct {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  discount_percentage: string | null;
  stock_quantity: number;
  images: string | string[]; // يمكن أن يكون string أو مصفوفة
  created_at: string;
  Store?: {
    store_name: string;
    logo_image: string;
  };
  discounted_price: number;
  discount_amount: number;
  has_discount: boolean;
  original_price: number;
  averageRating?: number;
  reviewsCount?: number;
}

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: string;
  bgColor: string;
  icon: React.ReactNode;
  product: Product;
}

interface OffersSliderProps {
  storeId?: number;
  storeName?: string;
  theme?: 'light' | 'dark';
}

const OffersSlider: React.FC<OffersSliderProps> = ({ storeId, storeName, theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [addingStates, setAddingStates] = useState<{ [key: number]: boolean }>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart: addToCartAPI, fetchCart } = useCart();
  const { sessionId } = useSessionContext();

  // استخدام theme المُمرر كـ prop أو الافتراضي
  const currentTheme = theme || 'light';
  const isDark = currentTheme === 'dark';
  const isLight = currentTheme === 'light';

  const DEFAULT_OFFER_IMAGE = "https://placehold.co/400x250/00C8B8/FFFFFF?text=متجر";

  // دالة للحصول على ألوان النص حسب الثيم
  const getTextColor = (type: 'primary' | 'secondary' | 'muted') => {
    if (isLight) {
      switch (type) {
        case 'primary': return 'text-gray-800';
        case 'secondary': return 'text-gray-600';
        case 'muted': return 'text-gray-500';
        default: return 'text-gray-800';
      }
    } else {
      switch (type) {
        case 'primary': return 'text-white';
        case 'secondary': return 'text-gray-300';
        case 'muted': return 'text-gray-400';
        default: return 'text-white';
      }
    }
  };

  // دالة مُصححة لمعالجة الصور - تدعم المصفوفات والنصوص
  const processProductImages = useCallback((
    images: string | string[] | undefined | null
  ): string[] => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";
    
    console.log("🖼️ معالجة صور المنتج:", {
      data: images,
      type: typeof images,
      isArray: Array.isArray(images)
    });

    if (!images || images === null || images === undefined) {
      console.log("📷 لا توجد صور");
      return [DEFAULT_OFFER_IMAGE];
    }

    try {
      // إذا كانت مصفوفة بالفعل
      if (Array.isArray(images)) {
        console.log("✅ الصور عبارة عن مصفوفة:", images);
        
        const validImages = images
          .filter(img => img && typeof img === 'string' && img.trim() !== '' && img !== 'null')
          .map(img => {
            if (img.startsWith('http')) {
              return img;
            } else if (img.startsWith('/uploads')) {
              return `${baseUrl}${img}`;
            } else {
              return `${baseUrl}/${img.replace(/^\/+/, '')}`;
            }
          });
        
        return validImages.length > 0 ? validImages : [DEFAULT_OFFER_IMAGE];
      }
      
      // إذا كانت string
      if (typeof images === 'string') {
        const trimmedImages = images.trim();
        
        if (trimmedImages === '' || trimmedImages === 'null') {
          console.log("📷 نص فارغ");
          return [DEFAULT_OFFER_IMAGE];
        }
        
        // محاولة تحليل JSON
        if (trimmedImages.startsWith('[') || trimmedImages.startsWith('{')) {
          try {
            // تنظيف النص أولاً قبل التحليل
            const cleanImages = trimmedImages.replace(/\\"/g, '"');
            const parsed = JSON.parse(cleanImages);
            
            console.log("✅ تم تحليل JSON بنجاح:", parsed);
            
            if (Array.isArray(parsed)) {
              const validImages = parsed
                .filter(img => img && typeof img === 'string' && img.trim() !== '' && img !== 'null')
                .map(img => {
                  if (img.startsWith('http')) {
                    return img;
                  } else if (img.startsWith('/uploads')) {
                    return `${baseUrl}${img}`;
                  } else {
                    return `${baseUrl}/${img.replace(/^\/+/, '')}`;
                  }
                });
              
              return validImages.length > 0 ? validImages : [DEFAULT_OFFER_IMAGE];
            }
          } catch (jsonError) {
            console.warn("❌ خطأ في تحليل JSON:", jsonError);
          }
        } else {
          // معاملة كصورة واحدة
          const imageUrl = trimmedImages.startsWith('http') 
            ? trimmedImages 
            : `${baseUrl}/${trimmedImages.replace(/^\/+/, '')}`;
          
          console.log("📷 صورة واحدة:", imageUrl);
          return [imageUrl];
        }
      }
      
      console.log("⚠️ نوع غير متوقع، استخدام الافتراضية");
      return [DEFAULT_OFFER_IMAGE];
    } catch (err) {
      console.error("❌ خطأ في معالجة الصور:", err);
      return [DEFAULT_OFFER_IMAGE];
    }
  }, []);

  // دالة تحويل مُصححة
  const convertApiProductToProduct = useCallback((
    apiProduct: ApiProduct
  ): Product => {
    const processedImages = processProductImages(apiProduct.images);
    const mainImage = processedImages[0]; // أخذ أول صورة صالحة

    // فحص إذا كانت الصورة حقيقية أم افتراضية
    const isRealImage = mainImage && 
                       !mainImage.includes('placehold.co') && 
                       !mainImage.includes('unsplash.com') &&
                       mainImage !== DEFAULT_OFFER_IMAGE;

    console.log(`🖼️ صورة المنتج ${apiProduct.product_id}:`, {
      original: apiProduct.images,
      processed: mainImage,
      isReal: isRealImage
    });

    // تحديد حالة المنتج
    let productStatus: "active" | "out_of_stock" | "low_stock";
    
    if (apiProduct.stock_quantity <= 0) {
      productStatus = "out_of_stock";
    } else if (apiProduct.stock_quantity <= 5) {
      productStatus = "low_stock";
    } else {
      productStatus = "active";
    }

    return {
      id: apiProduct.product_id,
      name: apiProduct.name,
      nameAr: apiProduct.name,
      category: "store-product",
      categoryAr: "منتجات المتاجر",
      price: apiProduct.has_discount ? apiProduct.discounted_price : apiProduct.original_price,
      salePrice: apiProduct.has_discount ? apiProduct.discounted_price : undefined,
      originalPrice: apiProduct.original_price,
      rating: apiProduct.averageRating || 4.5,
      reviewCount: apiProduct.reviewsCount || Math.floor(Math.random() * 100) + 10,
      image: mainImage, // استخدام الصورة المعالجة
      isNew: false,
      stock: apiProduct.stock_quantity,
      status: productStatus,
      description: apiProduct.description,
      descriptionAr: apiProduct.description,
      brand: apiProduct.Store?.store_name || storeName || "متجر محلي",
      brandAr: apiProduct.Store?.store_name || storeName || "متجر محلي",
      sales: Math.floor(Math.random() * 50) + 10,
      inStock: apiProduct.stock_quantity > 0,
      createdAt: apiProduct.created_at,
      
      // الحقول الجديدة للخصومات
      discountPercentage: apiProduct.discount_percentage ? parseFloat(apiProduct.discount_percentage) : undefined,
      discountAmount: apiProduct.has_discount ? apiProduct.discount_amount : undefined,
      hasDiscount: apiProduct.has_discount,
    };
  }, [processProductImages, storeName]);

  // دالة إنشاء العروض من المنتجات المخفضة
  const createOffersFromProducts = useCallback((products: ApiProduct[]): Offer[] => {
    const offerTypes = [
      {
        title: "خصم مميز",
        description: "عرض لفترة محدودة",
        bgColor: "bg-gray-50",
        icon: <Tag className="w-5 h-5 text-gray-700" />,
        borderColor: "border border-gray-100",
      },
      {
        title: "تخفيضات هائلة",
        description: "وفر أكثر مع هذا العرض",
        bgColor: "bg-gray-50",
        icon: <Gift className="w-5 h-5 text-gray-700" />,
        borderColor: "border border-gray-100",
      },
      {
        title: "عرض حصري",
        description: "احصل عليه قبل انتهاء الكمية",
        bgColor: "bg-gray-50",
        icon: <Tag className="w-5 h-5 text-gray-700" />,
        borderColor: "border border-gray-100",
      },
      {
        title: "خصم استثنائي",
        description: "فرصة ذهبية للتوفير",
        bgColor: "bg-gray-50",
        icon: <Gift className="w-5 h-5 text-gray-700" />,
        borderColor: "border border-gray-100",
      },
      {
        title: "تخفيض كبير",
        description: "عرض محدود الوقت",
        bgColor: "bg-gray-50",
        icon: <Tag className="w-5 h-5 text-gray-700" />,
        borderColor: "border border-gray-100",
      },
    ];

    const createdOffers: Offer[] = [];
    
    products.forEach((apiProduct, index) => {
      if (createdOffers.length >= 8) return; // حد أقصى 8 عروض

      const offerType = offerTypes[index % offerTypes.length];
      const product = convertApiProductToProduct(apiProduct);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";

      // تحديد صورة العرض بنفس منطق المنتج
      let offerImage = product.image; // استخدام نفس الصورة المعالجة
      
      // إذا لم تكن هناك صورة صالحة، حاول استخدام شعار المتجر
      if (!offerImage || offerImage === DEFAULT_OFFER_IMAGE) {
        if (apiProduct.Store?.logo_image) {
          if (apiProduct.Store.logo_image.startsWith('/uploads')) {
            offerImage = `${baseUrl}${apiProduct.Store.logo_image}`;
          } else if (apiProduct.Store.logo_image.startsWith('http')) {
            offerImage = apiProduct.Store.logo_image;
          } else {
            offerImage = `${baseUrl}/${apiProduct.Store.logo_image}`;
          }
        } else {
          offerImage = DEFAULT_OFFER_IMAGE;
        }
      }

      const storeDisplayName = apiProduct.Store?.store_name || storeName || "متجر محلي";

      createdOffers.push({
        id: apiProduct.product_id,
        title: storeId 
          ? `${offerType.title} - ${apiProduct.name}`
          : `${offerType.title} - ${storeDisplayName}`,
        description: storeId 
          ? `${offerType.description} في ${storeName}`
          : `${offerType.description} من ${storeDisplayName}`,
        image: offerImage,
        discount: `${apiProduct.discount_percentage}%`,
        bgColor: offerType.bgColor,
        icon: offerType.icon,
        product: product,
      });
    });

    return createdOffers;
  }, [convertApiProductToProduct, storeId, storeName]);

  // دالة جلب المنتجات المخفضة من API
  const fetchDiscountedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '/products';
      let logMessage = "جلب جميع المنتجات";
      
      if (storeId) {
        endpoint = `/stores/${storeId}`;
        logMessage = `جلب منتجات المتجر ${storeId}`;
      }

      console.log(`🔄 ${logMessage} من ${endpoint}...`);
      const response = await api.get(endpoint);
      
      let products: ApiProduct[] = [];
      
      if (storeId) {
        console.log("📦 رد API للمتجر:", response.data);
        
        let storeData = response.data;
        if (storeData.success && storeData.store) {
          storeData = storeData.store;
        }
        
        if (storeData.products && !storeData.Products) {
          storeData.Products = storeData.products;
        }
        
        products = storeData.Products || [];
        console.log(`📊 منتجات المتجر ${storeId}:`, products.length);
      } else {
        products = Array.isArray(response.data) ? response.data : [];
        console.log("📊 إجمالي المنتجات المستلمة:", products.length);
      }
      
      if (products.length > 0) {
        console.log("📊 أول منتج للتحقق:", products[0]);
      }
      
      // تصفية المنتجات التي لديها خصم فقط
      const discountedProducts = products.filter(product => {
        console.log(`🔍 فحص المنتج ${product.product_id}: has_discount = ${product.has_discount}, type = ${typeof product.has_discount}`);
        return product.has_discount === true;
      });
      
      console.log(`📊 المنتجات المخفضة الموجودة:`, discountedProducts);
      console.log(`📊 عدد المنتجات المخفضة: ${discountedProducts.length} من أصل ${products.length}`);
      
      if (discountedProducts.length === 0) {
        const noOffersMessage = storeId 
          ? `لا توجد منتجات مخفضة في ${storeName}`
          : "لا توجد منتجات مخفضة حالياً";
        console.warn(`⚠️ ${noOffersMessage}`);
        setOffers([]);
        return;
      }

      const generatedOffers = createOffersFromProducts(discountedProducts);
      console.log("🎁 العروض المُنشأة:", generatedOffers);
      
      setOffers(generatedOffers);
    } catch (err: any) {
      console.error("❌ خطأ في جلب المنتجات المخفضة:", err);
      setError(err.message || "حدث خطأ أثناء جلب العروض");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, [createOffersFromProducts, storeId, storeName]);

  // جلب البيانات عند تحميل المكون أو تغيير storeId
  useEffect(() => {
    fetchDiscountedProducts();
  }, [fetchDiscountedProducts]);

  // تحديد عدد الشرائح المعروضة حسب حجم الشاشة
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth >= 1024) {
        setSlidesToShow(3); // ديسكتوب
      } else if (window.innerWidth >= 768) {
        setSlidesToShow(2); // تابلت
      } else {
        setSlidesToShow(1); // موبايل
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // إعادة تعيين الفهرس عند تغيير حجم الشاشة
  useEffect(() => {
    const maxIndex = Math.max(0, offers.length - slidesToShow);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [slidesToShow, currentIndex, offers.length]);

  const maxIndex = Math.max(0, offers.length - slidesToShow);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // دالة إضافة المنتج للسلة
  const handleOfferClick = async (offer: Offer) => {
    if (!sessionId) {
      console.warn("❌ لا يمكن الإضافة بدون معرف جلسة.");
      return;
    }

    if (!offer.product.inStock) {
      console.warn(`❌ المنتج "${offer.product.name}" غير متوفر.`);
      return;
    }

    if (addingStates[offer.id]) return;

    try {
      setAddingStates((prev) => ({ ...prev, [offer.id]: true }));

      await addToCartAPI(offer.product.id, 1);
      await fetchCart();

      console.log(`✅ تم إضافة ${offer.product.name} إلى السلة`);

      setTimeout(() => {
        setAddingStates((prev) => ({ ...prev, [offer.id]: false }));
      }, 1000);
    } catch (error) {
      console.error("❌ خطأ في إضافة العرض للسلة:", error);
      setAddingStates((prev) => ({ ...prev, [offer.id]: false }));
    }
  };

  // تحديد العنوان حسب نوع العروض
  const getTitle = () => {
    if (storeId && storeName) {
      return `عروض ${storeName}`;
    }
    return "العروض المميزة";
  };

  // تحديد رسالة عدم وجود عروض
  const getNoOffersMessage = () => {
    if (storeId && storeName) {
      return `لا توجد عروض مخفضة متاحة في ${storeName} حالياً`;
    }
    return "لا توجد عروض مخفضة متاحة حالياً";
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
      <h2 className={`text-2xl md:text-3xl font-bold flex items-center gap-2 ${getTextColor('primary')} transition-colors duration-300`}>
            {getTitle()}
            <span className="text-orange-500">🔥</span>
          </h2>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          <span className={`mr-4 ${getTextColor('secondary')} transition-colors duration-300`}>جاري تحميل العروض...</span>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold flex items-center gap-2 ${getTextColor('primary')} transition-colors duration-300`}>
            {getTitle()}
            <span className="text-orange-500">🔥</span>
          </h2>
        </div>
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">❌</div>
          <p className={`${getTextColor('secondary')} mb-4 transition-colors duration-300`}>حدث خطأ في تحميل العروض</p>
          <button
            onClick={fetchDiscountedProducts}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // عدم عرض المكون إذا لم توجد عروض حقيقية
  if (offers.length === 0) {
    return (
      <div className="relative max-w-7xl mx-auto mb-4 px-4" dir="rtl">
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎁</div>
          <p className={`${getTextColor('muted')} text-sm transition-colors duration-300`}>{getNoOffersMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl md:text-3xl font-bold flex items-center gap-2 ${getTextColor('primary')} transition-colors duration-300`}>
          {getTitle()}
          <span className="text-orange-500">🔥</span>
        </h2>
      </div>

      {/* الحاوية الرئيسية */}
      <div className="relative">
        {/* أزرار التنقل */}
        <button
          onClick={prevSlide}
          disabled={!canGoPrev}
          className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            canGoPrev
              ? "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-110"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="العرض السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          disabled={!canGoNext}
          className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
            canGoNext
              ? "bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-110"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="العرض التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* حاوية البطاقات */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${currentIndex * (100 / slidesToShow)}%)`,
            }}
          >
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div
                  className={`${offer.bgColor} rounded-2xl p-6 h-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
                >
                  {/* رأس البطاقة */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                      {offer.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {offer.discount}
                      </div>
                      <div className="text-sm text-gray-600">خصم</div>
                    </div>
                  </div>

                  {/* الصورة */}
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-32 object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_OFFER_IMAGE;
                      }}
                    />
                  </div>

                  {/* المحتوى */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 text-right">
                      {offer.product.nameAr || offer.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 text-right">
                      {offer.description}
                    </p>
                    {/* معلومات السعر */}
                    <div className="mt-2 text-xs text-gray-600 text-right">
                      <div className="flex items-center justify-between">
                        <span className="line-through text-gray-400">
                          {offer.product.originalPrice} ريال
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {offer.product.salePrice} ريال
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        المخزون: {offer.product.stock} قطعة
                      </div>
                    </div>
                  </div>

                  {/* زر العمل */}
                  <button
                    onClick={() => handleOfferClick(offer)}
                    disabled={addingStates[offer.id] || !offer.product.inStock}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center ${
                      addingStates[offer.id]
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : !offer.product.inStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105"
                    }`}
                  >
                    {addingStates[offer.id]
                      ? "تم الإضافة للسلة"
                      : !offer.product.inStock
                      ? "غير متوفر"
                      : "احصل على العرض"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* مؤشرات التنقل */}
        {maxIndex > 0 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-200 rounded-full ${
                  currentIndex === index
                    ? "bg-teal-500 w-8 h-2"
                    : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
                }`}
                aria-label={`الانتقال إلى الصفحة ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* شريط التقدم */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentIndex + slidesToShow) / offers.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OffersSlider;