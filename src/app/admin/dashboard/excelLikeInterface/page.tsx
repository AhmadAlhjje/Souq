"use client";
import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import { useThemeContext } from "@/contexts/ThemeContext";
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
  const { t, i18n } = useTranslation("");
  const { isDark } = useThemeContext();
  const isRTL = i18n.language === 'ar';
  
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

  // Theme classes
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-800';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-gray-600' : 'border-gray-300';
  const borderLightClass = isDark ? 'border-gray-700' : 'border-gray-200';
  const hoverBgClass = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const inputBgClass = isDark ? 'bg-gray-700' : 'bg-transparent';
  const inputHoverClass = isDark ? 'hover:bg-gray-600' : 'hover:bg-blue-50';
  const inputFocusClass = isDark ? 'focus:bg-gray-600' : 'focus:bg-white';
  const headerBgClass = isDark ? 'bg-gray-700' : 'bg-gray-100';
  const rowHeaderBgClass = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const instructionsBgClass = isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200';
  const instructionsTextClass = isDark ? 'text-blue-300' : 'text-blue-800';
  const instructionsTextSecondaryClass = isDark ? 'text-blue-200' : 'text-blue-700';

  const columns = [
    { key: "name", label: t("columns.name"), width: "200px" },
    { key: "description", label: t("columns.description"), width: "300px" },
    { key: "price", label: t("columns.price"), width: "120px" },
    { key: "discount_percentage", label: t("columns.discount"), width: "120px" },
    { key: "stock_quantity", label: t("columns.quantity"), width: "120px" },
    { key: "images", label: t("columns.images"), width: "250px" },
  ];

  const downloadExcelTemplate = () => {
    const templateData = [
      {
        [t("excelColumns.name")]: t("exampleData.product1.name"),
        [t("excelColumns.description")]: t("exampleData.product1.description"),
        [t("excelColumns.price")]: 29.99,
        [t("excelColumns.discount")]: 10,
        [t("excelColumns.quantity")]: 50,
      },
      {
        [t("excelColumns.name")]: t("exampleData.product2.name"),
        [t("excelColumns.description")]: t("exampleData.product2.description"),
        [t("excelColumns.price")]: 79.99,
        [t("excelColumns.discount")]: "",
        [t("excelColumns.quantity")]: 25,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t("excelWorksheetName"));

    const colWidths = [
      { wch: 25 },
      { wch: 40 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, t("templateFileName"));
    showToast(t("messages.templateDownloaded"), "success");
  };

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
          showToast(t("errors.emptyFile"), "error");
          return;
        }

        const importedProducts: ProductRow[] = jsonData.map(
          (row: any, index: number) => {
            const nameKey = t("excelColumns.name");
            const descKey = t("excelColumns.description");
            const priceKey = t("excelColumns.price");
            const discountKey = t("excelColumns.discount");
            const quantityKey = t("excelColumns.quantity");

            return {
              id: (Date.now() + index).toString(),
              name: row[nameKey] || row["name"] || "",
              description: row[descKey] || row["description"] || "",
              price: (row[priceKey] || row["price"] || "").toString(),
              discount_percentage: (
                row[discountKey] || row["discount_percentage"] || ""
              ).toString(),
              stock_quantity: (
                row[quantityKey] || row["stock_quantity"] || ""
              ).toString(),
              images: [],
            };
          }
        );

        const validProducts = importedProducts.filter(
          (product) =>
            product.name.trim() &&
            product.description.trim() &&
            product.price &&
            product.stock_quantity
        );

        if (validProducts.length === 0) {
          showToast(t("errors.noValidProducts"), "error");
          return;
        }

        setProducts((prevProducts) => {
          const filteredPrev = prevProducts.filter(
            (p) =>
              p.name.trim() ||
              p.description.trim() ||
              p.price ||
              p.stock_quantity
          );
          return [...filteredPrev, ...validProducts];
        });

        showToast(t("messages.productsImported", { count: validProducts.length }), "success");

        if (importedProducts.length > validProducts.length) {
          const skipped = importedProducts.length - validProducts.length;
          showToast(t("messages.productsSkipped", { count: skipped }), "warning");
        }
      } catch (error) {
        console.error("Excel reading error:", error);
        showToast(t("errors.excelReadError"), "error");
      }
    };

    reader.readAsArrayBuffer(file);

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
    showToast(t("messages.rowAdded"), "info");
  };

  const deleteRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
      showToast(t("messages.rowDeleted"), "success");
    } else {
      showToast(t("messages.cannotDeleteLastRow"), "warning");
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
      showToast(t("errors.maxImagesExceeded"), "warning");
      return;
    }

    const validImages = newImages.filter((file) =>
      file.type.startsWith("image/")
    );
    if (validImages.length !== newImages.length) {
      showToast(t("errors.invalidImageFiles"), "error");
      return;
    }

    const oversizedFiles = validImages.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      showToast(t("errors.imageTooLarge"), "error");
      return;
    }

    updateCell(productId, "images", [...currentProduct.images, ...validImages]);
    showToast(t("messages.imagesAdded", { count: validImages.length }), "success");
  };

  const removeImage = (productId: string, imageIndex: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newImages = product.images.filter((_, index) => index !== imageIndex);
    updateCell(productId, "images", newImages);
    showToast(t("messages.imageRemoved"), "success");
  };

  const saveProducts = useCallback(async () => {
    const validateProducts = (products: any[]) => {
      const errors: string[] = [];

      products.forEach((product, index) => {
        if (!product.name.trim()) {
          errors.push(t("validation.nameRequired", { index: index + 1 }));
        }
        if (!product.description.trim()) {
          errors.push(t("validation.descriptionRequired", { index: index + 1 }));
        }
        if (!product.price || parseFloat(product.price) <= 0) {
          errors.push(t("validation.priceRequired", { index: index + 1 }));
        }
        if (!product.stock_quantity || parseInt(product.stock_quantity) < 0) {
          errors.push(t("validation.quantityRequired", { index: index + 1 }));
        }
        if (product.discount_percentage) {
          const discount = parseFloat(product.discount_percentage);
          if (isNaN(discount) || discount < 0 || discount > 100) {
            errors.push(t("validation.discountInvalid", { index: index + 1 }));
          }
        }
      });

      return errors;
    };

    if (!isLoaded || !storeId) {
      showToast(t("errors.storeNotIdentified"), "error");
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
      showToast(t("errors.noValidData"), "warning");
      return;
    }

    const validationErrors = validateProducts(validProducts);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => showToast(error, "error"));
      return;
    }

    setIsLoading(true);
    setLoadingMessage(t("loading.preparingData"));

    try {
      setLoadingMessage(t("loading.processingProducts"));

      const allImages: File[] = [];
      const productsData = validProducts.map((product, index) => {
        const productImages = product.images;
        allImages.push(...productImages);

        setLoadingMessage(t("loading.processingProduct", { 
          current: index + 1, 
          total: validProducts.length 
        }));

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

      setLoadingMessage(t("loading.savingToDatabase"));
      const result = await uploadMultipleProducts(bulkData);

      showToast(t("messages.productsSaved", { count: validProducts.length }), "success");

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
      console.error("Error saving products:", error);
      const errorMessage = error.message || t("errors.savingError");
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
    t,
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
        message={t("loading.loadingData")}
      />
    );
  }

  if (!storeId) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
        <div className={`text-center p-8 rounded-lg shadow-sm ${cardBgClass}`}>
          <div className="text-red-500 mb-4">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
          </div>
          <p className="text-red-600 mb-4 font-medium">
            {t("errors.storeNotIdentified")}
          </p>
          <p className={textSecondaryClass}>
            {t("errors.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className={`rounded-lg shadow-sm p-6 mb-6 ${cardBgClass}`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#004D5A] p-3 rounded-lg flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold mb-1 ${textClass}`}>
                    {t("pageTitle")}
                  </h1>
                  <p className={textSecondaryClass}>
                    {t("pageDescription")} • {t("storeId")}: {storeId}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={downloadExcelTemplate}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                  title={t("tooltips.downloadTemplate")}
                >
                  <Download className="w-4 h-4" />
                  {t("buttons.downloadTemplate")}
                </button>

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
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                    title={t("tooltips.uploadExcel")}
                  >
                    <FileUp className="w-4 h-4" />
                    {t("buttons.uploadExcel")}
                  </button>
                </div>

                <button
                  onClick={addRow}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                  title={t("tooltips.addRow")}
                >
                  <Plus className="w-4 h-4" />
                  {t("buttons.addRow")}
                </button>
                <button
                  onClick={saveProducts}
                  disabled={isLoading}
                  className="bg-[#004D5A] hover:bg-[#006672] text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                  title={t("tooltips.saveData")}
                >
                  <Save className="w-4 h-4" />
                  {t("buttons.saveData")}
                </button>
              </div>
            </div>
          </div>

          {/* Excel Instructions */}
          <div className={`rounded-lg p-4 mb-6 border ${instructionsBgClass}`}>
            <h3 className={`font-semibold mb-2 ${instructionsTextClass}`}>
              {t("instructions.title")}
            </h3>
            <div className={`text-sm space-y-1 ${instructionsTextSecondaryClass}`}>
              <p>• {t("instructions.step1")}</p>
              <p>• {t("instructions.step2")}</p>
              <p>• {t("instructions.step3")}</p>
              <p>• {t("instructions.step4")}</p>
            </div>
          </div>

          {/* Excel-like Table */}
          <div className={`rounded-lg shadow-sm overflow-hidden ${cardBgClass}`}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b-2 ${headerBgClass} ${borderClass}`}>
                    <th className={`w-12 p-3 text-center font-medium ${textSecondaryClass} ${borderClass} ${isRTL ? 'border-l' : 'border-r'}`}>
                      #
                    </th>
                    {columns.map((col, index) => (
                      <th
                        key={col.key}
                        className={`p-3 ${isRTL ? 'text-right' : 'text-left'} font-medium ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${textClass} ${rowHeaderBgClass}`}
                        style={{ width: col.width }}
                      >
                        {col.label}
                        {(col.key === "name" ||
                          col.key === "description" ||
                          col.key === "price" ||
                          col.key === "stock_quantity") && (
                          <span className={`text-red-500 ${isRTL ? 'ml-1' : 'mr-1'}`}>*</span>
                        )}
                        {col.key === "discount_percentage" && (
                          <span className={`text-xs ${textMutedClass} ${isRTL ? 'ml-1' : 'mr-1'}`}>
                            ({t("labels.optional")})
                          </span>
                        )}
                      </th>
                    ))}
                    <th className={`w-16 p-3 text-center font-medium ${textSecondaryClass}`}>
                      {t("labels.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, rowIndex) => (
                    <tr
                      key={product.id}
                      className={`border-b ${borderLightClass} ${hoverBgClass} transition-colors`}
                    >
                      <td className={`p-3 text-center font-medium ${textMutedClass} ${rowHeaderBgClass} ${borderClass} ${isRTL ? 'border-l' : 'border-r'}`}>
                        {rowIndex + 1}
                      </td>

                      {/* Product Name */}
                      <td
                        className={`p-0 ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${
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
                          className={`w-full h-12 px-3 border-none outline-none ${inputBgClass} ${inputHoverClass} ${inputFocusClass} disabled:opacity-50 ${textClass}`}
                          placeholder={t("placeholders.productName")}
                        />
                      </td>

                      {/* Product Description */}
                      <td
                        className={`p-0 ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${
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
                            updateCell(product.id, "description", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 1)}
                          disabled={isLoading}
                          className={`w-full h-12 px-3 border-none outline-none ${inputBgClass} ${inputHoverClass} ${inputFocusClass} disabled:opacity-50 ${textClass}`}
                          placeholder={t("placeholders.productDescription")}
                        />
                      </td>

                      {/* Price */}
                      <td
                        className={`p-0 ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${
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
                          className={`w-full h-12 px-3 border-none outline-none ${inputBgClass} ${inputHoverClass} ${inputFocusClass} text-center disabled:opacity-50 ${textClass}`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </td>

                      {/* Discount Percentage */}
                      <td
                        className={`p-0 ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${
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
                            updateCell(product.id, "discount_percentage", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 3)}
                          disabled={isLoading}
                          className={`w-full h-12 px-3 border-none outline-none ${inputBgClass} ${inputHoverClass} ${inputFocusClass} text-center disabled:opacity-50 ${textClass}`}
                          placeholder="0"
                          step="1"
                          min="0"
                          max="100"
                        />
                      </td>

                      {/* Stock Quantity */}
                      <td
                        className={`p-0 ${borderClass} ${isRTL ? 'border-l' : 'border-r'} ${
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
                            updateCell(product.id, "stock_quantity", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, 4)}
                          disabled={isLoading}
                          className={`w-full h-12 px-3 border-none outline-none ${inputBgClass} ${inputHoverClass} ${inputFocusClass} text-center disabled:opacity-50 ${textClass}`}
                          placeholder="0"
                          min="0"
                        />
                      </td>

                      {/* Images */}
                      <td className={`p-3 ${borderClass} ${isRTL ? 'border-l' : 'border-r'}`}>
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
                              className={`px-3 py-1 rounded text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                                isDark 
                                  ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300' 
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              }`}
                              title={
                                product.images.length >= 8
                                  ? t("tooltips.maxImagesReached")
                                  : t("tooltips.uploadImages")
                              }
                            >
                              <Upload className="w-3 h-3" />
                              {t("buttons.uploadImages")}
                            </button>
                            <span className={`text-xs ${textMutedClass}`}>
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
                                    <div className={`w-12 h-12 rounded border flex items-center justify-center overflow-hidden ${
                                      isDark ? 'bg-gray-600 border-gray-500' : 'bg-gray-100 border-gray-300'
                                    }`}>
                                      <img
                                        src={URL.createObjectURL(image)}
                                        alt={t("labels.imageAlt", { index: imageIndex + 1 })}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeImage(product.id, imageIndex)
                                      }
                                      disabled={isLoading}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                      title={t("tooltips.deleteImage")}
                                    >
                                      <X className="w-2 h-2" />
                                    </button>
                                  </div>
                                ))}
                              {product.images.length > 4 && (
                                <div className={`w-12 h-12 rounded border flex items-center justify-center ${
                                  isDark ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'
                                }`}>
                                  <span className={`text-xs ${textMutedClass}`}>
                                    +{product.images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteRow(product.id)}
                          disabled={products.length === 1 || isLoading}
                          className={`hover:text-red-800 disabled:cursor-not-allowed transition-colors ${
                            products.length === 1 || isLoading 
                              ? textMutedClass 
                              : 'text-red-600'
                          }`}
                          title={
                            products.length === 1
                              ? t("tooltips.cannotDeleteLastRow")
                              : t("tooltips.deleteRow")
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

            {/* Add Row Footer */}
            <div className={`p-4 border-t ${borderLightClass} ${rowHeaderBgClass}`}>
              <button
                onClick={addRow}
                disabled={isLoading}
                className="w-full py-2 text-white bg-teal-600 hover:bg-teal-700 transition-colors rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {t("buttons.addNewRow")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingSpinner
          size="lg"
          color="green"
          message={loadingMessage || t("loading.processing")}
          overlay={true}
          pulse={true}
          dots={true}
        />
      )}
    </div>
  );
};

export default ExcelLikeInterface;