// pages/admin/products/ProductsPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import AdminLayout from "../../templates/admin/products/AdminLayout";
import ProductsStats from "../../organisms/admin/products/ProductsStats";
import ProductsFilter from "../../organisms/admin/products/ProductsFilter";
import ProductsGrid from "../../organisms/admin/products/ProductsGrid";
import ProductsTable from "../../organisms/admin/products/ProductsTable";
import DeleteConfirmModal from "../../molecules/admin/products/DeleteConfirmModal";
import ProductViewModal from "../../molecules/admin/products/ProductViewModal";
import ProductEditModal from "../../molecules/admin/products/ProductEditModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { useStore } from "@/contexts/StoreContext";
import { getStoreById } from "@/api/stores";
import {
  updateProduct,
  deleteProduct,
  ProductUpdateData,
  filterProducts,
} from "@/api/products";
import { Product, ViewMode } from "../../../types/product";

// دالة بسيطة لتنسيق التاريخ للعرض
const formatDisplayDate = (dateString: string) => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    // تنسيق بسيط: DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting display date:", error);
    return dateString;
  }
};

// دالة لتنسيق التاريخ بالتقويم الميلادي مع النص
const formatGregorianDateWithCalendar = (
  dateString: string,
  locale: string = "ar-SA"
) => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(locale, {
      calendar: "gregory", // تحديد التقويم الميلادي صراحة
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting gregorian date:", error);
    return formatDisplayDate(dateString); // fallback إلى التنسيق البسيط
  }
};

