// // components/templates/ProductDetailsPage.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Star,
//   ShoppingCart,
//   Plus,
//   Minus,
//   Check,
//   ArrowRight,
//   User,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   ZoomIn,
// } from "lucide-react";
// import { Product } from "@/types/product";
// import { useCart } from "@/hooks/useCart"; // استخدام Hook الجديد
// import { useSessionContext } from "@/components/SessionProvider";
// import { useToast } from "@/hooks/useToast";

// interface ProductDetailsPageProps {
//   product: Product;
//   onBackToProducts?: () => void;
// }

// // مكون عرض الصور المتقدم (نفس الكود السابق)
// interface ImageGalleryProps {
//   images: string[];
//   currentIndex: number;
//   isOpen: boolean;
//   onClose: () => void;
//   onNext: () => void;
//   onPrevious: () => void;
//   onSelectImage: (index: number) => void;
//   productName: string;
// }

// const ImageGallery: React.FC<ImageGalleryProps> = ({
//   images,
//   currentIndex,
//   isOpen,
//   onClose,
//   onNext,
//   onPrevious,
//   onSelectImage,
//   productName,
// }) => {
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowLeft") onNext();
//       if (e.key === "ArrowRight") onPrevious();
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, onClose, onNext, onPrevious]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
//       <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-10">
//         <div className="flex items-center gap-4">
//           <span className="text-sm">
//             {currentIndex + 1} من {images.length}
//           </span>
//           <span className="text-sm opacity-75">{productName}</span>
//         </div>
//         <button
//           onClick={onClose}
//           className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
//         >
//           <X className="w-6 h-6" />
//         </button>
//       </div>

//       <div className="flex items-center justify-center w-full h-full px-20">
//         <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
//           <img
//             src={images[currentIndex]}
//             alt={productName}
//             className="max-w-full max-h-full object-contain"
//             style={{ userSelect: "none" }}
//           />
//           <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
//             <ZoomIn className="w-4 h-4" />
//           </div>
//         </div>
//       </div>

//       {images.length > 1 && (
//         <>
//           <button
//             onClick={onNext}
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
//             disabled={currentIndex === images.length - 1}
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>
//           <button
//             onClick={onPrevious}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
//             disabled={currentIndex === 0}
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </>
//       )}

//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
//         {images.map((img, idx) => (
//           <button
//             key={idx}
//             onClick={() => onSelectImage(idx)}
//             className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
//               idx === currentIndex
//                 ? "border-white"
//                 : "border-gray-400 opacity-70"
//             }`}
//           >
//             <img src={img} alt="" className="w-full h-full object-cover" />
//           </button>
//         ))}
//       </div>

//       <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
//         {images.map((_, idx) => (
//           <div
//             key={idx}
//             className={`w-2 h-2 rounded-full transition-all ${
//               idx === currentIndex ? "bg-white" : "bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
//   product,
//   onBackToProducts,
// }) => {
//   const router = useRouter();
//   const { sessionId } = useSessionContext();
//   const { showToast } = useToast();

//   // استخدام Hook السلة الجديد
//   const { addToCart, cartData, isLoading: cartLoading, fetchCart } = useCart();

//   // State المحلي
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);

//   const hasDiscount = () => {
//     return (
//       product?.salePrice !== undefined && product?.originalPrice !== undefined
//     );
//   };

//   const getOriginalPrice = () => {
//     return product?.originalPrice ?? 0;
//   };

//   // معالجة الصور
//   const getProductImages = () => {
//     if ((product as any).images) {
//       try {
//         console.log("Raw images data:", (product as any).images);
//         const parsed = JSON.parse((product as any).images);
//         const images = Array.isArray(parsed)
//           ? parsed
//           : [(product as any).images];
//         const baseUrl =
//           process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.12:4000";

//         const imageUrls = images.map((img: string) => {
//           const cleanImg = img.replace(/^\/uploads\//, "");
//           return `${baseUrl}/uploads/${cleanImg}`;
//         });

//         console.log("Generated image URLs:", imageUrls);
//         return imageUrls;
//       } catch (error) {
//         console.error("خطأ في تحليل صور المنتج:", error);
//       }
//     }

//     const mainImage = product.image || "/images/default-product.jpg";
//     return [mainImage, mainImage, mainImage, mainImage];
//   };

//   const productImages = getProductImages();

