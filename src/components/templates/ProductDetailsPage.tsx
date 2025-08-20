// components/templates/ProductDetailsPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Plus, Minus, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart, useCartNotifications } from '@/contexts/CartContext';

interface ProductDetailsPageProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBackToProducts?: () => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onAddToCart,
  onBackToProducts,
}) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { 
    addToCart, 
    isItemInCart, 
    getItemQuantity, 
    openCart,
    updateQuantity 
  } = useCart();
  const { showAddToCartSuccess } = useCartNotifications();

  const productImages = [
    product.image, 
    product.image, 
    product.image, 
    product.image, 
    product.image, 
    product.image, 
    product.image, 
    product.image
  ];

  // تحديث الكمية عند تغيير المنتج أو كمية السلة
  useEffect(() => {
    const cartQuantity = getItemQuantity(product.id);
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [product.id, getItemQuantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
      
      // إذا كان المنتج في السلة، حدث الكمية مباشرة
      if (isItemInCart(product.id)) {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      
      // استخدام onAddToCart إذا تم تمريرها، وإلا استخدم الـ context
      if (onAddToCart) {
        onAddToCart(product, quantity);
      } else {
        if (isItemInCart(product.id)) {
          updateQuantity(product.id, quantity);
          showAddToCartSuccess(product.name, quantity);
        } else {
          addToCart(product, quantity);
          showAddToCartSuccess(product.name, quantity);
        }
      }
      
      // إظهار أيقونة النجاح
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('خطأ في إضافة المنتج للسلة:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setIsAdding(true);
      
      // إضافة المنتج للسلة إذا لم يكن موجوداً
      if (!isItemInCart(product.id)) {
        addToCart(product, quantity);
      } else {
        // أو تحديث الكمية إذا كان موجوداً
        updateQuantity(product.id, quantity);
      }
      
      // فتح السلة للشراء المباشر
      setTimeout(() => openCart(), 500);
      
    } catch (error) {
      console.error('خطأ في الشراء المباشر:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // دالة العودة للمنتجات - استخدام onBackToProducts إذا تم تمريرها
  const handleBackToProducts = () => {
    if (onBackToProducts) {
      onBackToProducts();
    } else {
      router.push('/products');
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));

  // تحديد حالة المنتج في السلة
  const productInCart = isItemInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // تحديد ما إذا كان الزر معطل
  const isMaxQuantityReached = quantity >= 20 || Boolean(product.stock && quantity >= product.stock);
  const isMinQuantityReached = quantity <= 1;

  return (
    <div className="min-h-screen mt-10 text-gray-800 font-cairo" dir="rtl">
      <div className="mx-auto px-6 py-12 max-w-6xl">
        {/* الحاوية الرئيسية */}
        <div className="rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToProducts}
              className="text-teal-600 flex items-center gap-2 text-lg hover:text-teal-700 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
              عودة للمنتجات
            </button>

            {/* مؤشر المنتج في السلة */}
            {productInCart && (
              <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                المنتج في السلة ({cartQuantity} قطعة)
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
            {/* خط فاصل أخضر متدرج بين الأقسام */}
            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block" 
                 style={{
                   background: 'linear-gradient(to bottom, transparent 0%, #0d9488 10%, #0d9488 50%, #0d9488 90%, transparent 100%)',
                   width: '1px',
                   backgroundSize: '100% 100%'
                 }}></div>

            {/* القسم 1: التفاصيل */}
            <div className="space-y-3 lg:order-1 pr-4">
              <div className="flex items-start justify-between">
                <h1 className="font-bold text-gray-900 text-lg leading-relaxed flex-1">{product.nameAr || product.name}</h1>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <div className="flex">{renderStars(product.rating)}</div>
                <span>({product.rating})</span>
              </div>

              {/* السعر */}
              <div className="font-bold text-teal-600 py-2 text-base">
                <span>{product.salePrice ? product.salePrice : (product.originalPrice || product.price)}</span>
                <span className="text-gray-500 mr-1">ر.س</span>
                {product.salePrice && product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-sm mr-2">
                      {product.originalPrice} ر.س
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">
                      وفر {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              
              {/* وصف مفصل */}
              <div className="py-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">وصف المنتج</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.descriptionAr || product.description || 
                    `منتج عالي الجودة مصنوع من أفضل المواد المتاحة في السوق، مصمم خصيصاً ليلبي احتياجاتك اليومية بكفاءة عالية. 
                    يتميز هذا المنتج بالمتانة والأناقة في التصميم، مع الحرص على توفير تجربة استخدام مريحة وآمنة. 
                    يأتي مع ضمان شامل لمدة سنة كاملة ضد عيوب الصناعة، بالإضافة إلى خدمة عملاء متميزة تعمل على مدار الساعة لضمان رضاكم التام.`
                  }
                </p>
              </div>
              
              {/* المخزون */}
              {product.stock && product.stock > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">المتوفر في المخزون:</span>
                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.stock} قطعة
                    </span>
                  </div>
                </div>
              )}
              
              {/* الكمية */}
              <div className="py-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">الكمية:</label>
                  <div className="flex items-center border border-gray-300 rounded text-center w-24">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={isMinQuantityReached}
                      className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 bg-gray-50 w-8 text-sm">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)} 
                      disabled={isMaxQuantityReached}
                      className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {productInCart && (
                    <span className="text-xs text-teal-600">
                      (في السلة: {cartQuantity})
                    </span>
                  )}
                </div>
              </div>

              {/* أزرار */}
              <div className="space-y-3 py-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !product.inStock}
                  className={`w-full py-3 rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200 ${
                    !product.inStock
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : showSuccess 
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                  } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {!product.inStock ? (
                    'غير متوفر'
                  ) : showSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      تمت الإضافة
                    </>
                  ) : isAdding ? (
                    <>
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإضافة
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      {productInCart ? 'تحديث الكمية' : 'إضافة للسلة'}
                    </>
                  )}
                </button>

                <button 
                  onClick={handleBuyNow}
                  disabled={isAdding || !product.inStock}
                  className="w-full border-2 border-teal-600 text-teal-600 py-2.5 rounded text-sm font-medium hover:bg-teal-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!product.inStock ? 'غير متوفر' : isAdding ? 'جاري التحضير...' : 'اشتري الآن'}
                </button>
              </div>
            </div>

            {/* القسم 2: الصور */}
            <div className="space-y-6 lg:order-2 pl-4">
              {/* الصورة الرئيسية */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
                <div className="aspect-square relative bg-gray-100 w-full" style={{ minHeight: '250px', maxHeight: '250px' }}>
                  <Image
                    src={productImages[selectedImage]}
                    alt={product.nameAr || product.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                  {/* شارة الخصم */}
                  {product.salePrice && product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
                      -{Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {/* شارة جديد */}
                  {product.isNew && !product.salePrice && (
                    <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded">
                      جديد
                    </div>
                  )}
                  {/* شارة نفاد المخزون */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded text-sm font-medium">
                        نفد المخزون
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* الصور المصغرة */}
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-full h-16 rounded-lg overflow-hidden border-2 hover:border-teal-400 transition-colors duration-200 ${
                      selectedImage === idx ? 'border-teal-500' : 'border-gray-200'
                    }`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* معلومات إضافية */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">العلامة التجارية:</span>
                  <span className="font-medium">{product.brandAr || product.brand || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التصنيف:</span>
                  <span className="font-medium">{product.categoryAr || product.category}</span>
                </div>
                {product.sales && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">عدد المبيعات:</span>
                    <span className="font-medium">{product.sales}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;