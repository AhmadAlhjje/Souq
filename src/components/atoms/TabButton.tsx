import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  count: number;
  isDark: boolean;
  isFirst?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onClick,
  icon: Icon,
  label,
  count,
  isDark,
  isFirst = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 ${
        isActive
          ? isDark
            ? "bg-teal-500 text-white"
            : "bg-teal-500 text-white"
          : isDark
          ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
      } ${
        !isFirst && !isActive
          ? "border-r border-gray-300 dark:border-gray-600"
          : ""
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
      <span
        className={`px-1.5 py-0.5 rounded text-xs ${
          isActive
            ? "bg-white/20 text-white"
            : isDark
            ? "bg-gray-600/60 text-gray-300"
            : "bg-gray-300/60 text-gray-700"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

export default TabButton;