//   // التحقق من وجود المنتج في السلة
//   const isInCart =
//     cartData?.items?.some((item) => item.product_id === product.id) || false;
//   const cartItem = cartData?.items?.find(
//     (item) => item.product_id === product.id
//   );
//   const cartQuantity = cartItem?.quantity || 0;

//   // دوال التحكم في المعرض
//   const openGallery = (index: number = selectedImage) => {
//     setSelectedImage(index);
//     setIsGalleryOpen(true);
//   };

//   const closeGallery = () => {
//     setIsGalleryOpen(false);
//   };

//   const goToNextImage = () => {
//     setSelectedImage((prev) => (prev + 1) % productImages.length);
//   };

//   const goToPreviousImage = () => {
//     setSelectedImage(
//       (prev) => (prev - 1 + productImages.length) % productImages.length
//     );
//   };

//   const selectImage = (index: number) => {
//     setSelectedImage(index);
//   };

//   // تحديث الكمية
//   const handleQuantityChange = (newQuantity: number) => {
//     const stockValue =
//       typeof product.inStock === "number" ? product.inStock : 20;
//     if (newQuantity >= 1 && newQuantity <= stockValue) {
//       setQuantity(newQuantity);
//     }
//   };

//   // إضافة للسلة
//   const handleAddToCart = async () => {
//     if (!sessionId) {
//       showToast("يرجى تسجيل الدخول أولاً", "error");
//       return;
//     }

//     if (!product.inStock || (product.stock && product.stock <= 0)) {
//       showToast("المنتج غير متوفر", "error");
//       return;
//     }

//     try {
//       setIsAdding(true);
//       console.log("🛒 Adding to cart:", {
//         productId: product.id,
//         quantity: quantity,
//         sessionId,
//       });

//       if (!product.id) {
//         showToast("المنتج غير صالح للإضافة", "error");
//         return;
//       }
//       await addToCart(product.id, quantity);

//       setShowSuccess(true);
//       showToast(
//         `تم إضافة ${quantity} من ${product.nameAr || product.name} للسلة`,
//         "success"
//       );

//       // إخفاء رسالة النجاح بعد 2 ثانية
//       setTimeout(() => setShowSuccess(false), 2000);
//     } catch (error: any) {
//       console.error("خطأ في إضافة المنتج للسلة:", error);

//       // معالجة رسائل الخطأ
//       let errorMessage = "  فشل في إضافة المنتج للسلة بسبب نفاد الكمية ";

//       if (error.message) {
//         if (error.message.includes("المخزون غير كافٍ")) {
//           errorMessage = "الكمية المطلوبة غير متوفرة";
//         } else if (error.message.includes("المنتج غير متوفر")) {
//           errorMessage = "المنتج غير متوفر حالياً";
//         } else {
//           errorMessage = error.message;
//         }
//       }

//       showToast(errorMessage, "error");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // الشراء المباشر
//   const handleBuyNow = async () => {
//     try {
//       if (!isInCart) {
//         await handleAddToCart();
//       }

//       // انتظار قليلاً ثم التوجه للدفع
//       setTimeout(() => {
//         router.push("/checkout");
//       }, 500);
//     } catch (error) {
//       console.error("خطأ في الشراء المباشر:", error);
//       showToast("حدث خطأ أثناء تحضير الطلب", "error");
//     }
//   };

//   const handleBackToProducts = () => {
//     if (onBackToProducts) {
//       onBackToProducts();
//     } else {
//       router.back();
//     }
//   };

//   const renderStars = (rating?: number) => {
//     const ratingValue = rating || 0;
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`w-3 h-3 ${
//           i < Math.floor(ratingValue)
//             ? "text-yellow-400 fill-current"
//             : "text-gray-300"
//         }`}
//       />
//     ));
//   };

//   const handleImageError = (index: number) => {
//     setImageError((prev) => ({ ...prev, [index]: true }));
//   };

//   const getImageSrc = (index: number) => {
//     if (imageError[index]) {
//       return "/images/default-product.jpg";
//     }
//     return productImages[index] || "/images/default-product.jpg";
//   };

//   const isMaxQuantityReached = quantity >= (product.stock || 20);
//   const isMinQuantityReached = quantity <= 1;
//   const isProductInStock =
//     typeof product.inStock === "boolean"
//       ? product.inStock
//       : typeof product.inStock === "number"
//       ? product.inStock > 0
//       : true;

