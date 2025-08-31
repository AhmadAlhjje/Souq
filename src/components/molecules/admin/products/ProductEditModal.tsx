// components/molecules/admin/products/ProductEditModal.tsx
import React, { useState, useEffect } from "react";
import { X, Save, Upload, AlertCircle, Edit3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import useTheme from "@/hooks/useTheme";
import { Product } from "../../../../types/product";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
  loading?: boolean;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  loading = false,
}) => {
  const { t, i18n } = useTranslation("");
  const { isDark } = useTheme();
  const isRTL = i18n.language === "ar";

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>("");

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
      });
      setImagePreview(product.image);
      setErrors({});
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Theme-based classes
  const modalClasses = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-300";

  const overlayClasses = isDark ? "bg-black/60" : "bg-black/50";

  const titleClasses = isDark ? "text-gray-100" : "text-[#004D5A]";

  const labelClasses = isDark ? "text-gray-300" : "text-gray-700";

  const inputClasses = isDark
    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 focus:border-[#004D5A]";

  const selectClasses = isDark
    ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 focus:border-[#004D5A]";

  const errorClasses = isDark ? "text-red-400" : "text-red-600";

  const buttonPrimaryClasses = isDark
    ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
    : "bg-[#004D5A] hover:bg-[#003a44] text-white focus:ring-[#004D5A]";

  const buttonSecondaryClasses = isDark
    ? "bg-gray-700 text-gray-200 hover:bg-gray-600 border-gray-600"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300";

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.nameAr?.trim()) {
      newErrors.nameAr = t("validation.nameArRequired");
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = t("validation.priceRequired");
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = t("validation.stockRequired");
    }

    if (!formData.category) {
      newErrors.category = t("validation.categoryRequired");
    }

    if (!formData.status) {
      newErrors.status = t("validation.statusRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData as Product);
  };

  // Handle input changes
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        handleInputChange("image", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/api/placeholder/300/300";
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${overlayClasses}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`
        ${modalClasses} 
        rounded-lg shadow-xl border max-w-4xl w-full mx-4 max-h-[95vh] overflow-auto
        transition-colors duration-200
      `}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${titleClasses} flex items-center gap-3`}
          >
            <Edit3 className="w-6 h-6" />
            {t("productEdit.title")}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors duration-200`}
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <label className={`block text-sm font-medium ${labelClasses}`}>
                {t("productEdit.image")}
              </label>

              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview || "/api/placeholder/300/300"}
                    alt="Product preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    onError={handleImageError}
                  />
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`
                      flex items-center justify-center gap-2 w-full p-3 border border-dashed rounded-lg cursor-pointer
                      transition-colors duration-200
                      ${
                        isDark
                          ? "border-gray-600 hover:border-gray-500 text-gray-300 hover:text-gray-200"
                          : "border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
                      }
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <Upload className="w-5 h-5" />
                    {t("productEdit.uploadImage")}
                  </label>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3
                  className={`text-lg font-semibold ${titleClasses} border-b pb-2 ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  {t("productEdit.basicInfo")}
                </h3>

                {/* Product Name */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${labelClasses} mb-2`}
                    >
                      {t("productEdit.name")} *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                        transition-colors duration-200 ${inputClasses}
                        ${errors.name ? "border-red-500" : ""}
                      `}
                      placeholder={t("productEdit.namePlaceholder")}
                      disabled={loading}
                    />
                    {errors.name && (
                      <p
                        className={`text-sm mt-1 ${errorClasses} flex items-center gap-1`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${labelClasses} mb-2`}
                    >
                      {t("productEdit.nameAr")} *
                    </label>
                    <input
                      type="text"
                      value={formData.nameAr || ""}
                      onChange={(e) =>
                        handleInputChange("nameAr", e.target.value)
                      }
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                        transition-colors duration-200 ${inputClasses}
                        ${errors.nameAr ? "border-red-500" : ""}
                      `}
                      placeholder={t("productEdit.nameArPlaceholder")}
                      dir="rtl"
                      disabled={loading}
                    />
                    {errors.nameAr && (
                      <p
                        className={`text-sm mt-1 ${errorClasses} flex items-center gap-1`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.nameAr}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    className={`block text-sm font-medium ${labelClasses} mb-2`}
                  >
                    {t("productEdit.description")}
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                      transition-colors duration-200 resize-vertical ${inputClasses}
                    `}
                    placeholder={t("productEdit.descriptionPlaceholder")}
                    disabled={loading}
                  />
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${labelClasses} mb-2`}
                    >
                      {t("productEdit.price")} *
                    </label>
                    <input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                        transition-colors duration-200 ${inputClasses}
                        ${errors.price ? "border-red-500" : ""}
                      `}
                      placeholder="0.00"
                      disabled={loading}
                    />
                    {errors.price && (
                      <p
                        className={`text-sm mt-1 ${errorClasses} flex items-center gap-1`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${labelClasses} mb-2`}
                    >
                      {t("productEdit.stock")} *
                    </label>
                    <input
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "stock",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                      className={`
                        w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                        transition-colors duration-200 ${inputClasses}
                        ${errors.stock ? "border-red-500" : ""}
                      `}
                      placeholder="0"
                      disabled={loading}
                    />
                    {errors.stock && (
                      <p
                        className={`text-sm mt-1 ${errorClasses} flex items-center gap-1`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`
              px-6 py-2 border rounded-lg font-medium transition-colors duration-200
              ${buttonSecondaryClasses}
            `}
            disabled={loading}
          >
            {t("actions.cancel")}
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              flex items-center gap-2
              ${buttonPrimaryClasses}
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("actions.saving")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t("actions.save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
