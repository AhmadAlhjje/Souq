// components/molecules/TradeCategoryScroll.tsx

'use client'; // ✅ هذا السطر ضروري

import React, { useRef, useEffect, useState } from 'react';
import TradeCard from '../atoms/TradeCard';
import ScrollButton from './ScrollButton';

interface TradeCategory {
  id: number;
  iconName: 'facebook' | 'twitter' | 'linkedin' | 'instagram';
  label: string;
}

const categories: TradeCategory[] = [
  { id: 1, iconName: 'facebook', label: 'إلكترونيات' },
  { id: 2, iconName: 'twitter', label: 'شبكات' },
  { id: 3, iconName: 'linkedin', label: 'كمبيوتر' },
  { id: 4, iconName: 'instagram', label: 'طابعات' },
  { id: 5, iconName: 'facebook', label: 'كهرباء' },
  { id: 6, iconName: 'twitter', label: 'صيانة' },
  { id: 7, iconName: 'linkedin', label: 'رواتر' },
  { id: 8, iconName: 'instagram', label: 'أبراج' },
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
    const scrollAmount = direction === 'left' ? -200 : 200;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center px-2 md:px-4 py-1">
      <ScrollButton
        direction="left"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        
      />

      <div
        ref={scrollRef}
        className="flex flex-1 overflow-x-auto px-10 py-2 mx-1 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-6 space-x-reverse rtl:space-x-reverse">
          {categories.map((category) => (
            <TradeCard
              key={category.id}
              iconName={category.iconName}
              label={category.label}
            />
          ))}
        </div>
      </div>

      <ScrollButton
        direction="right"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
      />
    </div>
  );
};

export default TradeCategoryScroll;