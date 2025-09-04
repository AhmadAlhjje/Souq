// pages/admin/products/AddProductPage.tsxx
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Upload,
  Plus,
  Minus,
  X,
  ImageIcon,
  Edit2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import useTheme from "@/hooks/useTheme";
import AdminLayout from "../../../../components/templates/admin/products/AdminLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { api } from "@/api/api";
import { createProduct } from "@/api/products";

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
  salePrice: string;
  quantity: string;
  category: string;
  status: string;
  images: ProductImage[];
}

const AddProductPage: React.FC = () => {
  const { t, i18n } = useTranslation("products");
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const isRTL = i18n.language === "ar";

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: "",
    salePrice: "",
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
      showToast(`تم رفع ${newImages.length} صورة بنجاح`, "success");
    }
  };

  const removeImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
    showToast("تم حذف الصورة", "info");
  };

  const validateForm = (): boolean => {
    if (!formData.nameAr.trim()) {
      showToast("يرجى إدخال اسم المنتج", "error");
      return false;
    }
    
    if (!formData.price.trim()) {
      showToast("يرجى إدخال سعر المنتج", "error");
      return false;
    }
    
    if (!formData.quantity.trim() || parseInt(formData.quantity) < 0) {
      showToast("يرجى إدخال كمية صحيحة للمنتج", "error");
      return false;
    }
    
    if (formData.images.length === 0) {
      showToast("يرجى رفع صورة واحدة على الأقل للمنتج", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        name: formData.name || formData.nameAr,
        description: formData.description || formData.descriptionAr,
        price: formData.price,
        stock_quantity: formData.quantity,
        store_id: 7,
        images: formData.images
          .filter((img) => img.file)
          .map((img) => img.file!) as File[],
      };

      const response = await createProduct(payload);
      
      // نجح الإنشاء
      showToast("🎉 تم إنشاء المنتج بنجاح! سيتم مراجعته قريباً", "success");
      
      // إعادة تعيين النموذج
      setFormData({
        name: "",
        nameAr: "",
        description: "",
        descriptionAr: "",
        price: "",
        salePrice: "",
        quantity: "",
        category: "",
        status: "draft",
        images: [],
      });
      
      // العودة للخطوة الأولى
      setCurrentStep(1);
      
      console.log("تم إنشاء المنتج:", response.data);
      
    } catch (error: any) {
      console.error("خطأ أثناء إنشاء المنتج:", error.response?.data || error.message);
      
      // عرض رسالة خطأ مناسبة حسب نوع الخطأ
      if (error.response?.status === 400) {
        showToast("خطأ في البيانات المدخلة. يرجى التحقق من جميع الحقول", "error");
      } else if (error.response?.status === 401) {
        showToast("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى", "error");
      } else if (error.response?.status === 413) {
        showToast("حجم الصور كبير جداً. يرجى اختيار صور أصغر", "error");
      } else if (error.response?.status >= 500) {
        showToast("خطأ في الخادم. يرجى المحاولة لاحقاً", "error");
      } else {
        showToast(
          error.response?.data?.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      // التحقق الأساسي قبل الانتقال للخطوة التالية
      if (!formData.nameAr.trim()) {
        showToast("يرجى إدخال اسم المنتج قبل المتابعة", "warning");
        return;
      }
      setCurrentStep(2);
      showToast("انتقلت للخطوة التالية - تحديد السعر والكمية", "info");
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      showToast("عدت للخطوة السابقة", "info");
    }
  };

  const getMainImage = () => {
    return formData.images.length > 0 ? formData.images[0].preview : null;
  };

  const getProductName = () => {
    return formData.nameAr || "اسم المنتج";
  };

  const getProductDescription = () => {
    return formData.descriptionAr || "وصف قصير يوضع هنا شرح منتجك";
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ما اسم المنتج الخاص بك؟ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nameAr}
          onChange={(e) => handleInputChange("nameAr", e.target.value)}
          placeholder="مثال: روتر D-Link 3000"
          className="w-4/5 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-teal-50 transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          كيف تريد أن تصف المحتوى؟ (اختياري)
        </label>
        <textarea
          value={formData.descriptionAr}
          onChange={(e) => handleInputChange("descriptionAr", e.target.value)}
          placeholder="مثال: متقدمة في تجربة الاستخدام"
          rows={1}
          className="w-4/5 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none bg-teal-50 transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          حمل صورة غلاف المنتج هنا <span className="text-red-500">*</span>
        </label>

        <div className="flex justify-center">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer w-48">
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
              <ImageIcon className="mx-auto w-8 h-8 text-gray-400 mb-2" />
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
          متابعة
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ما هو السعر الخاص بالمنتج؟ <span className="text-red-500">*</span>
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
              placeholder="مثال: 65.50"
              className="w-1/3 px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-teal-50 transition-all duration-200"
              disabled={loading}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ما هو السعر بعد الخصم؟ إذا كان هناك خصم؟ (اختياري)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.salePrice}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  handleInputChange("salePrice", value);
                }
              }}
              placeholder="مثال: 25.99"
              className="w-1/3 px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-teal-50 transition-all duration-200"
              disabled={loading}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ما هي كمية المنتج؟ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            placeholder="مثال: 150"
            className="w-1/3 px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-teal-50 transition-all duration-200"
            disabled={loading}
            min="0"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">قطعة</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ارفع بقية صور المنتج هنا
        </label>

        <div className="grid grid-cols-4 gap-3">
          {formData.images.map((image, index) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={image.preview}
                  alt={`Product ${index + 1}`}
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
                      غلاف
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
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
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
          className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          الخلف
        </button>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الإنشاء...
            </>
          ) : (
            "إنهاء"
          )}
        </button>
      </div>
    </div>
  );

  // عرض LoadingSpinner عند التحميل
  if (loading) {
    return (
      <LoadingSpinner
        size="lg"
        color="green"
        message="🛍️ جاري إنشاء منتجك الجديد..."
        overlay={true}
        pulse={true}
        dots={true}
      />
    );
  }

  return (
    <AdminLayout
      title="إضافة منتج جديد"
      subtitle="قم بإضافة منتج جديد إلى متجرك"
    >
      <div className="bg-[#E8F8F5] min-h-screen">
        <div className="p-6 rtl">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {currentStep === 1
                        ? "نقوم بمساعدتك بإضافة المنتج"
                        : "اختر السعر والكمية"}
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
                
                <div className="bg-gray-50 p-8 flex flex-col items-center justify-center relative">
                  <div className="w-full max-w-xs">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                      <div className="aspect-[3/2] bg-gray-100 flex items-center justify-center relative">
                        {getMainImage() ? (
                          <img
                            src={getMainImage()!}
                            alt="Product Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                        {currentStep === 2 && (
                          <div className="absolute top-4 right-4 bg-teal-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                            مسودة
                          </div>
                        )}
                      </div>

                      <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {getProductName()}
                        </h3>
                        <hr className="border-gray-300 mb-4" />
                        <div className="min-h-[120px] flex items-start justify-start mb-4">
                          <p className="text-sm text-gray-600 leading-relaxed text-right">
                            {getProductDescription()}
                          </p>
                        </div>

                        {currentStep === 2 && (
                          <div className="text-center mb-4">
                            <div className="text-sm text-gray-500 mb-1">
                              العدد ضمن المخزون
                            </div>
                            <div className="text-2xl font-bold text-teal-500">
                              {formData.quantity || "150"}
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className="pt-4 border-t">
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">
                                السعر
                              </div>
                              <div className="text-2xl font-bold text-gray-900">
                                {formData.price ? `${formData.price}$` : "65$"}
                              </div>
                              {formData.salePrice && (
                                <div className="text-sm text-green-600 font-medium">
                                  بعد الخصم: {formData.salePrice}$
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="absolute left-8 bottom-8 py-2 px-7 rounded-tl-2xl rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors flex items-center gap-2">
                    اطلب المساعدة
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