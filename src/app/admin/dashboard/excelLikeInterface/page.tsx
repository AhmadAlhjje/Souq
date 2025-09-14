"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  X,
  FileSpreadsheet,
  Download,
  FileUp,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { uploadMultipleProducts } from "@/api/products";
import { useStore } from "@/contexts/StoreContext";
import * as XLSX from "xlsx";

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: string;
  discount_percentage: string;
  stock_quantity: string;
  images: File[];
}

interface CellPosition {
  row: number;
  col: number;
}

interface BulkProductData {
  store_id: number;
  products: {
    name: string;
    description: string;
    price: number;
    discount_percentage?: number;
    stock_quantity: number;
    imagesCount: number;
  }[];
  images: File[];
}

const ExcelLikeInterface = () => {
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: "1",
      name: "",
      description: "",
      price: "",
      discount_percentage: "",
      stock_quantity: "",
      images: [],
    },
  ]);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const { storeId, isLoaded } = useStore();
  const { showToast } = useToast();

  const setFileInputRef = useCallback((productId: string) => {
    return (el: HTMLInputElement | null) => {
      fileInputRefs.current[productId] = el;
    };
  }, []);

  const columns = [
    { key: "name", label: "اسم المنتج", width: "200px" },
    { key: "description", label: "الوصف", width: "300px" },
    { key: "price", label: "السعر $", width: "120px" },
    { key: "discount_percentage", label: "نسبة الخصم %", width: "120px" },
    { key: "stock_quantity", label: "الكمية المتاحة", width: "120px" },
    { key: "images", label: "الصور (حتى 8 صور)", width: "250px" },
  ];

  // دالة تحميل ملف Excel نموذجي
  const downloadExcelTemplate = () => {
    const templateData = [
      {
        "اسم المنتج": "مثال - قميص قطني",
        الوصف: "قميص قطني عالي الجودة مناسب لجميع المناسبات",
        السعر: 29.99,
        "نسبة الخصم %": 10,
        "الكمية المتاحة": 50,
      },
      {
        "اسم المنتج": "مثال - حذاء رياضي",
        الوصف: "حذاء رياضي مريح للجري والأنشطة اليومية",
        السعر: 79.99,
        "نسبة الخصم %": "",
        "الكمية المتاحة": 25,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "المنتجات");

    // تحسين عرض الأعمدة
    const colWidths = [
      { wch: 25 }, // اسم المنتج
      { wch: 40 }, // الوصف
      { wch: 10 }, // السعر
      { wch: 15 }, // نسبة الخصم
      { wch: 15 }, // الكمية
    ];
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, "نموذج_المنتجات.xlsx");
    showToast("تم تحميل النموذج بنجاح", "success");
  };

  // دالة رفع ملف Excel
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          showToast("الملف فارغ أو لا يحتوي على بيانات صحيحة", "error");
          return;
        }

        // تحويل البيانات إلى تنسيق المنتجات
        const importedProducts: ProductRow[] = jsonData.map(
          (row: any, index: number) => {
            return {
              id: (Date.now() + index).toString(),
              name: row["اسم المنتج"] || row["name"] || "",
              description: row["الوصف"] || row["description"] || "",
              price: (row["السعر"] || row["price"] || "").toString(),
              discount_percentage: (
                row["نسبة الخصم %"] ||
                row["discount_percentage"] ||
                ""
              ).toString(),
              stock_quantity: (
                row["الكمية المتاحة"] ||
                row["stock_quantity"] ||
                ""
              ).toString(),
              images: [],
            };
          }
        );

        // التحقق من صحة البيانات
        const validProducts = importedProducts.filter(
          (product) =>
            product.name.trim() &&
            product.description.trim() &&
            product.price &&
            product.stock_quantity
        );

        if (validProducts.length === 0) {
          showToast(
            "لا توجد منتجات صالحة في الملف. تأكد من وجود: اسم المنتج، الوصف، السعر، والكمية",
            "error"
          );
          return;
        }

        // إضافة المنتجات المستوردة
        setProducts((prevProducts) => {
          // إزالة الصف الفارغ الأول إذا كان فارغاً
          const filteredPrev = prevProducts.filter(
            (p) =>
              p.name.trim() ||
              p.description.trim() ||
              p.price ||
              p.stock_quantity
          );
          return [...filteredPrev, ...validProducts];
        });

        showToast(`تم استيراد ${validProducts.length} منتج بنجاح`, "success");

        if (importedProducts.length > validProducts.length) {
          const skipped = importedProducts.length - validProducts.length;
          showToast(
            `تم تجاهل ${skipped} منتج لعدم اكتمال البيانات المطلوبة`,
            "warning"
          );
        }
      } catch (error) {
        console.error("خطأ في قراءة ملف Excel:", error);
        showToast(
          "خطأ في قراءة الملف. تأكد من أن الملف من نوع Excel صحيح",
          "error"
        );
      }
    };

    reader.readAsArrayBuffer(file);

    // إعادة تعيين input
    if (excelInputRef.current) {
      excelInputRef.current.value = "";
    }
  };

  const addRow = () => {
    const newRow: ProductRow = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: "",
      discount_percentage: "",
      stock_quantity: "",
      images: [],
    };
    setProducts([...products, newRow]);
    showToast("تم إضافة صف جديد", "info");
  };

  const deleteRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
      showToast("تم حذف الصف", "success");
    } else {
      showToast("لا يمكن حذف الصف الأخير", "warning");
    }
  };

  const updateCell = (id: string, key: keyof ProductRow, value: any) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [key]: value } : product
      )
    );
  };

  const handleImageUpload = (productId: string, files: FileList) => {
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) return;

    const newImages = Array.from(files);
    const totalImages = currentProduct.images.length + newImages.length;

    if (totalImages > 8) {
      showToast("يمكن رفع حتى 8 صور فقط لكل منتج", "warning");
      return;
    }

    const validImages = newImages.filter((file) =>
      file.type.startsWith("image/")
    );
    if (validImages.length !== newImages.length) {
      showToast("يرجى اختيار ملفات صور فقط", "error");
      return;
    }

    const oversizedFiles = validImages.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      showToast("حجم الصورة يجب أن يكون أقل من 5 ميجابايت", "error");
      return;
    }

    updateCell(productId, "images", [...currentProduct.images, ...validImages]);
    showToast(`تم إضافة ${validImages.length} صورة`, "success");
  };

  const removeImage = (productId: string, imageIndex: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newImages = product.images.filter((_, index) => index !== imageIndex);
    updateCell(productId, "images", newImages);
    showToast("تم حذف الصورة", "success");
  };

  const saveProducts = useCallback(async () => {
    const validateProducts = (products: any[]) => {
      const errors: string[] = [];

      products.forEach((product, index) => {
        if (!product.name.trim()) {
          errors.push(`المنتج ${index + 1}: الاسم مطلوب`);
        }
        if (!product.description.trim()) {
          errors.push(`المنتج ${index + 1}: الوصف مطلوب`);
        }
        if (!product.price || parseFloat(product.price) <= 0) {
          errors.push(`المنتج ${index + 1}: السعر يجب أن يكون أكبر من صفر`);
        }
        if (!product.stock_quantity || parseInt(product.stock_quantity) < 0) {
          errors.push(`المنتج ${index + 1}: الكمية يجب أن تكون صفر أو أكثر`);
        }
        if (product.discount_percentage) {
          const discount = parseFloat(product.discount_percentage);
          if (isNaN(discount) || discount < 0 || discount > 100) {
            errors.push(
              `المنتج ${index + 1}: نسبة الخصم يجب أن تكون بين 0 و 100`
            );
          }
        }
      });

      return errors;
    };

    if (!isLoaded || !storeId) {
      showToast("لم يتم تحديد المتجر. يرجى المحاولة مرة أخرى.", "error");
      return;
    }

    const validProducts = products.filter(
      (product) =>
        product.name.trim() &&
        product.description.trim() &&
        product.price &&
        product.stock_quantity
    );

    if (validProducts.length === 0) {
      showToast(
        "يرجى ملء البيانات المطلوبة للمنتجات (الاسم، الوصف، السعر، الكمية)",
        "warning"
      );
      return;
    }

    const validationErrors = validateProducts(validProducts);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showToast(error, "error"));
      return;
    }

    setIsLoading(true);
    setLoadingMessage("جاري تحضير بيانات المنتجات...");

    try {
      setLoadingMessage("معالجة المنتجات وصورها...");

      const allImages: File[] = [];
      const productsData = validProducts.map((product, index) => {
        const productImages = product.images;
        allImages.push(...productImages);

        setLoadingMessage(
          `معالجة المنتج ${index + 1} من ${validProducts.length}...`
        );

        const productData: any = {
          name: product.name.trim(),
          description: product.description.trim(),
          price: parseFloat(product.price),
          stock_quantity: parseInt(product.stock_quantity),
          imagesCount: productImages.length,
        };

        if (product.discount_percentage && product.discount_percentage.trim()) {
          const discount = parseFloat(product.discount_percentage);
          if (!isNaN(discount) && discount >= 0 && discount <= 100) {
            productData.discount_percentage = discount;
          }
        }

        return productData;
      });

      const bulkData: BulkProductData = {
        store_id: storeId,
        products: productsData,
        images: allImages,
      };

      setLoadingMessage("جاري حفظ المنتجات في قاعدة البيانات...");
      const result = await uploadMultipleProducts(bulkData);

      showToast(`تم حفظ ${validProducts.length} منتج بنجاح!`, "success");

      setProducts([
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          price: "",
          discount_percentage: "",
          stock_quantity: "",
          images: [],
        },
      ]);
    } catch (error: any) {
      console.error("خطأ في حفظ المنتجات:", error);
      const errorMessage = error.message || "حدث خطأ أثناء حفظ المنتجات";
      showToast(`${errorMessage}`, "error");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  }, [
    isLoaded,
    storeId,
    products,
    showToast,
    setIsLoading,
    setLoadingMessage,
    setProducts,
  ]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setIsEditing(true);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "Enter") {
      if (rowIndex === products.length - 1) {
        addRow();
      }
      setSelectedCell({ row: rowIndex + 1, col: colIndex });
    } else if (e.key === "Tab") {
      e.preventDefault();
      const nextCol = colIndex + 1;
      if (nextCol < columns.length - 1) {
        setSelectedCell({ row: rowIndex, col: nextCol });
      } else if (rowIndex < products.length - 1) {
        setSelectedCell({ row: rowIndex + 1, col: 0 });
      }
    } else if (e.key === "Escape") {
      setSelectedCell(null);
      setIsEditing(false);
    }
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveProducts();
      }
    },
    [saveProducts]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (!isLoaded) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="جاري تحميل البيانات..."
      />
    );
  }

  if (!storeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-red-600 mb-4 font-medium">
            لم يتم تحديد معرف المتجر
          </p>
          <p className="text-gray-600">
            يرجى تسجيل الدخول أو تحديد المتجر أولاً
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="p-6">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#004D5A] p-3 rounded-lg">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    جدول بيانات المنتجات
                  </h1>
                  <p className="text-gray-600">
                    أدخل بيانات المنتجات مباشرة في الجدول • متجر رقم: {storeId}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {/* زر تحميل نموذج Excel */}
                <button
                  onClick={downloadExcelTemplate}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                  title="تحميل نموذج Excel"
                >
                  <Download className="w-4 h-4" />
                  تحميل نموذج Excel
                </button>

                {/* زر رفع ملف Excel */}
                <div className="relative">
                  <input
                    type="file"
                    ref={excelInputRef}
                    onChange={handleExcelUpload}
                    accept=".xlsx,.xls"
                    disabled={isLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                    title="رفع ملف Excel"
                  >
                    <FileUp className="w-4 h-4" />
                    رفع ملف Excel
                  </button>
                </div>

                <button
                  onClick={addRow}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                  title="إضافة صف جديد"
                >
                  <Plus className="w-4 h-4" />
                  إضافة صف
                </button>
                <button
                  onClick={saveProducts}
                  disabled={isLoading}
                  className="bg-[#004D5A] hover:bg-[#006672] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                  title="حفظ جميع المنتجات (Ctrl+S)"
                >
                  <Save className="w-4 h-4" />
                  حفظ البيانات
                </button>
              </div>
            </div>
          </div>

          {/* Excel Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">
              تعليمات استخدام Excel:
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                • اضغط &quot;تحميل نموذج Excel&quot; للحصول على ملف Excel
                بالتنسيق الصحيح
              </p>
              <p>
                • املأ البيانات في ملف Excel (الاسم والوصف والسعر والكمية
                مطلوبة، نسبة الخصم اختيارية)
              </p>
              <p>
                • احفظ الملف واضغط &quot;رفع ملف Excel&quot; لاستيراد البيانات
              </p>
              <p>• بعد الاستيراد، يمكنك رفع الصور لكل منتج من الواجهة</p>
            </div>
          </div>

          {/* Excel-like Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="w-12 p-3 text-center text-gray-600 font-medium border-r border-gray-300">
                      #
                    </th>
                    {columns.map((col, index) => (
                      <th
                        key={col.key}
                        className="p-3 text-right text-gray-700 font-medium border-r border-gray-300 bg-gray-50"
                        style={{ width: col.width }}
                      >
                        {col.label}
                        {(col.key === "name" ||
                          col.key === "description" ||
                          col.key === "price" ||
                          col.key === "stock_quantity") && (
                          <span className="text-red-500 mr-1">*</span>
                        )}
                        {col.key === "discount_percentage" && (
                          <span className="text-gray-400 mr-1 text-xs">
                            (اختياري)
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="w-16 p-3 text-center text-gray-600 font-medium">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, rowIndex) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-center text-gray-500 font-medium bg-gray-50 border-r border-gray-300">
                        {rowIndex + 1}
                      </td>

                      {/* اسم المنتج */}
                      <td
                        className={`p-0 border-r border-gray-300 ${
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === 0
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, 0)}
                      >
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) =>
                            updateCell(product.id, "name", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 0)}
                          disabled={isLoading}
                          className="w-full h-12 px-3 border-none outline-none bg-transparent hover:bg-blue-50 focus:bg-white disabled:bg-gray-100"
                          placeholder="أدخل اسم المنتج..."
                        />
                      </td>

                      {/* وصف المنتج */}
                      <td
                        className={`p-0 border-r border-gray-300 ${
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === 1
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, 1)}
                      >
                        <input
                          type="text"
                          value={product.description}
                          onChange={(e) =>
                            updateCell(
                              product.id,
                              "description",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                          disabled={isLoading}
                          className="w-full h-12 px-3 border-none outline-none bg-transparent hover:bg-blue-50 focus:bg-white disabled:bg-gray-100"
                          placeholder="أدخل وصف المنتج..."
                        />
                      </td>

                      {/* السعر */}
                      <td
                        className={`p-0 border-r border-gray-300 ${
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === 2
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, 2)}
                      >
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            updateCell(product.id, "price", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 2)}
                          disabled={isLoading}
                          className="w-full h-12 px-3 border-none outline-none bg-transparent hover:bg-blue-50 focus:bg-white text-center disabled:bg-gray-100"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </td>

                      {/* نسبة الخصم */}
                      <td
                        className={`p-0 border-r border-gray-300 ${
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === 3
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, 3)}
                      >
                        <input
                          type="number"
                          value={product.discount_percentage}
                          onChange={(e) =>
                            updateCell(
                              product.id,
                              "discount_percentage",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 3)}
                          disabled={isLoading}
                          className="w-full h-12 px-3 border-none outline-none bg-transparent hover:bg-blue-50 focus:bg-white text-center disabled:bg-gray-100"
                          placeholder="0"
                          step="1"
                          min="0"
                          max="100"
                        />
                      </td>

                      {/* الكمية المتاحة */}
                      <td
                        className={`p-0 border-r border-gray-300 ${
                          selectedCell?.row === rowIndex &&
                          selectedCell?.col === 4
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => handleCellClick(rowIndex, 4)}
                      >
                        <input
                          type="number"
                          value={product.stock_quantity}
                          onChange={(e) =>
                            updateCell(
                              product.id,
                              "stock_quantity",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 4)}
                          disabled={isLoading}
                          className="w-full h-12 px-3 border-none outline-none bg-transparent hover:bg-blue-50 focus:bg-white text-center disabled:bg-gray-100"
                          placeholder="0"
                          min="0"
                        />
                      </td>

                      {/* الصور */}
                      <td className="p-3 border-r border-gray-300">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              ref={setFileInputRef(product.id)}
                              onChange={(e) =>
                                e.target.files &&
                                handleImageUpload(product.id, e.target.files)
                              }
                              accept="image/*"
                              multiple
                              disabled={isLoading}
                              className="hidden"
                            />
                            <button
                              onClick={() =>
                                fileInputRefs.current[product.id]?.click()
                              }
                              disabled={product.images.length >= 8 || isLoading}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                product.images.length >= 8
                                  ? "تم الوصول للحد الأقصى"
                                  : "رفع صور (حد أقصى 5MB لكل صورة)"
                              }
                            >
                              <Upload className="w-3 h-3" />
                              رفع صور
                            </button>
                            <span className="text-xs text-gray-500">
                              {product.images.length}/8
                            </span>
                          </div>

                          {product.images.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.images
                                .slice(0, 4)
                                .map((image, imageIndex) => (
                                  <div
                                    key={imageIndex}
                                    className="relative group"
                                  >
                                    <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                      <img
                                        src={URL.createObjectURL(image)}
                                        alt={`صورة ${imageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeImage(product.id, imageIndex)
                                      }
                                      disabled={isLoading}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                      title="حذف الصورة"
                                    >
                                      <X className="w-2 h-2" />
                                    </button>
                                  </div>
                                ))}
                              {product.images.length > 4 && (
                                <div className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    +{product.images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* إجراءات */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteRow(product.id)}
                          disabled={products.length === 1 || isLoading}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title={
                            products.length === 1
                              ? "لا يمكن حذف الصف الأخير"
                              : "حذف الصف"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={addRow}
                disabled={isLoading}
                className="w-full py-2 text-white bg-teal-600 hover:bg-teal-700 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                إضافة صف جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <LoadingSpinner
          size="lg"
          color="green"
          message={loadingMessage || "جاري معالجة طلبك..."}
          overlay={true}
          pulse={true}
          dots={true}
        />
      )}
    </div>
  );
};

export default ExcelLikeInterface;
