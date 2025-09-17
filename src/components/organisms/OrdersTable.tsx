import React from 'react';
import DataTable, { TableColumn } from '../../components/organisms/DataTable';
import { ViewButton, ShipButton } from '../../components/common/ActionButtons';
import { Order, TabType } from '../../types/orders';

// نوع البيانات للفلاتر
interface SearchFilters {
  customerName: string;
  productName: string;
}

interface OrdersTableProps {
  orders: Order[];
  activeTab: TabType;
  loading: boolean;
  onView: (order: Order) => void;
  onMarkAsShipped: (order: Order) => void;
  onExport: () => void;
  onSearch?: (searchTerm: string) => void;
  onApiSearch?: (filters: SearchFilters) => void; // جديد: للبحث عبر API
  isDark: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  activeTab,
  loading,
  onView,
  onMarkAsShipped,
  onExport,
  onSearch,
  onApiSearch, // جديد
  isDark
}) => {
  const columns: TableColumn[] = [
    {
      key: "customerName",
      title: "اسم الزبون",
      width: "150px",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isDark ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-800'
          }`}>
            {value.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{value}</span>
            {/* Show monitored indicator */}
            {row.isMonitored && (
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                isDark 
                  ? 'bg-blue-900 text-blue-200' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                مرصود
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "productImage",
      title: "المنتج",
      width: "200px",
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg">
            {value}
          </div>
          <div>
            {/* عرض اسم المنتج الأول إذا وجد، وإلا عرض رقم الطلب */}
            <span className="font-medium">
              {row.products && row.products.length > 0 
                ? row.products[0].name 
                : row.orderNumber
              }
            </span>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {row.orderNumber} • {row.products?.length || 0} منتج
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "orderNumber",
      title: "رقم الطلب",
      width: "120px",
    },
    {
      key: "price",
      title: "السعر",
      width: "120px",
      render: (value) => `${value.toLocaleString()} $`,
    },
    {
      key: "quantity",
      title: "الكمية",
      width: "100px",
      render: (value) => value.toLocaleString(),
    },
    {
      key: "category",
      title: "الحالة",
      width: "120px",
      render: (value: string, row) => {
        const statusColors: { [key: string]: string } = {
          مشحون:
            "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100",
          "غير مشحون":
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          مرصود:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        };
        
        // If it's a monitored order, show "مرصود" status
        const displayValue = row.isMonitored ? "مرصود" : value;
        
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[displayValue] ||
              "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {displayValue}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "الإجراءات",
      width: "160px",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <ViewButton
            size="sm"
            onClick={() => onView(row)}
            tooltip="عرض التفاصيل"
          />
          {/* Show "Mark as Shipped" button for unshipped orders (excluding monitored orders) */}
          {!row.isMonitored && 
           (activeTab === "unshipped" ||
            (activeTab === "all" && row.category === "غير مشحون")) && (
            <ShipButton
              size="sm"
              onClick={() => onMarkAsShipped(row)}
              tooltip="تم الشحن"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={orders}
      columns={columns}
      loading={loading}
      searchable={!onApiSearch} // إذا كان هناك API search، نخفي البحث العادي
      apiSearch={!!onApiSearch} // تفعيل البحث عبر API إذا تم تمرير onApiSearch
      exportable={true}
      onExport={onExport}
      onSearch={onSearch}
      onApiSearch={onApiSearch} // تمرير callback للبحث عبر API
      itemsPerPageOptions={[10, 25, 50]}
      className="shadow-sm"
      emptyMessage={onApiSearch ? "لم يتم العثور على طلبات تطابق معايير البحث" : "لا توجد طلبات للعرض"}
    />
  );
};

export default OrdersTable;