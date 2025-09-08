"use client";
import React, { useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Eye,
  Package,
} from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/useToast";
import { uploadMultipleProducts } from "@/api/products";
import * as XLSX from "xlsx";

interface ProductRow {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  images: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkUploadPage = () => {
  const { isDark } = useThemeContext();
  const { storeId } = useStore();
  const { showToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ProductRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  // تعريف الألوان حسب الوضع
  const themeClasses = {
    background: isDark ? "bg-gray-900" : "bg-teal-100",
    cardBackground: isDark ? "bg-gray-800" : "bg-white",
    textPrimary: isDark ? "text-white" : "text-gray-800",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    borderColor: isDark ? "border-gray-700" : "border-gray-200",
    inputBackground: isDark ? "bg-gray-700" : "bg-white",
    inputBorder: isDark ? "border-gray-600" : "border-gray-300",
    inputText: isDark ? "text-white" : "text-gray-900",
    shadow: isDark ? "shadow-gray-900/20" : "shadow-xl",
  };

  // دالة تنزيل ملف Excel النموذجي
  const downloadTemplate = () => {
    const templateData = [
      {
        name: "اسم المنتج",
        description: "وصف المنتج",
        price: "السعر",
        stock_quantity: "الكمية المتاحة",
        images: "روابط الصور (مفصولة بفاصلة)",
      },
      {
        name: "iPhone 14",
        description: "أحدث هاتف من آبل",
        price: 999.99,
        stock_quantity: 50,
        images: "/uploads/iphone14_1.jpg,/uploads/iphone14_2.jpg",
      },
      {
        name: "Samsung Galaxy S23",
        description: "هاتف أندرويد متطور",
        price: 899.99,
        stock_quantity: 30,
        images: "/uploads/samsung_s23.jpg",
      },
      {
        name: "MacBook Pro",
        description: "لابتوب للمحترفين",
        price: 1999.99,
        stock_quantity: 10,
        images: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "المنتجات");

    // تحديد عرض الأعمدة
    worksheet["!cols"] = [
      { width: 20 }, // name
      { width: 30 }, // description
      { width: 10 }, // price
      { width: 15 }, // stock_quantity
      { width: 40 }, // images
    ];

    XLSX.writeFile(workbook, "قالب_رفع_المنتجات.xlsx");
    showToast("تم تنزيل القالب بنجاح", "success");
  };

  // دالة معالجة رفع الملف
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
      showToast("يرجى رفع ملف Excel صحيح (.xlsx أو .xls)", "error");
      return;
    }

    setFile(uploadedFile);
    setLoading(true);
    setValidationErrors([]);
    setUploadResult(null);

    try {
      const fileBuffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (jsonData.length === 0) {
        showToast("الملف فارغ أو لا يحتوي على بيانات صحيحة", "error");
        return;
      }

      // تنظيف وتحويل البيانات
      const products: ProductRow[] = jsonData.slice(1).map((row, index) => ({
        name: String(row.name || "").trim(),
        description: String(row.description || "").trim(),
        price: parseFloat(row.price) || 0,
        stock_quantity: parseInt(row.stock_quantity) || 0,
        images: String(row.images || "").trim(),
      }));

      // التحقق من صحة البيانات
      const errors = validateProducts(products);
      setValidationErrors(errors);
      setPreviewData(products);
      setShowPreview(true);

      if (errors.length === 0) {
        showToast(`تم تحليل ${products.length} منتج بنجاح`, "success");
      } else {
        showToast(`تم العثور على ${errors.length} خطأ في البيانات`, "warning");
      }
    } catch (error) {
      console.error("Error reading file:", error);
      showToast("خطأ في قراءة الملف", "error");
    } finally {
      setLoading(false);
    }
  };

  // دالة التحقق من صحة البيانات
  const validateProducts = (products: ProductRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    products.forEach((product, index) => {
      const rowNumber = index + 2; // +2 لأن الصف الأول هو العناوين و array يبدأ من 0

      if (!product.name) {
        errors.push({
          row: rowNumber,
          field: "name",
          message: "اسم المنتج مطلوب",
        });
      }

      if (!product.description) {
        errors.push({
          row: rowNumber,
          field: "description",
          message: "وصف المنتج مطلوب",
        });
      }

      if (product.price <= 0) {
        errors.push({
          row: rowNumber,
          field: "price",
          message: "السعر يجب أن يكون أكبر من 0",
        });
      }

      if (product.stock_quantity < 0) {
        errors.push({
          row: rowNumber,
          field: "stock_quantity",
          message: "الكمية لا يمكن أن تكون سالبة",
        });
      }
    });

    return errors;
  };

  // دالة رفع المنتجات
  const handleUploadProducts = async () => {
    if (!storeId) {
      showToast("معرف المتجر غير موجود", "error");
      return;
    }

    if (validationErrors.length > 0) {
      showToast("يرجى إصلاح الأخطاء قبل الرفع", "error");
      return;
    }

    setUploading(true);

    try {
      // تحويل البيانات إلى الشكل المطلوب للAPI
      const productsData = previewData.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        images: product.images
          ? product.images.split(",").map((img) => img.trim()).filter(Boolean)
          : [],
      }));

      const bulkData = {
        store_id: storeId,
        products: productsData,
      };

      await uploadMultipleProducts(bulkData);

      setUploadResult({
        success: true,
        message: "تم رفع المنتجات بنجاح",
        count: productsData.length,
      });

      showToast(`تم رفع ${productsData.length} منتج بنجاح`, "success");

