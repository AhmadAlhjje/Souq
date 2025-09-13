'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductGallery from '../organisms/ProductGallery';
import ProductDetails from '../organisms/ProductDetails';
import ImageGalleryModal from '../organisms/ImageGalleryModal';
import Button from '../atoms/Button';
import { Product } from '@/types/product';

interface ProductDetailsPageTemplateProps {
  product: Product;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  onBackToProducts?: () => void;
  loading?: boolean;
  className?: string;
}

const ProductDetailsPageTemplate: React.FC<ProductDetailsPageTemplateProps> = ({
  product,
  onBuyNow,
  onBackToProducts,
  loading = false,
  className = '',
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // 🔧 إصلاح معالجة الصور - تجنب إضافة /uploads/ مرتين
  const productImages = useMemo(() => {
    console.log('🖼️ معالجة صور المنتج...');
    console.log('📦 product.images:', product.images);
    console.log('🏷️ product.image:', product.image);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://192.168.1.127:4000';
    
    // التحقق من وجود مصفوفة الصور أولاً
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      console.log('✅ استخدام مصفوفة الصور');
      
      const processedImages = product.images.map((img, index) => {
        console.log(`🔍 معالجة الصورة ${index + 1}:`, img);
        
        // إذا كانت الصورة تحتوي على رابط كامل، استخدمها كما هي
        if (img.startsWith('http://') || img.startsWith('https://')) {
          console.log(`🌐 رابط كامل: ${img}`);
          return img;
        }
        
        // إذا كانت تحتوي على /uploads/ في البداية، أزلها لتجنب التكرار
        const cleanImg = img.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
        const fullUrl = `${baseUrl}/uploads/${cleanImg}`;
        console.log(`🔗 رابط مُنشأ: ${fullUrl}`);
        
        return fullUrl;
      });
      
      console.log('🎯 الصور النهائية:', processedImages);
      return processedImages;
    }

    // إذا لم توجد مصفوفة، استخدم الصورة الواحدة
    if (product.image) {
      console.log('📸 استخدام الصورة الواحدة');
      
      let imageUrl;
      
      // إذا كانت تحتوي على رابط كامل
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        imageUrl = product.image;
        console.log(`🌐 رابط كامل: ${imageUrl}`);
      } else {
        // إزالة /uploads/ إذا كانت موجودة وإضافتها مرة واحدة
        const cleanImg = product.image.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
        imageUrl = `${baseUrl}/uploads/${cleanImg}`;
        console.log(`🔗 رابط مُنشأ: ${imageUrl}`);
      }
      
      return [imageUrl];
    }

    // الصورة الافتراضية
    console.log('🚫 لا توجد صور، استخدام الافتراضية');
    return ['/images/default-product.jpg'];
  }, [product.images, product.image]);

  const openGallery = useCallback(
    (index: number = selectedImageIndex) => {
      console.log('🖼️ فتح معرض الصور على الصورة:', index);
      setSelectedImageIndex(index);
      setIsGalleryOpen(true);
    },
    [selectedImageIndex]
  );

  const closeGallery = useCallback(() => {
    console.log('❌ إغلاق معرض الصور');
    setIsGalleryOpen(false);
  }, []);

  const goToNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      const newIndex = (prev + 1) % productImages.length;
      console.log('➡️ الانتقال للصورة التالية:', newIndex);
      return newIndex;
    });
  }, [productImages.length]);

  const goToPreviousImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      const newIndex = (prev - 1 + productImages.length) % productImages.length;
      console.log('⬅️ الانتقال للصورة السابقة:', newIndex);
      return newIndex;
    });
  }, [productImages.length]);

  const selectImage = useCallback((index: number) => {
    console.log('🎯 اختيار الصورة:', index);
    setSelectedImageIndex(index);
  }, []);

  const discountPercentage = useMemo(() => {
    if (product.salePrice && product.originalPrice && product.salePrice < product.originalPrice) {
      const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
      console.log('💰 نسبة الخصم:', discount);
      return discount;
    }
    return 0;
  }, [product.salePrice, product.originalPrice]);

  const handleImageError = useCallback((index: number) => {
    console.error(`❌ فشل في تحميل الصورة ${index + 1}:`, productImages[index]);
  }, [productImages]);

  // طباعة معلومات التشخيص
  console.log('🖥️ عرض ProductDetailsPageTemplate');
  console.log('🏪 اسم المنتج:', product.name);
  console.log('🖼️ عدد الصور:', productImages.length);
  console.log('📋 قائمة الصور:', productImages);

  return (
    <div className={`min-h-screen mt-10 text-gray-800 font-cairo ${className}`} dir="rtl">
      <div className="mx-auto px-6 py-12 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          {/* زر العودة */}
          <div className="flex items-center justify-start mb-8">
            {onBackToProducts && (
              <Button
                onClick={onBackToProducts}
                variant="ghost"
                size="md"
                startIcon={<ArrowRight className="w-5 h-5" />}
                text="العودة للخلف"
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
            {/* خط فاصل */}
            <div
              className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, #0d9488 10%, #0d9488 50%, #0d9488 90%, transparent 100%)',
                width: '1px',
                backgroundSize: '100% 100%',
              }}
            />

            {/* القسم 1: التفاصيل */}
            <div className="lg:order-1 pr-4">
              <ProductDetails product={product} onBuyNow={onBuyNow} loading={loading} />
            </div>

            {/* القسم 2: الصور */}
            <div className="lg:order-2 pl-4">
              <ProductGallery
                images={productImages}
                productName={product.nameAr || product.name}
                selectedIndex={selectedImageIndex}
                onImageClick={openGallery}
                showBadge={true}
                discountPercentage={discountPercentage}
                inStock={product.inStock}
                isNew={product.isNew}
                aspectRatio="square"
                maxThumbnails={8}
                className="space-y-6"
                mainImageClassName="min-h-[300px] max-h-[400px] bg-gray-50 border border-gray-200 rounded-lg"
              />

            
            </div>
          </div>
        </div>
      </div>

      {/* معرض الصور */}
      <ImageGalleryModal
        images={productImages}
        currentIndex={selectedImageIndex}
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        onNext={goToNextImage}
        onPrevious={goToPreviousImage}
        onSelectImage={selectImage}
        productName={product.nameAr || product.name}
      />
    </div>
  );
};

export default ProductDetailsPageTemplate;