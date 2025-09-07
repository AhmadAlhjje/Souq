// components/templates/ProductDetailsPageTemplate.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductGallery from '../organisms/ProductGallery';
import ProductDetails from '../organisms/ProductDetails';
import ImageGalleryModal from '../organisms/ImageGalleryModal';
import Button from '../atoms/Button';

interface Product {
  id: string | number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  brandAr?: string;
  category?: string;
  categoryAr?: string;
  stock?: number;
  sales?: number;
  inStock?: boolean;
  isNew?: boolean;
  image?: string;
  images?: string;
}

interface ProductDetailsPageTemplateProps {
  product: Product;
  onAddToCart?: (productId: string | number, quantity: number) => void;
  onBuyNow?: (productId: string | number, quantity: number) => void;
  onBackToProducts?: () => void;
  isItemInCart?: boolean;
  cartQuantity?: number;
  onQuantityUpdate?: (productId: string | number, quantity: number) => void;
  loading?: boolean;
  className?: string;
}

const ProductDetailsPageTemplate: React.FC<ProductDetailsPageTemplateProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onBackToProducts,
  isItemInCart = false,
  cartQuantity = 0,
  onQuantityUpdate,
  loading = false,
  className = ''
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const getProductImages = useCallback(() => {
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images);
        const images = Array.isArray(parsed) ? parsed : [product.images];
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.74.8:4000";
        
        return images.map((img: string) => {
          const cleanImg = img.replace(/^\/uploads\//, "");
          return `${baseUrl}/uploads/${cleanImg}`;
        });
      } catch (error) {
        console.error("خطأ في تحليل صور المنتج:", error);
      }
    }

    const mainImage = product.image || "/images/default-product.jpg";
    return [mainImage];
  }, [product.images, product.image]);

  const productImages = getProductImages();

  const openGallery = useCallback((index: number = selectedImageIndex) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  }, [selectedImageIndex]);

  const closeGallery = useCallback(() => {
    setIsGalleryOpen(false);
  }, []);

  const goToNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  }, [productImages.length]);

  const goToPreviousImage = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  }, [productImages.length]);

  const selectImage = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const getDiscountPercentage = () => {
    if (product.salePrice && product.originalPrice && product.salePrice < product.originalPrice) {
      return Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div className={`min-h-screen mt-10 text-gray-800 font-cairo ${className}`} dir="rtl">
      <div className="mx-auto px-6 py-12 max-w-6xl">
        <div className="rounded-2xl shadow-lg shadow-gray-200/50 p-8">
          {/* زر العودة */}
          <div className="flex items-center justify-start mb-8">
            {onBackToProducts && (
              <Button
                onClick={onBackToProducts}
                variant="ghost"
                size="md"
                startIcon={<ArrowRight className="w-5 h-5" />}
                text="العودة للخلف"
                className="text-teal-600 hover:text-teal-700"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
            {/* خط فاصل */}
            <div
              className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 hidden lg:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, #0d9488 10%, #0d9488 50%, #0d9488 90%, transparent 100%)",
                width: "1px",
                backgroundSize: "100% 100%",
              }}
            />

            {/* القسم 1: التفاصيل */}
            <div className="lg:order-1 pr-4">
              <ProductDetails
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                isItemInCart={isItemInCart}
                cartQuantity={cartQuantity}
                onQuantityUpdate={onQuantityUpdate}
                loading={loading}
              />
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
                maxThumbnails={12}
                className="space-y-6"
                mainImageClassName="min-h-[250px] max-h-[250px]"
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