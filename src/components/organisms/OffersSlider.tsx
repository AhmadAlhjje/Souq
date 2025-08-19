/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag, Gift, Truck } from "lucide-react";
import { useCart, useCartNotifications } from "@/contexts/CartContext";
import { Product } from "@/types/product";

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: string;
  bgColor: string;
  icon: React.ReactNode;
  product: Product; // إضافة منتج لكل عرض
}

const OffersSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [addingStates, setAddingStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  // استخدام Cart Context
  const { addToCart  } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();

  // منتجات تجريبية للعروض
  const offerProducts: Product[] = [
    {
      id: 201,
      name: "Electronics Offer Product",
      nameAr: "منتج عرض الإلكترونيات",
      category: "electronics",
      categoryAr: "إلكترونيات",
      price: 400,
      salePrice: 200,
      originalPrice: 400,
      rating: 4.8,
      reviewCount: 150,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      isNew: false,
      stock: 50,
      status: "active",
      description: "منتج إلكتروني مميز مع خصم 50%",
      descriptionAr: "منتج إلكتروني مميز مع خصم 50%",
      brand: "ElectroOffer",
      brandAr: "عرض إلكترو",
      sales: 100,
      inStock: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 202,
      name: "Free Shipping Product",
      nameAr: "منتج الشحن المجاني",
      category: "accessories",
      categoryAr: "إكسسوارات",
      price: 250,
      originalPrice: 250,
      rating: 4.5,
      reviewCount: 89,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      isNew: true,
      stock: 30,
      status: "active",
      description: "منتج مميز مع شحن مجاني",
      descriptionAr: "منتج مميز مع شحن مجاني",
      brand: "FreeShip",
      brandAr: "الشحن المجاني",
      sales: 60,
      inStock: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 203,
      name: "Black Friday Deal",
      nameAr: "عرض الجمعة البيضاء",
      category: "fashion",
      categoryAr: "أزياء",
      price: 300,
      salePrice: 90,
      originalPrice: 300,
      rating: 4.9,
      reviewCount: 200,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      isNew: false,
      stock: 25,
      status: "active",
      description: "منتج الجمعة البيضاء مع خصم 70%",
      descriptionAr: "منتج الجمعة البيضاء مع خصم 70%",
      brand: "BlackFriday",
      brandAr: "الجمعة البيضاء",
      sales: 150,
      inStock: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 204,
      name: "Summer Fashion",
      nameAr: "أزياء الصيف",
      category: "fashion",
      categoryAr: "أزياء",
      price: 180,
      salePrice: 108,
      originalPrice: 180,
      rating: 4.6,
      reviewCount: 75,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      isNew: false,
      stock: 40,
      status: "active",
      description: "ملابس صيفية أنيقة مع خصم 40%",
      descriptionAr: "ملابس صيفية أنيقة مع خصم 40%",
      brand: "SummerStyle",
      brandAr: "ستايل الصيف",
      sales: 80,
      inStock: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 205,
      name: "Welcome Coupon Item",
      nameAr: "منتج كوبون الترحيب",
      category: "home",
      categoryAr: "منزل ومطبخ",
      price: 120,
      salePrice: 90,
      originalPrice: 120,
      rating: 4.4,
      reviewCount: 45,
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop",
      isNew: true,
      stock: 35,
      status: "active",
      description: "منتج ترحيبي للعملاء الجدد مع خصم 25%",
      descriptionAr: "منتج ترحيبي للعملاء الجدد مع خصم 25%",
      brand: "Welcome",
      brandAr: "الترحيب",
      sales: 30,
      inStock: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const offers: Offer[] = [
    {
      id: 1,
      title: "خصم 50%",
      description: "على جميع المنتجات الإلكترونية",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      discount: "50%",
      bgColor: "bg-teal-50",
      icon: <Tag className="w-5 h-5 text-teal-600" />,
      product: offerProducts[0],
    },
    {
      id: 2,
      title: "شحن مجاني",
      description: "للطلبات فوق 200 ريال",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      discount: "مجاني",
      bgColor: "bg-emerald-50",
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      product: offerProducts[1],
    },
    {
      id: 3,
      title: "الجمعة البيضاء",
      description: "خصومات تصل إلى 70%",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
      discount: "70%",
      bgColor: "bg-cyan-50",
      icon: <Gift className="w-5 h-5 text-cyan-600" />,
      product: offerProducts[2],
    },
    {
      id: 4,
      title: "عروض الصيف",
      description: "تخفيضات على الملابس الصيفية",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      discount: "40%",
      bgColor: "bg-blue-50",
      icon: <Tag className="w-5 h-5 text-blue-600" />,
      product: offerProducts[3],
    },
    {
      id: 5,
      title: "كوبون ترحيب",
      description: "للعملاء الجدد فقط",
      image:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=250&fit=crop",
      discount: "25%",
      bgColor: "bg-indigo-50",
      icon: <Gift className="w-5 h-5 text-indigo-600" />,
      product: offerProducts[4],
    },
  ];

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

  return (
    <div className="relative max-w-7xl mx-auto mb-12 px-4" dir="rtl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          العروض المميزة
          <span className="text-orange-500">🔥</span>
        </h2>
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
                  </div>

                  {/* زر العمل المحدث */}
                  <button
                    onClick={() => handleOfferClick(offer)}
                    disabled={addingStates[offer.id]}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center ${
                      addingStates[offer.id]
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-white/90 hover:bg-white text-gray-800 hover:scale-105"
                    }`}
                  >
                    {addingStates[offer.id]
                      ? "تم الإضافة للسلة"
                      : "احصل على العرض"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* مؤشرات التنقل */}
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