//   return (
//     <div className="min-h-screen mt-10 text-gray-800 font-cairo" dir="rtl">
//       <div className="mx-auto px-6 py-12 max-w-6xl">
//         <div className="rounded-2xl shadow-lg shadow-gray-200/50 p-8">
//           <div className="flex items-center justify-between mb-8">
//             <button
//               onClick={handleBackToProducts}
//               className="text-teal-600 flex items-center gap-2 text-lg hover:text-teal-700 transition-colors duration-200"
//             >
//               <ArrowRight className="w-5 h-5" />
//               العودة للخلف
//             </button>

//             {isInCart && (
//               <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
//                 <Check className="w-4 h-4" />
//                 المنتج في السلة ({cartQuantity} قطعة)
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
//             {/* خط فاصل */}
//             <div
//               className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block"
//               style={{
//                 background:
//                   "linear-gradient(to bottom, transparent 0%, #0d9488 10%, #0d9488 50%, #0d9488 90%, transparent 100%)",
//                 width: "1px",
//                 backgroundSize: "100% 100%",
//               }}
//             />

//             {/* القسم 1: التفاصيل */}
//             <div className="space-y-3 lg:order-1 pr-4">
//               <div className="flex items-start justify-between">
//                 <h1 className="font-bold text-gray-900 text-lg leading-relaxed flex-1">
//                   {product.nameAr || product.name}
//                 </h1>
//               </div>

//               <div className="flex items-center gap-1 text-sm">
//                 <div className="flex">{renderStars(product.rating)}</div>
//                 <span>
//                   ({product.rating || 0}) - {product.reviewCount || 0} تقييم
//                 </span>
//               </div>

//               {/* السعر */}
//               <div className="font-bold text-teal-600 py-2 text-base">
//                 <span>
//                   {product.salePrice
//                     ? product.salePrice
//                     : product.originalPrice || product.price}
//                 </span>
//                 <span className="text-gray-500 mr-1">$</span>
//                 {hasDiscount() &&
//                   product.originalPrice !== undefined &&
//                   product.salePrice !== undefined && (
//                     <>
//                       <span className="text-gray-400 line-through text-sm mr-2">
//                         {getOriginalPrice()} $
//                       </span>
//                       <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">
//                         وفر{" "}
//                         {Math.round(
//                           ((product.originalPrice - product.salePrice) /
//                             (product.originalPrice || 1)) *
//                             100
//                         )}
//                         %
//                       </span>
//                     </>
//                   )}
//               </div>

//               {/* الوصف */}
//               <div className="py-3">
//                 <h3 className="font-semibold text-gray-900 mb-2 text-sm">
//                   وصف المنتج
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed text-sm">
//                   {product.descriptionAr || product.description}
//                 </p>
//               </div>

//               {/* المخزون */}
//               {typeof product.inStock === "number" && product.inStock > 0 && (
//                 <div className="py-2">
//                   <div className="flex items-center gap-2 text-sm">
//                     <span className="text-gray-600">المتوفر في المخزون:</span>
//                     <span
//                       className={`font-medium ${
//                         (product.stock ?? 0) > 10
//                           ? "text-green-600"
//                           : (product.stock ?? 0) > 5
//                           ? "text-yellow-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {product.stock ?? 0} قطعة
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* الكمية */}
//               <div className="py-2">
//                 <div className="flex items-center gap-3">
//                   <label className="text-sm font-medium">الكمية:</label>
//                   <div className="flex items-center border border-gray-300 rounded text-center w-24">
//                     <button
//                       onClick={() => handleQuantityChange(quantity - 1)}
//                       disabled={isMinQuantityReached}
//                       className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
//                     >
//                       <Minus className="w-3 h-3" />
//                     </button>
//                     <span className="px-2 py-1 bg-gray-50 w-8 text-sm">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => handleQuantityChange(quantity + 1)}
//                       disabled={isMaxQuantityReached}
//                       className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
//                     >
//                       <Plus className="w-3 h-3" />
//                     </button>
//                   </div>
//                   {isInCart && (
//                     <span className="text-xs text-teal-600">
//                       (في السلة: {cartQuantity})
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* أزرار */}
//               <div className="space-y-3 py-2">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={isAdding || !product.inStock || cartLoading}
//                   className={`w-full py-3 rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 ${
//                     !isProductInStock
//                       ? "bg-gray-400 cursor-not-allowed text-white"
//                       : showSuccess
//                       ? "bg-green-500 hover:bg-green-600 text-white"
//                       : "bg-teal-600 hover:bg-teal-700 text-white"
//                   } ${
//                     isAdding || cartLoading
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                 >
//                   {!isProductInStock ? (
//                     "غير متوفر"
//                   ) : showSuccess ? (
//                     <>
//                       <Check className="w-4 h-4" />
//                       تمت الإضافة
//                     </>
//                   ) : isAdding || cartLoading ? (
//                     <>
//                       <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
//                       جاري الإضافة
//                     </>
//                   ) : (
//                     <>
//                       <ShoppingCart className="w-4 h-4" />
//                       {isInCart ? "تحديث الكمية" : "إضافة للسلة"}
//                     </>
//                   )}
//                 </button>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={isAdding || !product.inStock || cartLoading}
//                   className="w-full border-2 border-teal-600 text-teal-600 py-2.5 rounded text-sm font-medium hover:bg-teal-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {!isProductInStock
//                     ? "غير متوفر"
//                     : isAdding || cartLoading
//                     ? "جاري التحضير..."
//                     : "اشتري الآن"}
//                 </button>
//               </div>
//             </div>

