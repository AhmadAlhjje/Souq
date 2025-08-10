import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, Gift, Truck } from 'lucide-react';

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: string;
  bgColor: string;
  icon: React.ReactNode;
}

const OffersSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const offers: Offer[] = [
    {
      id: 1,
      title: "خصم 50%",
      description: "على جميع المنتجات الإلكترونية",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      discount: "50%",
      bgColor: "bg-teal-50",
      icon: <Tag className="w-5 h-5 text-teal-600" />
    },
    {
      id: 2,
      title: "شحن مجاني",
      description: "للطلبات فوق 200 ريال",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      discount: "مجاني",
      bgColor: "bg-emerald-50",
      icon: <Truck className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 3,
      title: "الجمعة البيضاء",
      description: "خصومات تصل إلى 70%",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
      discount: "70%",
      bgColor: "bg-cyan-50",
      icon: <Gift className="w-5 h-5 text-cyan-600" />
    },
    {
      id: 4,
      title: "عروض الصيف",
      description: "تخفيضات على الملابس الصيفية",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      discount: "40%",
      bgColor: "bg-blue-50",
      icon: <Tag className="w-5 h-5 text-blue-600" />
    },
    {
      id: 5,
      title: "كوبون ترحيب",
      description: "للعملاء الجدد فقط",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=250&fit=crop",
      discount: "25%",
      bgColor: "bg-indigo-50",
      icon: <Gift className="w-5 h-5 text-indigo-600" />
    }
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
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
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
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
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
              ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-110' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
              ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-110' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
              transform: `translateX(${currentIndex * (100 / slidesToShow)}%)`
            }}
          >
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div className={`${offer.bgColor} rounded-2xl p-6 h-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}>
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

                  {/* زر العمل */}
                  <button className="w-full bg-white/90 hover:bg-white text-gray-800 py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md text-center">
                    احصل على العرض
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
                  ? 'bg-teal-500 w-8 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
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
              width: `${((currentIndex + slidesToShow) / offers.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OffersSlider;