// دالة لتنسيق التاريخ بالتقويم الميلادي
const formatGregorianDate = (dateString: string, locale: string = "ar-SA") => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // إذا فشل التحويل، أرجع النص الأصلي

    return date.toLocaleDateString(locale, {
      calendar: "gregory", // تحديد التقويم الميلادي
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// دالة لتنسيق التاريخ والوقت بالتقويم الميلادي
const formatGregorianDateTime = (
  dateString: string,
  locale: string = "ar-SA"
) => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // إذا فشل التحويل، أرجع النص الأصلي

    return (
      date.toLocaleDateString(locale, {
        calendar: "gregory", // تحديد التقويم الميلادي
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateString;
  }
};

// تحويل منتج من API إلى Product interface
const transformApiProduct = (apiProduct: any): Product => {
  // تحليل الصور
  let images: string[] = [];
  try {
    if (apiProduct.images) {
      // التعامل مع التشفير المضاعف للصور
      let cleanedImages = apiProduct.images;

      // إزالة الاقتباسات الخارجية إذا وجدت
      if (cleanedImages.startsWith('"') && cleanedImages.endsWith('"')) {
        cleanedImages = cleanedImages.slice(1, -1);
      }

      // إزالة التشفير المضاعف
      cleanedImages = cleanedImages.replace(/\\"/g, '"');

      // تحليل JSON
      images = JSON.parse(cleanedImages);
    }
  } catch (error) {
    console.error("Error parsing product images:", error, apiProduct.images);
    // في حالة فشل التحليل، محاولة بسيطة
    try {
      if (apiProduct.images && typeof apiProduct.images === "string") {
        images = JSON.parse(apiProduct.images);
      }
    } catch (secondError) {
      console.error("Second attempt to parse images failed:", secondError);
      images = [];
    }
  }

  // تحديد الحالة بناءً على stockStatus أو stock_quantity
  let status: "active" | "out_of_stock" | "low_stock" = "active";
  if (
    apiProduct.stockStatus === "نفد المخزون" ||
    apiProduct.stock_quantity <= 0
  ) {
    status = "out_of_stock";
  } else if (apiProduct.stock_quantity < 10) {
    // يمكن تعديل الرقم حسب الحاجة
    status = "low_stock";
  }

  return {
    id: apiProduct.product_id.toString(),
    name: apiProduct.name,
    nameAr: apiProduct.name, // استخدام نفس الاسم للعربية
    description: apiProduct.description || "",
    descriptionAr: apiProduct.description || "",
    price: parseFloat(apiProduct.price),
    originalPrice: undefined,
    salePrice: undefined,
    stock: apiProduct.stock_quantity,
    category: "عام", // قيمة افتراضية - يمكن إضافة حقل category في API لاحقاً
    categoryAr: "عام", // قيمة افتراضية للعربية
    status: status,
    image:
      images.length > 0
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${images[0]}`
        : "", // الصورة الأولى كصورة رئيسية
    rating: apiProduct.averageRating || 0,
    reviewCount: apiProduct.reviewsCount || 0,
    inStock: apiProduct.stock_quantity > 0,
    isNew: false, // يمكن تحديد هذا بناءً على تاريخ الإنشاء
    sales: 0, // قيمة افتراضية للمبيعات - يمكن إضافة هذا في API لاحقاً
    brand: "", // قيمة افتراضية للعلامة التجارية
    brandAr: "", // قيمة افتراضية للعلامة التجارية بالعربية
    createdAt: formatDisplayDate(apiProduct.created_at), // تنسيق التاريخ بشكل بسيط
  };
};

// تحويل إحصائيات المتجر
const transformStoreStats = (statistics: any) => {
  return {
    totalProducts: statistics.totalProducts || 0,
    activeProducts: statistics.availableProducts || 0,
    outOfStockProducts: statistics.outOfStockProducts || 0,
    lowStockProducts: statistics.lowStockProducts || 0,
    averageRating: statistics.averageRating || 0,
    totalReviews: statistics.totalReviews || 0,
  };
};

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation("");
  const { isDark, isLight, themeClasses } = useTheme();
  const { showToast } = useToast();
  const { storeId, isLoaded } = useStore();
  const isRTL = i18n.language === "ar";

  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [storeData, setStoreData] = useState<any>(null);
  const [storeStats, setStoreStats] = useState<any>(null);

  // جلب بيانات المتجر والمنتجات
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getStoreById(storeId);
        console.log("Store API Response:", response);

        // حفظ بيانات المتجر
        setStoreData({
          id: response.store_id,
          name: response.store_name,
          address: response.store_address,
          description: response.description,
          images: response.images ? JSON.parse(response.images) : [],
          logo: response.logo_image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${response.logo_image}`
            : "",
          createdAt: formatDisplayDate(response.created_at), // تنسيق التاريخ بشكل بسيط
          owner: {
            username: response.User?.username,
            whatsappNumber: response.User?.whatsapp_number,
          },
        });

        // حفظ إحصائيات المتجر
        setStoreStats(transformStoreStats(response.statistics));

        // تحويل المنتجات من API
        const transformedProducts =
          response.Products?.map(transformApiProduct) || [];
        setProducts(transformedProducts);

        console.log("Transformed Products:", transformedProducts);
      } catch (error) {
        console.error("Error fetching store data:", error);
        showToast("فشل في تحميل بيانات المنتجات", "error");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchStoreData();
    }
  }, [storeId, isLoaded, showToast]);

  const filteredProducts = products;

  // Event Handlers
  const handleDeleteProduct = (product: Product): void => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      // استدعاء API لحذف المنتج
      await deleteProduct(productToDelete.id);

      // تحديث قائمة المنتجات محلياً
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id)
      );

      // تحديث الإحصائيات
      if (storeStats) {
        setStoreStats((prev: any) => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
          activeProducts:
            productToDelete.status === "active"
              ? prev.activeProducts - 1
              : prev.activeProducts,
          outOfStockProducts:
            productToDelete.status === "out_of_stock"
              ? prev.outOfStockProducts - 1
              : prev.outOfStockProducts,
          lowStockProducts:
            productToDelete.status === "low_stock"
              ? prev.lowStockProducts - 1
              : prev.lowStockProducts,
        }));
      }

      setShowDeleteModal(false);
      setProductToDelete(null);

      showToast("تم حذف المنتج بنجاح", "success");
    } catch (error) {
      console.error("Error deleting product:", error);
      showToast("فشل في حذف المنتج", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product): void => {
    console.log("Viewing product:", product);
    setProductToView(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product: Product): void => {
    console.log("Editing product:", product);
    setProductToEdit(product);
    setShowEditModal(true);
  };

  // تحديث handleSaveProduct في ProductsPage.tsx
  const handleSaveProduct = async (
    updatedProduct: Product & { newImages?: File[] }
  ): Promise<void> => {
    if (!productToEdit?.id) return;

    setEditLoading(true);
    try {
      console.log("=== DEBUG: Product Update Process ===");
      console.log("Original product:", productToEdit);
      console.log("Updated product:", updatedProduct);
      console.log("New images:", updatedProduct.newImages);

      // إعداد البيانات للإرسال إلى updateProduct
      const updateData: ProductUpdateData = {};

      // إضافة البيانات المتغيرة فقط
      if (updatedProduct.name !== productToEdit.name) {
        updateData.name = updatedProduct.name;
        console.log("Adding name:", updatedProduct.name);
      }

      if (updatedProduct.description !== productToEdit.description) {
        updateData.description = updatedProduct.description;
        console.log("Adding description:", updatedProduct.description);
      }

      if (updatedProduct.price !== productToEdit.price) {
        updateData.price = updatedProduct.price;
        console.log("Adding price:", updatedProduct.price);
      }

      if (updatedProduct.stock !== productToEdit.stock) {
        updateData.stock_quantity = updatedProduct.stock; // تحويل من stock إلى stock_quantity
        console.log("Adding stock_quantity:", updatedProduct.stock);
      }

      // إضافة الصور الجديدة إذا كانت موجودة
      if (updatedProduct.newImages && updatedProduct.newImages.length > 0) {
        updateData.images = updatedProduct.newImages;
        console.log(
          `Adding ${updatedProduct.newImages.length} images to update data`
        );

        // طباعة تفاصيل الصور
        updatedProduct.newImages.forEach((file, index) => {
          console.log(`Image ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
        });
      } else {
        console.log("No new images to upload");
      }

      console.log("Final update data:", updateData);

      // التحقق من وجود تغييرات
      if (Object.keys(updateData).length === 0) {
        console.log("No changes detected");
        setShowEditModal(false);
        setProductToEdit(null);
        showToast("لا توجد تغييرات للحفظ", "info");
        return;
      }

      // استدعاء updateProduct API
      console.log("Calling updateProduct API...");
      const response = await updateProduct(productToEdit.id, updateData);

      console.log("API Response:", response);

      // تحديث قائمة المنتجات محلياً
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === updatedProduct.id ? { ...updatedProduct } : p
        )
      );

      // إغلاق Modal
      setShowEditModal(false);
      setProductToEdit(null);

      showToast("تم تحديث المنتج بنجاح", "success");
    } catch (error: any) {
      console.error("Error updating product:", error);

      // معالجة أفضل للأخطاء
      if (error?.response) {
        console.error("API Error Details:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // رسائل خطأ مخصصة
        switch (error.response.status) {
          case 422:
            showToast(
              "خطأ في البيانات المدخلة - تحقق من صحة البيانات",
              "error"
            );
            break;
          case 413:
            showToast("حجم الصور كبير جداً - يرجى اختيار صور أصغر", "error");
            break;
          case 415:
            showToast("نوع الصور غير مدعوم - يرجى استخدام JPG أو PNG", "error");
            break;
          case 404:
            showToast("المنتج غير موجود", "error");
            break;
          case 401:
            showToast("غير مصرح لك بتعديل هذا المنتج", "error");
            break;
          default:
            showToast(
              `خطأ في تحديث المنتج: ${
                error.response?.data?.message || "خطأ غير معروف"
              }`,
              "error"
            );
        }
      } else if (error?.request) {
        showToast(
          "خطأ في الاتصال بالخادم - تحقق من الاتصال بالإنترنت",
          "error"
        );
      } else {
        showToast(`خطأ: ${error.message}`, "error");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddProduct = (): void => {
    console.log("Adding new product");
    // TODO: Navigate to add product page
    // router.push('/admin/products/add');
  };

  const handleViewModeChange = (mode: ViewMode): void => {
    if (mode === "list") {
      setViewMode("grid");
    } else {
      setViewMode(mode);
    }
  };

  const handleSearchChange = (value: string): void => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string): void => {
    setSelectedCategory(value);
  };

  const handleStatusChange = (value: string): void => {
    setSelectedStatus(value);
  };

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleCloseViewModal = (): void => {
    setShowViewModal(false);
    setProductToView(null);
  };

  const handleCloseEditModal = (): void => {
    setShowEditModal(false);
    setProductToEdit(null);
  };

  // إضافة هذا داخل ProductsPage.tsx، مع الدوال الأخرى مثل handleAddProduct
  const handleSearchClick = async () => {
    if (!storeId) return;

    try {
      const data = await filterProducts(storeId, {
        stockStatus: selectedStatus !== "all" ? selectedStatus : undefined,
        name: searchTerm || undefined,
      });

      console.log("Filtered Products API Response:", data);
      setProducts(data.Products.map(transformApiProduct)); // جلب المنتجات من API فقط
      setStoreStats(transformStoreStats(data.statistics));
    } catch (error) {
      showToast("فشل في جلب المنتجات", "error");
    }
  };

  // دالة لرندر المحتوى حسب نوع العرض
  const renderProductsContent = () => {
    switch (viewMode) {
      case "table":
        return (
          <ProductsTable
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
      case "list":
        return (
          <ProductsGrid
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
      case "grid":
      default:
        return (
          <ProductsGrid
            products={filteredProducts}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            loading={loading}
          />
        );
    }
  };

  // تكوين رسالة الحذف
  const getDeleteMessage = (): string => {
    if (!productToDelete) return "";

    const productName = isRTL ? productToDelete.nameAr : productToDelete.name;

    return t("deleteModal.message", { productName });
  };

  // Theme-based classes
  const containerClasses = isDark
    ? "bg-gray-900 min-h-screen"
    : "bg-gray-50 min-h-screen";

  const emptyStateClasses = {
    container: "text-center py-16",
    icon: isDark ? "bg-gray-700" : "bg-gray-100",
    iconColor: isDark ? "text-gray-400" : "text-gray-400",
    title: isDark ? "text-gray-200" : "text-gray-700",
    description: isDark ? "text-gray-400" : "text-gray-500",
    button: isDark
      ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
      : "bg-[#004D5A] hover:bg-[#003a44] text-white focus:ring-[#004D5A]",
    clearFilters: isDark
      ? "text-blue-400 hover:text-blue-300"
      : "text-[#004D5A] hover:text-[#003a44]",
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedStatus !== "all";

  // انتظار تحميل storeId
  if (!isLoaded) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="جاري تحميل بيانات المتجر..."
        overlay={true}
        pulse={true}
      />
    );
  }

  // التحقق من وجود storeId
  if (!storeId) {
    return (
      <AdminLayout title="خطأ" subtitle="خطأ في تحديد المتجر">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">
              لا يمكن تحديد المتجر. يرجى إعادة تسجيل الدخول.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // حالة التحميل الأولي
  if (loading && products.length === 0) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="جاري تحميل المنتجات..."
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

  return (
    <AdminLayout
      title={storeData?.name || t("title")}
      subtitle={`${products.length} ${t("subtitle")}`}
    >
      <div className={containerClasses}>
        <div className={`p-6 space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Store Info Section - اختياري */}
          {storeData && (
            <section className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                {storeData.logo && (
                  <img
                    src={storeData.logo}
                    alt={storeData.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {storeData.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {storeData.address}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Stats Section */}
          <section aria-label={t("stats.totalProducts")}>
            <ProductsStats products={products} loading={loading} />
          </section>

          {/* Filters Section */}
          <section aria-label={t("filters.search")}>
            <ProductsFilter
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onAddProduct={handleAddProduct}
              loading={loading}
            />

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleSearchClick}
                className="bg-teal-600 text-white px-9 py-2 rounded hover:bg-teal-700"
              >
                بحث
              </button>
            </div>
          </section>

          {/* Products Display Section */}
          <section aria-label={t("page.title")}>
            {renderProductsContent()}
          </section>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <div className={emptyStateClasses.container}>
              <div
                className={`w-20 h-20 ${emptyStateClasses.icon} rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <Package
                  className={`w-10 h-10 ${emptyStateClasses.iconColor}`}
                />
              </div>

              <h3
                className={`text-xl font-semibold ${emptyStateClasses.title} mb-3`}
              >
                {products.length === 0
                  ? "لا توجد منتجات في متجرك بعد"
                  : "لا توجد منتجات تطابق الفلاتر المحددة"}
              </h3>

              <p
                className={`${emptyStateClasses.description} mb-6 max-w-md mx-auto leading-relaxed`}
              >
                {products.length === 0
                  ? "ابدأ ببناء متجرك عبر إضافة منتجك الأول"
                  : "جرب تعديل الفلاتر أو البحث عن منتجات أخرى"}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleAddProduct}
                  className={`
                    ${emptyStateClasses.button} 
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    transform hover:scale-105 active:scale-95
                  `}
                  aria-label={t("buttons.addProduct")}
                >
                  {products.length === 0 ? "إضافة أول منتج" : "إضافة منتج جديد"}
                </button>

                {hasActiveFilters && products.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedStatus("all");
                      handleSearchClick(); // إعادة جلب كل المنتجات من API
                    }}
                    className={` ... `}
                  >
                    مسح الفلاتر
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Modals */}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={confirmDelete}
            title={t("deleteModal.title")}
            message={getDeleteMessage()}
            loading={loading}
          />

          {/* Product View Modal */}
          <ProductViewModal
            isOpen={showViewModal}
            onClose={handleCloseViewModal}
            product={productToView}
          />

          {/* Product Edit Modal */}
          <ProductEditModal
            isOpen={showEditModal}
            onClose={handleCloseEditModal}
            onSave={handleSaveProduct}
            product={productToEdit}
            loading={editLoading}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