//             {/* القسم 2: الصور */}
//             <div className="space-y-6 lg:order-2 pl-4">
//               {/* الصورة الرئيسية */}
//               <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
//                 <div
//                   className="aspect-square relative bg-gray-100 w-full cursor-pointer group"
//                   style={{ minHeight: "250px", maxHeight: "250px" }}
//                   onClick={() => openGallery(selectedImage)}
//                 >
//                   <img
//                     src={getImageSrc(selectedImage)}
//                     alt={product.nameAr || product.name}
//                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                     onError={() => handleImageError(selectedImage)}
//                   />

//                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                     <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   </div>

//                   {/* الشارات */}
//                   {product.salePrice && product.originalPrice && (
//                     <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
//                       -
//                       {Math.round(
//                         ((product.originalPrice - product.salePrice) /
//                           product.originalPrice) *
//                           100
//                       )}
//                       %
//                     </div>
//                   )}

//                   {product.isNew && !product.salePrice && (
//                     <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded">
//                       جديد
//                     </div>
//                   )}

//                   {!product.inStock && (
//                     <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                       <span className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium">
//                         نفد المخزون
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* الصور المصغرة - 8 محلات دائمة */}
//               <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//                 <div className="grid grid-cols-4 gap-2">
//                   {Array.from({ length: 8 }).map((_, idx) => {
//                     const hasImage = idx < productImages.length;
//                     const isSelected = selectedImage === idx;

//                     if (!hasImage) {
//                       return (
//                         <div
//                           key={`placeholder-${idx}`}
//                           className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-default"
//                         >
//                           <div className="flex flex-col items-center text-gray-300">
//                             <svg
//                               className="w-6 h-6 mb-1"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                               />
//                             </svg>
//                             <span className="text-xs">إضافة صورة</span>
//                           </div>
//                         </div>
//                       );
//                     }

//                     return (
//                       <button
//                         key={idx}
//                         onClick={() => {
//                           setSelectedImage(idx);
//                           openGallery(idx);
//                         }}
//                         className={`aspect-square rounded-lg overflow-hidden border-2 hover:border-teal-400 transition-all duration-200 transform hover:scale-105 ${
//                           isSelected
//                             ? "border-teal-500 ring-2 ring-teal-200"
//                             : "border-gray-200"
//                         }`}
//                       >
//                         <img
//                           src={getImageSrc(idx)}
//                           alt={`صورة ${idx + 1}`}
//                           className="w-full h-full object-cover"
//                           onError={() => handleImageError(idx)}
//                         />
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* معلومات إضافية */}
//               <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">المتجر:</span>
//                   <span className="font-medium">
//                     {product.brandAr || product.brand || "غير محدد"}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">التصنيف:</span>
//                   <span className="font-medium">
//                     {product.categoryAr || product.category}
//                   </span>
//                 </div>
//                 {product.sales && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">عدد المبيعات:</span>
//                     <span className="font-medium">{product.sales}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">عدد التقييمات:</span>
//                   <span className="font-medium">
//                     {product.reviewCount || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* معرض الصور */}
//       <ImageGallery
//         images={productImages}
//         currentIndex={selectedImage}
//         isOpen={isGalleryOpen}
//         onClose={closeGallery}
//         onNext={goToNextImage}
//         onPrevious={goToPreviousImage}
//         onSelectImage={selectImage}
//         productName={product.nameAr || product.name}
//       />
//     </div>
//   );
// };

// export default ProductDetailsPage;