      // إعادة تعيين الحالة
      setFile(null);
      setPreviewData([]);
      setShowPreview(false);
      setValidationErrors([]);
    } catch (error: any) {
      console.error("Error uploading products:", error);
      const errorMessage =
        error.response?.data?.message || "فشل في رفع المنتجات";
      setUploadResult({
        success: false,
        message: errorMessage,
      });
      showToast(errorMessage, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`} dir="rtl">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-2`}>
              رفع المنتجات بالجملة
            </h1>
            <p className={themeClasses.textSecondary}>
              قم برفع عدة منتجات مرة واحدة باستخدام ملف Excel
            </p>
          </div>

          {/* Template Download Section */}
          <div className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6 mb-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold ${themeClasses.textPrimary} mb-1`}>
                    تحميل القالب
                  </h3>
                  <p className={themeClasses.textSecondary}>
                    احصل على ملف Excel النموذجي مع التنسيق الصحيح
                  </p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                تحميل القالب
              </button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6 mb-6`}>
            <h3 className={`font-bold ${themeClasses.textPrimary} mb-4`}>
              رفع ملف Excel
            </h3>

            <div
              className={`border-2 border-dashed ${
                file ? "border-teal-500 bg-teal-50" : themeClasses.borderColor
              } rounded-xl p-8 text-center transition-colors`}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                {loading ? (
                  <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
                ) : file ? (
                  <CheckCircle className="w-12 h-12 text-teal-600" />
                ) : (
                  <Upload className={`w-12 h-12 ${themeClasses.textMuted}`} />
                )}

                <div>
                  <h4 className={`font-medium ${themeClasses.textPrimary} mb-1`}>
                    {file ? file.name : "اختر ملف Excel"}
                  </h4>
                  <p className={themeClasses.textMuted}>
                    {loading
                      ? "جاري تحليل الملف..."
                      : file
                      ? "تم رفع الملف بنجاح"
                      : "اسحب الملف هنا أو انقر للاختيار"}
                  </p>
                </div>

                {!file && !loading && (
                  <span className="bg-teal-600 text-white px-4 py-2 rounded-lg">
                    اختيار ملف
                  </span>
                )}
              </label>
            </div>

            {file && !loading && (
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setShowPreview(false);
                    setValidationErrors([]);
                    setUploadResult(null);
                  }}
                  className={`${themeClasses.inputBackground} ${themeClasses.textPrimary} px-4 py-2 rounded-lg border ${themeClasses.borderColor} hover:bg-gray-100 transition-colors flex items-center gap-2`}
                >
                  <X className="w-4 h-4" />
                  إزالة الملف
                </button>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-red-800">
                  أخطاء في البيانات ({validationErrors.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <span className="font-medium">الصف {error.row}:</span>{" "}
                    {error.message} ({error.field})
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`${
                uploadResult.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border rounded-2xl p-6 mb-6`}
            >
              <div className="flex items-center gap-3">
                {uploadResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h3
                    className={`font-bold ${
                      uploadResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {uploadResult.success ? "تم الرفع بنجاح" : "فشل في الرفع"}
                  </h3>
                  <p
                    className={`text-sm ${
                      uploadResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {uploadResult.message}
                    {uploadResult.count && ` - تم رفع ${uploadResult.count} منتج`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {showPreview && previewData.length > 0 && (
            <div className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-teal-600" />
                  <h3 className={`font-bold ${themeClasses.textPrimary}`}>
                    معاينة المنتجات ({previewData.length})
                  </h3>
                </div>
                {validationErrors.length === 0 && (
                  <button
                    onClick={handleUploadProducts}
                    disabled={uploading}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                    {uploading ? "جاري الرفع..." : "رفع المنتجات"}
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${themeClasses.inputBackground} border-b ${themeClasses.borderColor}`}>
                      <th className={`text-right p-3 font-medium ${themeClasses.textPrimary}`}>
                        اسم المنتج
                      </th>
                      <th className={`text-right p-3 font-medium ${themeClasses.textPrimary}`}>
                        الوصف
                      </th>
                      <th className={`text-right p-3 font-medium ${themeClasses.textPrimary}`}>
                        السعر
                      </th>
                      <th className={`text-right p-3 font-medium ${themeClasses.textPrimary}`}>
                        الكمية
                      </th>
                      <th className={`text-right p-3 font-medium ${themeClasses.textPrimary}`}>
                        الصور
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((product, index) => {
                      const rowErrors = validationErrors.filter(
                        (error) => error.row === index + 2
                      );
                      const hasErrors = rowErrors.length > 0;

                      return (
                        <tr
                          key={index}
                          className={`border-b ${themeClasses.borderColor} ${
                            hasErrors ? "bg-red-50" : ""
                          }`}
                        >
                          <td className={`p-3 ${themeClasses.textSecondary}`}>
                            {product.name || (
                              <span className="text-red-500">مطلوب</span>
                            )}
                          </td>
                          <td className={`p-3 ${themeClasses.textSecondary}`}>
                            {product.description || (
                              <span className="text-red-500">مطلوب</span>
                            )}
                          </td>
                          <td className={`p-3 ${themeClasses.textSecondary}`}>
                            {product.price > 0 ? (
                              `${product.price} ريال`
                            ) : (
                              <span className="text-red-500">غير صحيح</span>
                            )}
                          </td>
                          <td className={`p-3 ${themeClasses.textSecondary}`}>
                            {product.stock_quantity >= 0 ? (
                              product.stock_quantity
                            ) : (
                              <span className="text-red-500">غير صحيح</span>
                            )}
                          </td>
                          <td className={`p-3 ${themeClasses.textSecondary} text-sm`}>
                            {product.images ? (
                              <span className="text-blue-600">
                                {product.images.split(",").length} صورة
                              </span>
                            ) : (
                              <span className="text-gray-400">لا توجد</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {previewData.length > 10 && (
                  <div className={`text-center py-4 ${themeClasses.textMuted}`}>
                    ... و {previewData.length - 10} منتج آخر
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;