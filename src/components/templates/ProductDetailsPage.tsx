// components/templates/ProductDetailsPage.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductDetailsPageProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBackToProducts: () => void;
}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onAddToCart,
  onBackToProducts,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = [product.image, product.image, product.image, product.image, product.image, product.image, product.image, product.image];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 20) setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));

  return (
    <div className="min-h-screen mt-10 text-gray-800 font-cairo " dir="rtl">
      <div className="mx-auto px-6 py-12 max-w-6xl">
       

        {/* الحاوية الرئيسية مع الشادو الأخف والأعرض */}
        <div className="rounded-2xl shadow-lg shadow-gray-200/50 p-8">
         <button
          onClick={onBackToProducts}
          className="text-teal-600 mb-8 flex items-center gap-1 text-lg hover:text-teal-700 transition-colors duration-200"
        >
          ← عودة
        </button>
          <div className="grid grid-cols-2 gap-16 items-start relative">
               {/* خط فاصل أخضر متدرج بين الأقسام */}
            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2" 
                 style={{
                   background: 'linear-gradient(to bottom, transparent 0%, #0d9488 10%, #0d9488 50%, #0d9488 90%, transparent 100%)',
                   width: '1px',
                   backgroundSize: '100% 100%'
                 }}></div>
            {/* القسم 1: التفاصيل - على اليسار في الشاشات الكبيرة */}
            <div className="space-y-3 lg:order-1 pr-4">
              <h1 className="font-bold text-gray-900 text-lg leading-relaxed">{product.name}</h1>

              <div className="flex items-center gap-1 text-sm">
                <div className="flex">{renderStars(product.rating)}</div>
                <span>({product.rating})</span>
              </div>

              {/* السعر */}
              <div className="font-bold text-teal-600 py-2 text-base">
                <span>{product.salePrice ? product.salePrice : (product.originalPrice || product.price)}</span>
                <span className="text-gray-500 mr-1">ر.س</span>
                {product.salePrice && product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm mr-2">
                    {product.originalPrice} ر.س
                  </span>
                )}
              </div>
              
              {/* وصف مفصل */}
              <div className="py-3">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">وصف المنتج</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  منتج عالي الجودة مصنوع من أفضل المواد المتاحة في السوق، مصمم خصيصاً ليلبي احتياجاتك اليومية بكفاءة عالية. 
                  يتميز هذا المنتج بالمتانة والأناقة في التصميم، مع الحرص على توفير تجربة استخدام مريحة وآمنة. 
                  يأتي مع ضمان شامل لمدة سنة كاملة ضد عيوب الصناعة، بالإضافة إلى خدمة عملاء متميزة تعمل على مدار الساعة لضمان رضاكم التام. 
                  هذا المنتج مناسب للاستخدام المنزلي والمهني على حد سواء، ويوفر قيمة ممتازة مقابل السعر المدفوع.
                </p>
              </div>
              
              {/* الكمية */}
              <div className="py-2">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">الكمية:</label>
                  <div className="flex items-center border border-gray-300 rounded text-center w-24">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-1 disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 py-1 bg-gray-50 w-8 text-sm">{quantity}</span>
                    <button onClick={() => handleQuantityChange(quantity + 1)} className="p-1 hover:bg-gray-100 transition-colors duration-200">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* أزرار */}
              <div className="flex gap-3 py-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-teal-600 text-white py-3 rounded flex items-center justify-center gap-2 text-sm font-medium hover:bg-teal-700 transition-colors duration-200"
                >
                  <ShoppingCart className="w-4 h-4" />
                  إضافة للسلة
                </button>
                <button className="flex-1 border border-teal-600 text-teal-600 py-2.5 rounded text-sm font-medium hover:bg-teal-50 transition-colors duration-200">
                  اشتري الآن
                </button>
              </div>
            </div>

            {/* القسم 2: الصور - على اليمين في الشاشات الكبيرة */}
            <div className="mt-10 space-y-6 lg:order-2 pl-4">
              {/* الصورة الرئيسية */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg w-full">
                <div className="aspect-square relative bg-gray-100 w-full" style={{ minHeight: '250px', maxHeight: '250px' }}>
                  <Image
                    src={productImages[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                  {/* إصلاح حساب نسبة الخصم */}
                  {product.salePrice && product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded">
                      -{Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  {product.isNew && !product.salePrice && (
                    <div className="absolute top-2 right-2 bg-green-700 text-white text-[10px] px-2 py-0.5 rounded">
                      جديد
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;