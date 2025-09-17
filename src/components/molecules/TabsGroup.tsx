import React, { useRef, useState, useEffect } from 'react';
import { Package, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import TabButton from '../atoms/TabButton';
import { TabType, OrderStats } from '../../types/orders';

interface TabsGroupProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  stats: OrderStats;
  isDark: boolean;
}

const TabsGroup: React.FC<TabsGroupProps> = ({
  activeTab,
  onTabChange,
  stats,
  isDark
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const tabs = [
    { id: "all" as TabType, label: "كل الطلبات", icon: Package, count: stats.totalOrders },
    { id: "shipped" as TabType, label: "الطلبات المشحونة", icon: Check, count: stats.shippedOrders },
    { id: "unshipped" as TabType, label: "الطلبات غير المشحونة", icon: X, count: stats.unshippedOrders },
    { id: "monitored" as TabType, label: "الطلبات المرصودة", icon: Eye, count: stats.monitoredOrders || 0 },
  ];

  // التحقق من حالة التمرير
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  // التمرير إلى اليسار
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  // التمرير إلى اليمين
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  // مراقبة تغيير حجم الشاشة والتمرير
  useEffect(() => {
    checkScrollability();
    
    const handleResize = () => checkScrollability();
    const handleScroll = () => checkScrollability();

    window.addEventListener('resize', handleResize);
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative mb-6" dir="rtl">
      {/* زر التمرير الأيسر */}
      {showScrollButtons && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDark
              ? "bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white shadow-lg border border-gray-600/50"
              : "bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg border border-gray-300/50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* زر التمرير الأيمن */}
      {showScrollButtons && canScrollRight && (
        <button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDark
              ? "bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white shadow-lg border border-gray-600/50"
              : "bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 shadow-lg border border-gray-300/50"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* حاوي التمرير */}
      <div className={`overflow-hidden ${showScrollButtons ? 'mx-10' : ''}`}>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* حاوي التبويبات */}
          <div
            className={`flex rounded-xl min-w-max ${
              isDark
                ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                : "bg-gray-100/80 backdrop-blur-sm border border-gray-300/30"
            }`}
          >
            {tabs.map((tab, index) => (
              <TabButton
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                icon={tab.icon}
                label={tab.label}
                count={tab.count}
                isDark={isDark}
                isFirst={index === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* مؤشرات النقاط للشاشات الصغيرة جداً (اختياري) */}
      {showScrollButtons && (
        <div className="flex justify-center mt-2 gap-1 sm:hidden">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                activeTab === tabs[index].id
                  ? (isDark ? "bg-blue-400" : "bg-blue-600")
                  : (isDark ? "bg-gray-600" : "bg-gray-300")
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TabsGroup;