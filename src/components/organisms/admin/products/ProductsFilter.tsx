import React from "react";
import { Grid, List, Plus, Filter } from "lucide-react";
import Button from "../../../atoms/Button";
import SearchBox from "../../../molecules/admin/products/SearchBox";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { ViewMode } from "../../../../types/product";

export interface ProductsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddProduct?: () => void;
  loading?: boolean;
  className?: string;
}

const ProductsFilter: React.FC<ProductsFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onAddProduct,
  loading = false,
  className = "",
}) => {
  const { t, i18n } = useTranslation("");
  const { isDark, isLight } = useTheme();
  const isRTL = i18n.language === "ar";

  const statusOptions = [
    { value: "all", label: t("status.all") },
    { value: "active", label: t("status.active") },
    { value: "out_of_stock", label: t("status.out_of_stock") },
    { value: "low_stock", label: t("status.low_stock") },
  ];

  // Theme-based classes
  const containerClasses = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-[#96EDD9]";

  const selectClasses = isDark
    ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 focus:ring-[#5CA9B5] focus:border-transparent";

  const filterIconClasses = isDark ? "text-gray-400" : "text-gray-400";

  const addButtonClasses = isDark
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
    : "bg-[#004D5A] text-white hover:bg-[#003a44] focus:ring-[#004D5A]";

  const viewModeToggleClasses = isDark ? "bg-gray-700" : "bg-gray-100";

  const getViewModeButtonClasses = (mode: ViewMode) => {
    const baseClasses = "p-2 rounded-md transition-colors";
    const loadingClasses = loading ? "opacity-50 cursor-not-allowed" : "";

    if (viewMode === mode) {
      return `${baseClasses} ${
        isDark ? "bg-blue-600 text-white" : "bg-[#004D5A] text-white"
      } ${loadingClasses}`;
    }

    return `${baseClasses} ${
      isDark
        ? "text-gray-300 hover:bg-gray-600"
        : "text-gray-600 hover:bg-gray-200"
    } ${loadingClasses}`;
  };

  return (
    <div
      className={`${containerClasses} p-4 rounded-lg border shadow-sm transition-colors duration-200 ${className}`}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Box */}
          <SearchBox
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={t("search.placeholder")}
            className="flex-1 max-w-md"
            disabled={loading}
          />

          {/* Filters */}
          <div className="flex gap-4">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className={`
                  appearance-none rounded-lg px-4 py-2 pr-8 
                  focus:outline-none focus:ring-2 min-w-[150px]
                  transition-colors duration-200
                  ${selectClasses}
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={loading}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Filter
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${filterIconClasses} w-4 h-4 pointer-events-none`}
              />
            </div>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div
            className={`flex items-center gap-2 ${viewModeToggleClasses} p-1 rounded-lg transition-colors duration-200`}
          >
            <button
              onClick={() => onViewModeChange("grid")}
              disabled={loading}
              className={getViewModeButtonClasses("grid")}
              aria-label={t("viewModes.grid")}
              title={t("viewModes.grid")}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              disabled={loading}
              className={getViewModeButtonClasses("table")}
              aria-label={t("viewModes.table")}
              title={t("viewModes.table")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;
