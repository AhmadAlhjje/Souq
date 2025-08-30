import React from 'react';
import { Package, Check, X, Eye } from 'lucide-react';
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
  const tabs = [
    { id: "all" as TabType, label: "كل الطلبات", icon: Package, count: stats.totalOrders },
    { id: "shipped" as TabType, label: "الطلبات المشحونة", icon: Check, count: stats.shippedOrders },
    { id: "unshipped" as TabType, label: "الطلبات غير المشحونة", icon: X, count: stats.unshippedOrders },
    { id: "monitored" as TabType, label: "الطلبات المرصودة", icon: Eye, count: stats.monitoredOrders || 0 },
  ];

  return (
    <div className="flex justify-start mb-6">
      <div
        className={`flex rounded-xl overflow-hidden ${
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
  );
};

export default TabsGroup;