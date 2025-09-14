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
import { getStore } from "@/api/stores";
import { updateProduct, deleteProduct, filterProducts } from "@/api/products";
import { Product as BaseProduct, ViewMode } from "../../../types/product";

// نوع موسع للمنتج يحتوي على خصائص إضافية للتوافق
interface ExtendedProduct extends BaseProduct {
  // خصائص إضافية للتوافق مع المكونات الأخرى
  status?: "active" | "out_of_stock" | "low_stock";
  image?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  isNew?: boolean;
  sales?: number;
  brand?: string;
  createdAt?: string;
  category?: string;
  nameAr?: string;
  descriptionAr?: string;
  categoryAr?: string;
  brandAr?: string;
  displayPrice?: number;
  originalDisplayPrice?: number;
  showOriginalPrice?: boolean;
  discountLabel?: string;
}

// نوع محدث لبيانات التحديث يتضمن discount_percentage
interface ExtendedProductUpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  discount_percentage?: number | null;
  images?: File[];
}

type Product = ExtendedProduct;

// دالة بسيطة لتنسيق التاريخ للعرض
const formatDisplayDate = (dateString: string) => {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting display date:", error);
    return dateString;
  }
};

// تحويل منتج من API إلى Product interface - محدث للبنية الجديدة مع الخصم
const transformApiProduct = (apiProduct: any): Product => {
  // تحليل الصور
  let images: string[] = [];
  try {
    if (apiProduct.images) {
      let cleanedImages = apiProduct.images;

      if (cleanedImages.startsWith('"') && cleanedImages.endsWith('"')) {
        cleanedImages = cleanedImages.slice(1, -1);
      }

      cleanedImages = cleanedImages.replace(/\\"/g, '"');
      images = JSON.parse(cleanedImages);
    }
  } catch (error) {
    console.error("Error parsing product images:", error, apiProduct.images);
    try {
      if (apiProduct.images && typeof apiProduct.images === "string") {
        images = JSON.parse(apiProduct.images);
      }
    } catch (secondError) {
      console.error("Second attempt to parse images failed:", secondError);
      images = [];
    }
  }

  // معالجة الخصم الجديدة
  const hasDiscount =
    apiProduct.discount_percentage != null &&
    parseFloat(apiProduct.discount_percentage.toString()) > 0;

  const originalPrice = parseFloat(apiProduct.price?.toString() || "0");
  const discountPercentage = hasDiscount
    ? parseFloat(apiProduct.discount_percentage.toString())
    : 0;

  // حساب السعر بعد الخصم
  const discountAmount = hasDiscount
    ? (originalPrice * discountPercentage) / 100
    : 0;
  const finalPrice = hasDiscount
    ? originalPrice - discountAmount
    : originalPrice;

  // تحديد الحالة بناءً على stock_quantity
  let status: "active" | "out_of_stock" | "low_stock" = "active";
  if (apiProduct.stock_quantity <= 0) {
    status = "out_of_stock";
  } else if (apiProduct.stock_quantity < 10) {
    status = "low_stock";
  }

  return {
    // الخصائص الأساسية من Product
    product_id: apiProduct.product_id,
    store_id: apiProduct.store_id,
    name: apiProduct.name,
    description: apiProduct.description || "",
    price: originalPrice,
    discount_percentage: hasDiscount ? discountPercentage : null,
    stock_quantity: apiProduct.stock_quantity || 0,
    images: images,
    created_at: apiProduct.created_at,
    discounted_price: hasDiscount ? finalPrice : undefined,
    discount_amount: hasDiscount ? discountAmount : undefined,
    has_discount: hasDiscount,
    original_price: hasDiscount ? originalPrice : undefined,
    Store: apiProduct.Store,
    reviews: apiProduct.reviews || [],

    displayPrice: hasDiscount ? finalPrice : originalPrice,
    originalDisplayPrice: hasDiscount ? originalPrice : undefined,
    showOriginalPrice: hasDiscount,
    discountLabel: hasDiscount ? `${discountPercentage}% خصم` : undefined,

    // الخصائص الإضافية للتوافق
    id: apiProduct.product_id.toString(),
    status: status,
    image:
      images.length > 0
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${images[0]}`
        : "",
    rating: apiProduct.averageRating || 0,
    reviewCount:
      apiProduct.reviewsCount ||
      (apiProduct.reviews ? apiProduct.reviews.length : 0),
    inStock: apiProduct.stock_quantity > 0,
    isNew: false,
    sales: 0,
    brand: apiProduct.Store?.store_name || "",
    createdAt: formatDisplayDate(apiProduct.created_at),
    category: apiProduct.Store?.store_name || "عام",
    nameAr: apiProduct.name,
    descriptionAr: apiProduct.description || "",
    categoryAr: apiProduct.Store?.store_name || "عام",
    brandAr: apiProduct.Store?.store_name || "",
  };
};

// تحويل إحصائيات المتجر - محدث للبنية الجديدة مع إحصائيات الخصم
const transformStoreStats = (storeData: any) => {
  const products = storeData.products || [];

  const totalProducts = products.length;
  const activeProducts = products.filter(
    (product: any) => product.stock_quantity > 0
  ).length;
  const outOfStockProducts = products.filter(
    (product: any) => product.stock_quantity === 0
  ).length;
  const lowStockProducts = products.filter(
    (product: any) => product.stock_quantity > 0 && product.stock_quantity <= 5
  ).length;

  // حساب متوسط التقييم
  const productsWithRating = products.filter(
    (product: any) => product.averageRating > 0
  );
  const averageRating =
    productsWithRating.length > 0
      ? productsWithRating.reduce(
          (sum: number, product: any) => sum + product.averageRating,
          0
        ) / productsWithRating.length
      : 0;

  const totalReviews = products.reduce(
    (sum: number, product: any) => sum + (product.reviewsCount || 0),
    0
  );

  // إحصائيات الخصومات المحدثة
  const productsWithDiscount = products.filter(
    (product: any) =>
      product.discount_percentage != null &&
      parseFloat(product.discount_percentage) > 0
  ).length;

  // حساب إجمالي قيمة الخصومات
  const totalDiscountValue = products.reduce((sum: number, product: any) => {
    if (
      product.discount_percentage != null &&
      parseFloat(product.discount_percentage) > 0
    ) {
      const originalPrice = parseFloat(product.price);
      const discountAmount =
        originalPrice * (parseFloat(product.discount_percentage) / 100);
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  // حساب متوسط نسبة الخصم
  const averageDiscountPercentage =
    productsWithDiscount > 0
      ? products
          .filter(
            (product: any) =>
              product.discount_percentage != null &&
              parseFloat(product.discount_percentage) > 0
          )
          .reduce(
            (sum: number, product: any) =>
              sum + parseFloat(product.discount_percentage),
            0
          ) / productsWithDiscount
      : 0;

  return {
    totalProducts,
    activeProducts,
    outOfStockProducts,
    lowStockProducts,
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews,

    // إحصائيات الخصومات
    productsWithDiscount,
    totalDiscountValue: parseFloat(totalDiscountValue.toFixed(2)),
    averageDiscountPercentage: parseFloat(averageDiscountPercentage.toFixed(1)),

    // إحصائيات إضافية
    discountSavingsTotal: totalDiscountValue,
    discountPercentageOfProducts:
      totalProducts > 0
        ? parseFloat(((productsWithDiscount / totalProducts) * 100).toFixed(1))
        : 0,

    // إضافة إحصائيات من البيانات المرسلة من الخادم إذا كانت متوفرة
    ...storeData.discountStats,
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
        const response = await getStore(storeId);
        console.log("Store API Response:", response);

        if (!response.success || !response.store) {
          throw new Error("فشل في جلب بيانات المتجر");
        }

        const storeInfo = response.store;

        // تحويل المنتجات من API مع التأكد من تحويل المخزون والأسعار للأرقام
        const transformApiProduct = (apiProduct: any): Product => {
          let images: string[] = [];
          try {
            if (apiProduct.images) {
              let cleanedImages = apiProduct.images;
              if (
                cleanedImages.startsWith('"') &&
                cleanedImages.endsWith('"')
              ) {
                cleanedImages = cleanedImages.slice(1, -1);
              }
              cleanedImages = cleanedImages.replace(/\\"/g, '"');
              images = JSON.parse(cleanedImages);
            }
          } catch (error) {
            console.error(
              "Error parsing product images:",
              error,
              apiProduct.images
            );
            images = [];
          }

          const stockQuantity = Number(apiProduct.stock_quantity) || 0;
          const originalPrice = Number(apiProduct.price) || 0;
          const discountPercentage =
            apiProduct.discount_percentage != null
              ? Number(apiProduct.discount_percentage)
              : 0;

          const hasDiscount = discountPercentage > 0;
          const discountAmount = hasDiscount
            ? (originalPrice * discountPercentage) / 100
            : 0;
          const finalPrice = hasDiscount
            ? originalPrice - discountAmount
            : originalPrice;

          let status: "active" | "out_of_stock" | "low_stock" = "active";
          if (stockQuantity <= 0) status = "out_of_stock";
          else if (stockQuantity < 10) status = "low_stock";

          return {
            product_id: apiProduct.product_id,
            store_id: apiProduct.store_id,
            name: apiProduct.name,
            description: apiProduct.description || "",
            price: originalPrice,
            discount_percentage: hasDiscount ? discountPercentage : null,
            stock_quantity: stockQuantity,
            images: images,
            created_at: apiProduct.created_at,
            discounted_price: hasDiscount ? finalPrice : undefined,
            discount_amount: hasDiscount ? discountAmount : undefined,
            has_discount: hasDiscount,
            original_price: hasDiscount ? originalPrice : undefined,
            Store: apiProduct.Store,
            reviews: apiProduct.reviews || [],
            id: apiProduct.product_id.toString(),
            status: status,
            image:
              images.length > 0
                ? `${process.env.NEXT_PUBLIC_BASE_URL}${images[0]}`
                : "",
            rating: apiProduct.averageRating || 0,
            reviewCount:
              apiProduct.reviewsCount ||
              (apiProduct.reviews ? apiProduct.reviews.length : 0),
            inStock: stockQuantity > 0,
            isNew: false,
            sales: 0,
            brand: apiProduct.Store?.store_name || "",
            createdAt: formatDisplayDate(apiProduct.created_at),
            category: apiProduct.Store?.store_name || "عام",
            nameAr: apiProduct.name,
            descriptionAr: apiProduct.description || "",
            categoryAr: apiProduct.Store?.store_name || "عام",
            brandAr: apiProduct.Store?.store_name || "",
          };
        };

        const transformedProducts =
          storeInfo.products?.map(transformApiProduct) || [];
        setProducts(transformedProducts);

        // حفظ بيانات المتجر
        setStoreData({
          id: storeInfo.store_id,
          name: storeInfo.store_name,
          address: storeInfo.store_address,
          description: storeInfo.description,
          images: storeInfo.images ? JSON.parse(storeInfo.images) : [],
          logo: storeInfo.logo_image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${storeInfo.logo_image}`
            : "",
          createdAt: formatDisplayDate(storeInfo.created_at),
          isBlocked: storeInfo.is_blocked,
          owner: {
            username: storeInfo.User?.username,
            whatsappNumber: storeInfo.User?.whatsapp_number,
            role: storeInfo.User?.role,
          },
          totalRevenue: storeInfo.totalRevenue,
          totalOrders: storeInfo.totalOrders,
          thisMonthRevenue: storeInfo.thisMonthRevenue,
          averageRating: storeInfo.averageRating,
          reviewsCount: storeInfo.reviewsCount,
          discountStats: storeInfo.discountStats,
        });

        // حفظ إحصائيات المتجر
        setStoreStats(transformStoreStats(storeInfo));
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
      // التأكد من وجود id صالح
      const productId =
        productToDelete.id || productToDelete.product_id?.toString();
      if (!productId) {
        throw new Error("معرف المنتج غير صالح");
      }

      await deleteProduct(productId);

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id)
      );

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
          // تحديث إحصائيات الخصم عند الحذف
          productsWithDiscount: productToDelete.has_discount
            ? prev.productsWithDiscount - 1
            : prev.productsWithDiscount,
          totalDiscountValue: productToDelete.has_discount
            ? prev.totalDiscountValue - (productToDelete.discount_amount || 0)
            : prev.totalDiscountValue,
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

  // تحديث handleSaveProduct للتعامل مع الخصم
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

      const updateData: ExtendedProductUpdateData = {};

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

      if (updatedProduct.stock_quantity !== productToEdit.stock_quantity) {
        updateData.stock_quantity = updatedProduct.stock_quantity;
        console.log("Adding stock_quantity:", updatedProduct.stock_quantity);
      }

      // معالجة الخصم الجديدة
      if (
        updatedProduct.discount_percentage !== productToEdit.discount_percentage
      ) {
        updateData.discount_percentage = updatedProduct.discount_percentage;
        console.log(
          "Adding discount_percentage:",
          updatedProduct.discount_percentage
        );
      }

      // إضافة الصور الجديدة إذا كانت موجودة
      if (updatedProduct.newImages && updatedProduct.newImages.length > 0) {
        updateData.images = updatedProduct.newImages;
        console.log(
          `Adding ${updatedProduct.newImages.length} images to update data`
        );

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
      const response = await updateProduct(productToEdit.id, updateData as any);

      console.log("API Response:", response);

      // تحديث قائمة المنتجات محلياً مع إعادة حساب الخصم
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === updatedProduct.id) {
            // إعادة حساب بيانات الخصم
            const hasDiscount =
              updatedProduct.discount_percentage != null &&
              updatedProduct.discount_percentage > 0;
            const originalPrice = updatedProduct.price || 0;
            const discountAmount = hasDiscount
              ? (originalPrice * (updatedProduct.discount_percentage || 0)) /
                100
              : 0;
            const discountedPrice = hasDiscount
              ? originalPrice - discountAmount
              : originalPrice;

            return {
              ...updatedProduct,
              has_discount: hasDiscount,
              discount_amount: hasDiscount ? discountAmount : undefined,
              discounted_price: hasDiscount ? discountedPrice : undefined,
              original_price: hasDiscount ? originalPrice : undefined,
            };
          }
          return p;
        })
      );

      // تحديث الإحصائيات
      if (storeStats) {
        // إعادة حساب إحصائيات الخصم
        const updatedProducts = products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        );
        setStoreStats(transformStoreStats({ products: updatedProducts }));
      }

      setShowEditModal(false);
      setProductToEdit(null);

      showToast("تم تحديث المنتج بنجاح", "success");
    } catch (error: any) {
      console.error("Error updating product:", error);

      if (error?.response) {
        console.error("API Error Details:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

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

  const handleSearchClick = async () => {
    if (!storeId) return;

    try {
      const data = await filterProducts(storeId, {
        stockStatus: selectedStatus !== "all" ? selectedStatus : undefined,
        name: searchTerm || undefined,
      });

      console.log("Filtered Products API Response:", data);

      if (data.success && data.store && data.store.products) {
        setProducts(data.store.products.map(transformApiProduct));
        setStoreStats(transformStoreStats(data.store));
      } else {
        const products = data.Products || data.products || [];
        setProducts(products.map(transformApiProduct));
        if (data.statistics) {
          setStoreStats(
            transformStoreStats({ products, statistics: data.statistics })
          );
        }
      }
    } catch (error) {
      console.error("Error filtering products:", error);
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
          {/* Store Info Section */}
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
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {storeData.name}
                  </h2>
                  {storeData.isBlocked && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      متجر محظور
                    </span>
                  )}
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
                      handleSearchClick();
                    }}
                    className={`
                      ${emptyStateClasses.clearFilters}
                      px-4 py-2 rounded-lg font-medium transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    `}
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
