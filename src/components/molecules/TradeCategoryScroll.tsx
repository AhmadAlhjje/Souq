// components/molecules/TradeCategoryScroll.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import TradeCard from '../atoms/TradeCard';
import ScrollButton from './ScrollButton';
import Heading from '../atoms/Heading';

interface TradeCategory {
  id: number;
  iconName: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  label: string;
  color: string;
}

const categories: TradeCategory[] = [
  { id: 1, iconName: 'facebook', label: 'إلكترونيات', color: 'from-blue-500 to-blue-600' },
  { id: 2, iconName: 'twitter', label: 'شبكات', color: 'from-cyan-500 to-cyan-600' },
  { id: 3, iconName: 'linkedin', label: 'كمبيوتر', color: 'from-indigo-500 to-indigo-600' },
  { id: 4, iconName: 'instagram', label: 'طابعات', color: 'from-pink-500 to-pink-600' },
  { id: 5, iconName: 'facebook', label: 'كهرباء', color: 'from-yellow-500 to-yellow-600' },
  { id: 6, iconName: 'twitter', label: 'صيانة', color: 'from-green-500 to-green-600' },
  { id: 7, iconName: 'linkedin', label: 'راوتر', color: 'from-purple-500 to-purple-600' },
  { id: 8, iconName: 'instagram', label: 'أبراج', color: 'from-red-500 to-red-600' },
];

const TradeCategoryScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    current?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      current?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <Heading 
          text="تصفح حسب الفئة"
          level={3}
          variant="section"
          className="text-2xl font-bold text-[#004D5A] mb-2"
        />
        <p className="text-[#004D5A]/70">اختر الفئة التي تناسب احتياجاتك</p>
      </div>

      {/* Scroll Container */}
      <div className="relative flex items-center">
        {/* Left Scroll Button */}
        <ScrollButton
          direction="left"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-0 z-10 transition-all duration-300 ${
            canScrollLeft 
              ? 'opacity-100 shadow-lg hover:shadow-xl' 
              : 'opacity-30 cursor-not-allowed'
          }`}
        />

        {/* Categories Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto px-12 py-4 mx-2 scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)'
          }}
        >
          <div className="flex space-x-6 space-x-reverse rtl:space-x-reverse">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <TradeCard
                  iconName={category.iconName}
                  label={category.label}
                  className={`bg-gradient-to-br ${category.color} hover:shadow-xl transition-all duration-300 group-hover:ring-4 group-hover:ring-white/50`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Scroll Button */}
        <ScrollButton
          direction="right"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-0 z-10 transition-all duration-300 ${
            canScrollRight 
              ? 'opacity-100 shadow-lg hover:shadow-xl' 
              : 'opacity-30 cursor-not-allowed'
          }`}
        />
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2 space-x-reverse">
        {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, index) => (
          <button
            key={index}
            title={`الانتقال للصفحة ${index + 1}`}
            className="w-2 h-2 rounded-full bg-[#004D5A]/20 hover:bg-[#004D5A]/40 transition-colors duration-200"
            onClick={() => {
              const scrollAmount = index * 280 * 3;
              scrollRef.current?.scrollTo({ 
                left: scrollAmount, 
                behavior: 'smooth' 
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TradeCategoryScroll;