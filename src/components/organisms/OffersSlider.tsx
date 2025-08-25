import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Tag, Gift, Truck } from "lucide-react";
import { useCart, useCartNotifications } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { api } from "@/api/api";

interface StoreProduct {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  images: string;
  created_at: string;
}

interface StoreData {
  store_id: number;
  user_id: number;
  store_name: string;
  store_address: string;
  description: string;
  images: string;
  logo_image: string;
  created_at: string;
  User: {
    username: string;
    whatsapp_number: string;
  };
  Products: StoreProduct[];
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

const OffersSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [addingStates, setAddingStates] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // استخدام Cart Context
  const { addToCart } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();

  // دالة تحويل منتج المتجر إلى منتج للنظام
  const convertStoreProductToProduct = useCallback((
    storeProduct: StoreProduct,
    storeData: StoreData
  ): Product => {
    let images: string[] = [];
    try {
      // تنظيف وتحليل صور المنتج
      const cleanImages = storeProduct.images.replace(/\\"/g, '"');
      images = JSON.parse(cleanImages);
    } catch (e) {
      console.warn("خطأ في تحليل صور المنتج:", e);
      images = ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"];
    }

    // تحديد السعر والخصم
    const originalPrice = parseFloat(storeProduct.price);
    const salePrice = originalPrice * 0.8; // خصم 20% كمثال

    return {
      id: storeProduct.product_id,
      name: storeProduct.name,
      nameAr: storeProduct.name,
      category: "store-product",
      categoryAr: "منتجات المتاجر",
      price: originalPrice,
      salePrice: salePrice,
      originalPrice: originalPrice,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      image: images[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      isNew: false,
      stock: storeProduct.stock_quantity,
      status: "active",
      description: storeProduct.description,
      descriptionAr: storeProduct.description,
      brand: storeData.store_name,
      brandAr: storeData.store_name,
      sales: Math.floor(Math.random() * 50) + 10,
      inStock: storeProduct.stock_quantity > 0,
      createdAt: storeProduct.created_at,
    };
  }, []);

  // دالة إنشاء العروض من بيانات المتاجر
  const createOffersFromStores = useCallback((storeData: StoreData[]): Offer[] => {
    const offerTypes = [
      {
        title: "خصم مميز",
        description: "على منتجات مختارة",
        discount: "20%",
        bgColor: "bg-teal-50",
        icon: <Tag className="w-5 h-5 text-teal-600" />,
      },
      {
        title: "شحن مجاني",
        description: "للطلبات فوق 200 ريال",
        discount: "مجاني",
        bgColor: "bg-emerald-50",
        icon: <Truck className="w-5 h-5 text-emerald-600" />,
      },
      {
        title: "عرض خاص",
        description: "لفترة محدودة فقط",
        discount: "30%",
        bgColor: "bg-cyan-50",
        icon: <Gift className="w-5 h-5 text-cyan-600" />,
      },
      {
        title: "تخفيضات الصيف",
        description: "على تشكيلة واسعة",
        discount: "25%",
        bgColor: "bg-blue-50",
        icon: <Tag className="w-5 h-5 text-blue-600" />,
      },
      {
        title: "عرض ترحيبي",
        description: "للعملاء الجدد",
        discount: "15%",
        bgColor: "bg-indigo-50",
        icon: <Gift className="w-5 h-5 text-indigo-600" />,
      },
    ];

    const createdOffers: Offer[] = [];
    let offerIdCounter = 1;

    storeData.forEach((store) => {
      store.Products.forEach((storeProduct, index) => {
        if (createdOffers.length >= 8) return; // حد أقصى 8 عروض

        const offerType = offerTypes[index % offerTypes.length];
        const product = convertStoreProductToProduct(storeProduct, store);

        let storeImages: string[] = [];
        try {
          storeImages = JSON.parse(store.images);
        } catch (e) {
          storeImages = [product.image];
        }

        createdOffers.push({
          id: offerIdCounter++,
          title: `${offerType.title} - ${store.store_name}`,
          description: `${offerType.description} من ${store.store_name}`,
          image: storeImages[0] || product.image,
          discount: offerType.discount,
          bgColor: offerType.bgColor,
          icon: offerType.icon,
          product: product,
        });
      });
    });

    return createdOffers;
  }, [convertStoreProductToProduct]);

  // دالة للحصول على عروض افتراضية في حالة الخطأ
  const getDefaultOffers = useCallback((): Offer[] => {
    const defaultProduct: Product = {
      id: 999,
      name: "منتج تجريبي",
      nameAr: "منتج تجريبي",
      category: "general",
      categoryAr: "عام",
      price: 200,
      salePrice: 150,
      originalPrice: 200,
      rating: 4.5,
      reviewCount: 50,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      isNew: false,
      stock: 10,
      status: "active",
      description: "منتج تجريبي للعرض",
      descriptionAr: "منتج تجريبي للعرض",
      brand: "متجر تجريبي",
      brandAr: "متجر تجريبي",
      sales: 25,
      inStock: true,
      createdAt: new Date().toISOString(),
    };

    return [
      {
        id: 1,
        title: "عرض تجريبي",
        description: "منتج تجريبي للاختبار",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
        discount: "25%",
        bgColor: "bg-teal-50",
        icon: <Tag className="w-5 h-5 text-teal-600" />,
        product: defaultProduct,
      },
    ];
  }, []);

  // دالة جلب بيانات المتاجر - مع useCallback لحل مشكلة dependency
  const fetchStoresData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // جلب بيانات عدة متاجر (يمكنك تعديل هذا حسب API الخاص بك)
      const storeIds = [1, 2, 3]; // معرفات المتاجر التي تريد جلبها
      const storePromises = storeIds.map(id => 
        api.get<StoreData>(`/stores/${id}`).catch(err => {
          console.warn(`فشل في جلب بيانات المتجر ${id}:`, err);
          return null;
        })
      );

      const storeResponses = await Promise.all(storePromises);
      const validStores = storeResponses
        .filter(response => response !== null)
        .map(response => response!.data);

      if (validStores.length === 0) {
        throw new Error("لم يتم العثور على أي متاجر");
      }

      const generatedOffers = createOffersFromStores(validStores);
      setOffers(generatedOffers);

    } catch (err: any) {
      console.error("خطأ في جلب بيانات المتاجر:", err);
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      
      // استخدام بيانات تجريبية في حالة الخطأ
      setOffers(getDefaultOffers());
    } finally {
      setLoading(false);
    }
  }, [createOffersFromStores, getDefaultOffers]);

  // جلب البيانات عند تحميل المكون - مع إضافة fetchStoresData للـ dependencies
  useEffect(() => {
    fetchStoresData();
  }, [fetchStoresData]);

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
    try {
      // تعيين حالة التحميل
      setAddingStates((prev) => ({ ...prev, [offer.id]: true }));

      // إضافة المنتج للسلة
      addToCart(offer.product, 1);

      // إظهار رسالة النجاح
      showAddToCartSuccess(offer.product.nameAr || offer.product.name, 1);

      console.log(`تم إضافة ${offer.title} للسلة`);

      // إزالة حالة التحميل بعد ثانية واحدة
      setTimeout(() => {
        setAddingStates((prev) => ({ ...prev, [offer.id]: false }));
      }, 1000);
    } catch (error) {
      console.error("خطأ في إضافة العرض للسلة:", error);

      // إزالة حالة التحميل في حالة الخطأ
      setAddingStates((prev) => ({ ...prev, [offer.id]: false }));
    }
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            العروض المميزة
            <span className="text-orange-500">🔥</span>
          </h2>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          <span className="mr-4 text-gray-600">جاري تحميل العروض...</span>
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            العروض المميزة
            <span className="text-orange-500">🔥</span>
          </h2>
        </div>
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStoresData}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // عدم عرض المكون إذا لم توجد عروض
  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          العروض المميزة
          <span className="text-orange-500">🔥</span>
        </h2>
        <button
          onClick={fetchStoresData}
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
        >
          تحديث العروض
          <span className="text-xs">🔄</span>
        </button>
      </div>

      {/* الحاوية الرئيسية */}
      <div className="relative">
        {/* زر السابق (يمين في RTL) */}
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

        {/* زر التالي (يسار في RTL) */}
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
                        target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop";
                      }}
                    />
                  </div>

                  {/* المحتوى */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 text-right">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 text-right">
                      {offer.description}
                    </p>
                    {/* معلومات المنتج */}
                    <div className="mt-2 text-xs text-gray-500 text-right">
                      <div>السعر: {offer.product.price} ريال</div>
                      <div>المخزون: {offer.product.stock} قطعة</div>
                    </div>
                  </div>

                  {/* زر العمل المحدث */}
                  <button
                    onClick={() => handleOfferClick(offer)}
                    disabled={addingStates[offer.id] || !offer.product.inStock}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center ${
                      addingStates[offer.id]
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : !offer.product.inStock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white/90 hover:bg-white text-gray-800 hover:scale-105"
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