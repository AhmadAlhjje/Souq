// pages/admin/products/AddProductPage.tsx
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  ImageIcon,
  Edit2,
  HelpCircle,
  Percent,
} from "lucide-react";
import AdminLayout from "../../../../components/templates/admin/products/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { createProduct } from "@/api/products";
import { useStore } from "@/contexts/StoreContext";
import { useThemeContext } from "@/contexts/ThemeContext";

interface ProductImage {
  id: string;
  file?: File;
  url?: string;
  preview: string;
}

interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: string;
  discountPercentage: string;
  quantity: string;
  category: string;
  status: string;
  images: ProductImage[];
}

const AddProductPage: React.FC = () => {
  const { t, i18n } = useTranslation("");
  const { isDark } = useThemeContext();
  const { showToast } = useToast();
  const { storeId, isLoaded } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: "",
    discountPercentage: "",
    quantity: "",
    category: "",
    status: "draft",
    images: [],
  });

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuantityChange = (increment: boolean) => {
    const currentQuantity = parseInt(formData.quantity) || 0;
    const newQuantity = increment
      ? currentQuantity + 1
      : Math.max(0, currentQuantity - 1);
    handleInputChange("quantity", newQuantity.toString());
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages: ProductImage[] = [];
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const id = `${Date.now()}_${index}`;
        const preview = URL.createObjectURL(file);
        newImages.push({ id, file, preview });
      }
    });

    if (newImages.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 8),
      }));
      showToast(t("imageUploadSuccess", { count: newImages.length }), "success");
    }
  };

  const removeImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
    showToast(t("imageRemoved"), "info");
  };

  const validateForm = (): boolean => {
    const nameField = isRTL ? formData.nameAr : formData.name;
    if (!nameField.trim()) {
      showToast(t("validation.nameRequired"), "error");
      return false;
    }
    
    if (!formData.price.trim()) {
      showToast(t("validation.priceRequired"), "error");
      return false;
    }
    
    if (!formData.quantity.trim() || parseInt(formData.quantity) < 0) {
      showToast(t("validation.quantityRequired"), "error");
      return false;
    }
    
    if (formData.images.length === 0) {
      showToast(t("validation.imageRequired"), "warning");
      return false;
    }

    if (formData.discountPercentage.trim() !== "") {
      const discount = parseFloat(formData.discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        showToast(t("validation.discountInvalid"), "error");
        return false;
      }
    }

    return true;
  };

  const calculateDiscountedPrice = (): number | null => {
    const price = parseFloat(formData.price);
    const discount = parseFloat(formData.discountPercentage);
    
    if (!isNaN(price) && !isNaN(discount) && discount > 0) {
      return price - (price * discount / 100);
    }
    
    return null;
  };

  const handleSubmit = async () => {
    if (!storeId) {
      showToast(t("errors.noStore"), "error");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log("=== Debug: Creating Product ===");
      console.log("Store ID:", storeId);
      console.log("User store context:", { storeId, isLoaded });

      const payload: any = {
        name: isRTL ? (formData.nameAr || formData.name) : (formData.name || formData.nameAr),
        description: isRTL ? (formData.descriptionAr || formData.description) : (formData.description || formData.descriptionAr),
        price: formData.price,
        stock_quantity: formData.quantity,
        store_id: storeId,
        images: formData.images
          .filter((img) => img.file)
          .map((img) => img.file!) as File[],
      };

      if (formData.discountPercentage.trim() !== "") {
        const discount = parseFloat(formData.discountPercentage);
        if (!isNaN(discount) && discount > 0 && discount <= 100) {
          payload.discount_percentage = discount;
        }
      }

      console.log("Payload being sent:", payload);

      const response = await createProduct(payload);
      
      showToast(t("success.productCreated"), "success");
      
      // Reset form
      setFormData({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
        price: "",
        discountPercentage: "",
        quantity: "",
        category: "",
        status: "draft",
        images: [],
      });
      
      setCurrentStep(1);
      
      console.log("Product created:", response);
      
    } catch (error: any) {
      console.error("Error creating product:", error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        showToast(t("errors.unauthorized"), "error");
      } else if (error.response?.status === 400) {
        showToast(t("errors.badRequest"), "error");
      } else if (error.response?.status === 401) {
        showToast(t("errors.sessionExpired"), "error");
      } else if (error.response?.status === 413) {
        showToast(t("errors.imageTooLarge"), "error");
      } else if (error.response?.status >= 500) {
        showToast(t("errors.serverError"), "error");
      } else {
        showToast(
          error.response?.data?.message || t("errors.unexpected"),
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      const nameField = isRTL ? formData.nameAr : formData.name;
      if (!nameField.trim()) {
        showToast(t("validation.nameRequiredToContinue"), "warning");
        return;
      }
      setCurrentStep(2);
      showToast(t("stepChanged.toStep2"), "info");
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      showToast(t("stepChanged.toStep1"), "info");
    }
  };

  const getMainImage = () => {
    return formData.images.length > 0 ? formData.images[0].preview : null;
  };

  const getProductName = () => {
    if (isRTL) {
      return formData.nameAr || t("preview.defaultName");
    }
    return formData.name || t("preview.defaultName");
  };

  const getProductDescription = () => {
    if (isRTL) {
      return formData.descriptionAr || t("preview.defaultDescription");
    }
    return formData.description || t("preview.defaultDescription");
  };

  // Theme classes
  const bgClass = isDark ? 'bg-gray-900' : 'bg-[#E8F8F5]';
  const cardBgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMutedClass = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBgClass = isDark ? 'bg-gray-700 border-gray-600' : 'bg-teal-50 border-gray-300';
  const inputFocusClass = isDark 
    ? 'focus:ring-teal-400 focus:border-teal-400' 
    : 'focus:ring-teal-500 focus:border-teal-500';
  const previewBgClass = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const previewCardBgClass = isDark ? 'bg-gray-800' : 'bg-white';
  const previewImageBgClass = isDark ? 'bg-gray-600' : 'bg-gray-100';

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
          {t("step1.nameLabel")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={isRTL ? formData.nameAr : formData.name}
          onChange={(e) => handleInputChange(isRTL ? "nameAr" : "name", e.target.value)}
          placeholder={t("step1.namePlaceholder")}
          className={`w-4/5 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${inputBgClass} ${inputFocusClass} ${textClass}`}
          disabled={loading}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
          {t("step1.descriptionLabel")}
        </label>
        <textarea
          value={isRTL ? formData.descriptionAr : formData.description}
          onChange={(e) => handleInputChange(isRTL ? "descriptionAr" : "description", e.target.value)}
          placeholder={t("step1.descriptionPlaceholder")}
          rows={1}
          className={`w-4/5 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 resize-none transition-all duration-200 ${inputBgClass} ${inputFocusClass} ${textClass}`}
          disabled={loading}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-3 ${textSecondaryClass}`}>
          {t("step1.imageLabel")} <span className="text-red-500">*</span>
        </label>

        <div className="flex justify-center">
          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer w-48 ${
            isDark 
              ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="cover-image-upload"
              disabled={loading}
            />
            <label
              htmlFor="cover-image-upload"
              className={`cursor-pointer block ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ImageIcon className={`mx-auto w-8 h-8 mb-2 ${textMutedClass}`} />
              <div className="flex items-center justify-center">
                <Edit2 className="w-4 h-4 text-teal-500" />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("buttons.continue")}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
            {t("step2.priceLabel")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  handleInputChange("price", value);
                }
              }}
              placeholder={t("step2.pricePlaceholder")}
              className={`w-1/3 px-4 py-3 ${isRTL ? 'pr-12' : 'pl-12'} rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${inputBgClass} ${inputFocusClass} ${textClass}`}
              disabled={loading}
            />
            <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 ${textMutedClass}`}>
              $
            </span>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
            {t("step2.discountLabel")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.discountPercentage}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  const numValue = parseFloat(value);
                  if (value === "" || (!isNaN(numValue) && numValue <= 100)) {
                    handleInputChange("discountPercentage", value);
                  }
                }
              }}
              placeholder={t("step2.discountPlaceholder")}
              className={`w-1/3 px-4 py-3 ${isRTL ? 'pr-12' : 'pl-12'} rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${inputBgClass} ${inputFocusClass} ${textClass}`}
              disabled={loading}
              max="100"
              min="0"
            />
            <Percent className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 ${textMutedClass} w-4 h-4`} />
          </div>
          {formData.discountPercentage && parseFloat(formData.discountPercentage) > 0 && (
            <div className="mt-2 text-sm text-green-600">
              {t("step2.discountedPrice")}: {calculateDiscountedPrice()?.toFixed(2)} $
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${textSecondaryClass}`}>
          {t("step2.quantityLabel")} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            placeholder={t("step2.quantityPlaceholder")}
            className={`w-1/3 px-4 py-3 ${isRTL ? 'pr-12' : 'pl-12'} rounded-xl border focus:outline-none focus:ring-2 transition-all duration-200 ${inputBgClass} ${inputFocusClass} ${textClass}`}
            disabled={loading}
            min="0"
          />
          <span className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 ${textMutedClass}`}>
            {t("step2.quantityUnit")}
          </span>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-3 ${textSecondaryClass}`}>
          {t("step2.additionalImagesLabel")}
        </label>

        <div className="grid grid-cols-4 gap-3">
          {formData.images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className={`aspect-square rounded-xl overflow-hidden border-2 ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <img
                  src={image.preview}
                  alt={`${t("preview.productImage")} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(image.id)}
                  disabled={loading}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <X className="w-3 h-3" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-1 right-1">
                    <div className="bg-teal-500 text-white px-2 py-1 rounded text-xs">
                      {t("preview.coverImage")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {Array.from({ length: Math.max(0, 8 - formData.images.length) }).map(
            (_, index) => (
              <label
                key={`empty-${index}`}
                htmlFor="image-upload"
                className={`cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`aspect-square rounded-xl border-2 border-dashed transition-colors flex items-center justify-center ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}>
                  <ImageIcon className={`w-6 h-6 ${textMutedClass}`} />
                </div>
              </label>
            )
          )}
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={loading}
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={handleBack}
          disabled={loading}
          className={`px-6 py-3 rounded-xl border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDark 
              ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          {t("buttons.back")}
        </button>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t("buttons.creating")}
            </>
          ) : (
            t("buttons.finish")
          )}
        </button>
      </div>
    </div>
  );

  // Loading states
  if (!isLoaded) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message=""
        overlay={true}
        pulse={true}
      />
    );
  }

  if (!storeId) {
    return (
      <AdminLayout title={t("errors.title")} subtitle={t("errors.storeNotFound")}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className={`text-red-600 text-lg mb-4 ${textClass}`}>
              {t("errors.storeNotFoundMessage")}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600"
            >
              {t("buttons.retry")}
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message={t("loading.creatingProduct")}
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

  return (
    <AdminLayout
      title={t("pageTitle")}
      subtitle={t("pageSubtitle")}
    >
      <div className={`min-h-screen ${bgClass}`}>
        <div className={`p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="max-w-6xl mx-auto">
            <div className={`rounded-2xl shadow-sm overflow-hidden ${cardBgClass}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className={`text-lg font-semibold mb-4 ${textClass}`}>
                      {currentStep === 1 ? t("step1.title") : t("step2.title")}
                    </h2>

                    <div className="flex gap-2 mb-4">
                      <div
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          currentStep >= 1 ? "bg-teal-500" : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          currentStep >= 2 ? "bg-teal-500" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                </div>
                
                <div className={`p-8 flex flex-col items-center justify-center relative ${previewBgClass}`}>
                  <div className="w-full max-w-xs">
                    <div className={`rounded-2xl shadow-sm overflow-hidden mb-6 ${previewCardBgClass}`}>
                      <div className={`aspect-[3/2] flex items-center justify-center relative ${previewImageBgClass}`}>
                        {getMainImage() ? (
                          <img
                            src={getMainImage()!}
                            alt={t("preview.productImage")}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className={`w-12 h-12 ${textMutedClass}`} />
                        )}
                        {currentStep === 2 && (
                          <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                            {t("status.draft")}
                          </div>
                        )}
                        {currentStep === 2 && formData.discountPercentage && parseFloat(formData.discountPercentage) > 0 && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                            -{formData.discountPercentage}%
                          </div>
                        )}
                      </div>

                      <div className="p-4 text-center">
                        <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>
                          {getProductName()}
                        </h3>
                        <hr className={`mb-4 ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
                        <div className="min-h-[120px] flex items-start justify-start mb-4">
                          <p className={`text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'} ${textMutedClass}`}>
                            {getProductDescription()}
                          </p>
                        </div>

                        {currentStep === 2 && (
                          <div className="text-center mb-4">
                            <div className={`text-sm mb-1 ${textMutedClass}`}>
                              {t("preview.stockQuantity")}
                            </div>
                            <div className="text-2xl font-bold text-teal-500">
                              {formData.quantity || "150"}
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className={`pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                              <div className={`text-sm mb-1 ${textMutedClass}`}>
                                {t("preview.price")}
                              </div>
                              {formData.discountPercentage && parseFloat(formData.discountPercentage) > 0 ? (
                                <div>
                                  <div className={`text-lg line-through ${textMutedClass}`}>
                                    {formData.price ? `${formData.price} $` : "65 $"}
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    {calculateDiscountedPrice()?.toFixed(2) || "55.25"} $
                                  </div>
                                  <div className="text-sm text-red-600 font-medium">
                                    {t("preview.discount")} {formData.discountPercentage}%
                                  </div>
                                </div>
                              ) : (
                                <div className={`text-2xl font-bold ${textClass}`}>
                                  {formData.price ? `${formData.price} $` : "65 $"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className={`absolute ${isRTL ? 'right-8' : 'left-8'} bottom-8 py-2 px-7 rounded-tl-2xl rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors flex items-center gap-2`}>
                    {t("buttons.getHelp")}
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;