import React, { useRef, useState, useEffect } from 'react';
import { Package, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import TabButton from '../atoms/TabButton';
import { TabType, OrderStats } from '../../types/orders';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const tabs = [
    { id: "all" as TabType, label: t("tabs.all"), icon: Package, count: stats.totalOrders },
    { id: "shipped" as TabType, label: t("tabs.shipped"), icon: Check, count: stats.shippedOrders },
    { id: "unshipped" as TabType, label: t("tabs.unshipped"), icon: X, count: stats.unshippedOrders },
    { id: "monitored" as TabType, label: t("tabs.monitored"), icon: Eye, count: stats.monitoredOrders || 0 },
  ];

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    const handleScroll = () => checkScrollability();

    window.addEventListener('resize', handleResize);
    scrollContainerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative mb-6" dir="rtl">
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

      <div className={`overflow-hidden ${showScrollButtons ? 'mx-10' : ''}`}>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
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
