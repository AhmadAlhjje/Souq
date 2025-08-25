// src/components/organisms/DataTable.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Search,
  MoreHorizontal
} from 'lucide-react';
import Button from '../atoms/Button';
import { useThemeContext } from '@/contexts/ThemeContext';

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  loading?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  itemsPerPageOptions?: number[];
  className?: string;
  emptyMessage?: string;
  showRowNumbers?: boolean;
  stickyHeader?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

const DataTable: React.FC<DataTableProps> = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  exportable = false,
  onExport,
  itemsPerPageOptions = [10, 25, 50],
  className = '',
  emptyMessage = 'لا توجد بيانات للعرض',
  showRowNumbers = false,
  stickyHeader = false
}) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  
  const { isDark } = useThemeContext();

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = data;

    // Apply search filter
    if (searchTerm.trim()) {
      filteredData = data.filter(row =>
        Object.values(row).some(value => {
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        
        if (sortConfig.direction === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig]);

  // Pagination calculations
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = processedData.slice(startIndex, endIndex);

  // Event handlers
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortConfig(prevConfig => {
      if (prevConfig.key === columnKey) {
        if (prevConfig.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((page, index, array) => array.indexOf(page) === index);
  };

  // Render sort icon
  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return (
        <div className="flex flex-col ml-1">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400 mb-0.5"></div>
          <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400"></div>
        </div>
      );
    }

    if (sortConfig.direction === 'asc') {
      return <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-teal-500 ml-1"></div>;
    } else {
      return <div className="w-0 h-0 border-l-2 border-r-2 border-t-3 border-transparent border-t-teal-500 ml-1"></div>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`rounded-lg border overflow-hidden ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } ${className}`}>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
          {/* Table header skeleton */}
          <div className={`h-12 border-t ${isDark ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'}`}></div>
          {/* Rows skeleton */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-12 border-t ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            ></div>
          ))}
          {/* Footer skeleton */}
          <div className={`h-16 border-t ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } ${className}`}>
      
      {/* Table Header Controls */}
      <div className={`p-4 border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {searchable && (
              <div className="relative">
                <Search className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="البحث في البيانات..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Export Button */}
          {exportable && (
            <Button
              variant="teal-outline"
              size="sm"
              onClick={onExport}
              text="تصدير البيانات"
            />
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Table Header */}
          <thead className={`border-b ${stickyHeader ? 'sticky top-0 z-10' : ''} ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <tr>
              {showRowNumbers && (
                <th className={`px-4 py-3 text-sm font-medium text-center ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  #
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-sm font-medium text-${column.align || 'right'} ${
                    column.sortable ? 'cursor-pointer hover:bg-opacity-80 select-none' : ''
                  } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={`flex items-center ${
                    column.align === 'center' ? 'justify-center' : 
                    column.align === 'left' ? 'justify-start' : 'justify-end'
                  }`}>
                    <span>{column.title}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className={`divide-y ${
            isDark ? 'divide-gray-700' : 'divide-gray-200'
          }`}>
            {currentData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (showRowNumbers ? 1 : 0)} 
                  className={`px-4 py-12 text-center ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <MoreHorizontal className={`w-12 h-12 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <p className="text-lg font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  className={`transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  {showRowNumbers && (
                    <td className={`px-4 py-3 text-sm text-center ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {startIndex + index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm text-${column.align || 'right'} ${
                        isDark ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    >
                      {column.render 
                        ? column.render(row[column.key], row, startIndex + index)
                        : row[column.key] ?? '-'
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className={`px-4 py-3 border-t ${
          isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Results Information */}
            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              عرض {startIndex + 1} إلى {Math.min(endIndex, totalItems)} من {totalItems} نتيجة
              {searchTerm && (
                <span className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  (مفلتر من {data.length} إجمالي)
                </span>
              )}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'border-gray-600 hover:bg-gray-600 disabled:hover:bg-transparent text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent text-gray-700'
                }`}
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={typeof page !== 'number'}
                  className={`px-3 py-1 rounded border text-sm transition-colors ${
                    page === currentPage
                      ? 'bg-teal-500 text-white border-teal-500 hover:bg-teal-600'
                      : typeof page === 'number'
                      ? isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'cursor-default border-transparent text-gray-400'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark 
                    ? 'border-gray-600 hover:bg-gray-600 disabled:hover:bg-transparent text-gray-300' 
                    : 'border-gray-300 hover:bg-gray-100 disabled:hover:bg-transparent text-gray-700'
                }`}
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Items Per Page Selector */}
            <div className={`flex items-center gap-2 text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span>عرض</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={`border rounded px-2 py-1 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white focus:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-900 focus:bg-gray-50'
                }`}
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>عنصر</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;