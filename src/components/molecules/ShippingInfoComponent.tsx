import React, { useState } from "react";
import { Package, Image, X, ZoomIn, FileImage, User, Phone, MapPin, Truck, Calendar, Hash } from "lucide-react";
import { ShippingInfo } from "../../types/orders";

interface ShippingInfoProps {
  shipping?: ShippingInfo;
  isDark: boolean;
}

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
  isDark: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageName,
  onClose,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
        >
          <X size={24} />
        </button>
        <img
          src={imageUrl}
          alt={imageName}
          className="max-w-full max-h-full object-contain rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          {imageName}
        </div>
      </div>
    </div>
  );
};

const IdentityImagesSection: React.FC<{
  identityImages: string | string[] | null | undefined;
  isDark: boolean;
}> = ({ identityImages, isDark }) => {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // تحويل undefined إلى null للتعامل السهل
  const images = identityImages || null;

  // إذا كانت البيانات null أو فارغة، عرض رسالة
  if (!images) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-300">
        <h4 className="font-medium text-sm text-blue-600 mb-4 flex items-center gap-2">
          <FileImage size={16} />
          صور الهوية
        </h4>
        <div className={`p-4 rounded-lg text-center ${
          isDark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-600"
        }`}>
          <FileImage size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لم يتم رفع صور الهوية بعد</p>
        </div>
      </div>
    );
  }

  // تحليل البيانات - يمكن أن تكون string أو array
  let imagesList: string[] = [];

  if (Array.isArray(images)) {
    imagesList = images;
  } else if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        imagesList = parsed.map((img: any) => img.path || img);
      } else {
        imagesList = [];
      }
    } catch (error) {
      console.error("Error parsing identity images:", error);
      imagesList = [];
    }
  }

  if (imagesList.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-300">
        <h4 className="font-medium text-sm text-blue-600 mb-4 flex items-center gap-2">
          <FileImage size={16} />
          صور الهوية
        </h4>
        <div className={`p-4 rounded-lg text-center ${
          isDark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-600"
        }`}>
          <FileImage size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">لم يتم رفع صور الهوية بعد</p>
        </div>
      </div>
    );
  }

  // استخراج نوع الصورة من اسم الملف
  const getImageTypeFromPath = (path: string, index: number): string => {
    const fileName = path.toLowerCase();
    if (fileName.includes("front") || index === 0) {
      return "الوجه الأمامي";
    } else if (fileName.includes("back") || index === 1) {
      return "الوجه الخلفي";
    }
    return `صورة ${index + 1}`;
  };

  // إنشاء اسم عرض من مسار الملف
  const getDisplayName = (path: string): string => {
    const fileName = path.split("/").pop() || path;
    return fileName.split("-").slice(-1)[0] || fileName;
  };

  // إنشاء URL للصور من متغيرات البيئة
  const getImageUrl = (path: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.1.127:4000";

    if (path.startsWith("uploads/")) {
      return `${baseUrl}/${path}`;
    }
    if (path.startsWith("http")) {
      return path;
    }
    return `${baseUrl}/${path}`;
  };

  return (
    <>
      <div className="mt-4 pt-4 border-t border-gray-300">
        <h4 className="font-medium text-sm text-blue-600 mb-4 flex items-center gap-2">
          <FileImage size={16} />
          صور الهوية ({imagesList.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imagesList.map((imagePath, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 ${
                isDark
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="relative mb-3">
                <div
                  className={`relative h-32 rounded-lg overflow-hidden cursor-pointer group ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setSelectedImage({
                      url: getImageUrl(imagePath),
                      name: getDisplayName(imagePath),
                    })
                  }
                >
                  <img
                    src={getImageUrl(imagePath)}
                    alt={getImageTypeFromPath(imagePath, index)}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-400">
                            <div class="text-center">
                              <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                              </svg>
                              <p class="text-xs">فشل في تحميل الصورة</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <ZoomIn
                      size={24}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>

                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {getImageTypeFromPath(imagePath, index)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image
                    size={14}
                    aria-label="صورة المنتج"
                    className={isDark ? "text-gray-400" : "text-gray-600"}
                  />
                  <span
                    className="text-sm font-medium truncate"
                    title={getDisplayName(imagePath)}
                  >
                    {getDisplayName(imagePath)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      isDark
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {getImageTypeFromPath(imagePath, index)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-3 p-2 rounded text-xs ${
            isDark ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-600"
          }`}
        >
          💡 اضغط على أي صورة لعرضها بحجم كامل
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url || ""}
        imageName={selectedImage?.name || ""}
        onClose={() => setSelectedImage(null)}
        isDark={isDark}
      />
    </>
  );
};

const ShippingInfoComponent: React.FC<ShippingInfoProps> = ({
  shipping,
  isDark,
}) => {
  if (!shipping) {
    return (
      <div
        className={`rounded-lg p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
      >
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Package size={20} className="text-blue-500" />
          معلومات الشحن
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          لا توجد معلومات شحن متاحة
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShippingStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      preparing: "قيد التحضير",
      shipped: "تم الشحن",
      in_transit: "في الطريق",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    };
    return statusMap[status] || status;
  };

  const getShippingMethodText = (method: string) => {
    const methodMap: { [key: string]: string } = {
      express: "شحن سريع",
      standard: "شحن عادي",
      overnight: "شحن ليلي",
    };
    return methodMap[method] || method;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return isDark ? "text-yellow-400 bg-yellow-900" : "text-yellow-600 bg-yellow-100";
      case "shipped":
      case "in_transit":
        return isDark ? "text-blue-400 bg-blue-900" : "text-blue-600 bg-blue-100";
      case "delivered":
        return isDark ? "text-green-400 bg-green-900" : "text-green-600 bg-green-100";
      case "cancelled":
        return isDark ? "text-red-400 bg-red-900" : "text-red-600 bg-red-100";
      default:
        return isDark ? "text-gray-400 bg-gray-700" : "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className={`rounded-lg p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Package size={20} className="text-blue-500" />
        معلومات الشحن
      </h3>

      {/* معلومات العميل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">اسم العميل:</span>
              <p className="font-medium">{shipping.customer_name || "غير محدد"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">رقم الهاتف:</span>
              <p className="font-medium">{shipping.customer_phone || "غير محدد"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">واتساب:</span>
              <p className="font-medium">{shipping.customer_whatsapp || "غير محدد"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">اسم المستلم:</span>
              <p className="font-medium">{shipping.recipient_name || "غير محدد"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">عنوان الشحن:</span>
              <p className="font-medium">{shipping.shipping_address || "غير محدد"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">الوجهة:</span>
              <p className="font-medium">{shipping.destination || "غير محدد"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات الشحن */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Truck size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">طريقة الشحن:</span>
              <p className="font-medium">{getShippingMethodText(shipping.shipping_method)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Package size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">حالة الشحن:</span>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(shipping.shipping_status)}`}>
                  {getShippingStatusText(shipping.shipping_status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {shipping.tracking_number && (
            <div className="flex items-center gap-2">
              <Hash size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
              <div>
                <span className="text-xs text-gray-500">رقم التتبع:</span>
                <p className="font-medium font-mono">{shipping.tracking_number}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className="text-xs text-gray-500">تاريخ الإنشاء:</span>
              <p className="font-medium">{formatDate(shipping.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* التواريخ المهمة */}
      {(shipping.shipped_at || shipping.delivered_at) && (
        <div className="border-t border-gray-300 pt-4 mt-4">
          <h4 className="font-medium text-sm mb-3">التواريخ المهمة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shipping.shipped_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
                <div>
                  <span className="text-xs text-gray-500">تاريخ الشحن:</span>
                  <p className="font-medium">{formatDate(shipping.shipped_at)}</p>
                </div>
              </div>
            )}

            {shipping.delivered_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
                <div>
                  <span className="text-xs text-gray-500">تاريخ التسليم:</span>
                  <p className="font-medium">{formatDate(shipping.delivered_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* صور الهوية */}
      <IdentityImagesSection
        identityImages={shipping.identity_images}
        isDark={isDark}
      />
    </div>
  );
};

export default ShippingInfoComponent;