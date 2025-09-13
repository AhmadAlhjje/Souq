import React from 'react';
import { TrendingUp, Package, Tag, Percent } from 'lucide-react';
import Badge from '../atoms/Badge';
import ProductCard from './ProductCard';
import { Product } from '@/api/storeProduct';
import OffersSlider from './OffersSlider';

interface ProductsSectionProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  storeId?: number;
  storeName?: string;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  products, 
  onViewDetails, 
  storeId, 
  storeName 
}) => {
  console.log('📋 ProductsSection استلم:', products.length, 'منتج');
  console.log('🏪 معرف المتجر:', storeId);
  console.log('🏪 اسم المتجر:', storeName);
  console.log('🛍️ أول منتج:', products[0]);
  
  const availableProducts = products.filter(p => p.inStock && p.stock > 0);
  const discountedProducts = products.filter(p => p.hasDiscount === true);
  const newProducts = products.filter(p => p.isNew);
  
  const averageDiscount = discountedProducts.length > 0 
    ? Math.round(discountedProducts.reduce((sum, p) => sum + (p.discountPercentage || 0), 0) / discountedProducts.length)
    : 0;

  return (
    <div className="lg:col-span-3">
      <div 
        className="p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: '#CFF7EE' }}
      > 
        {/* عرض العروض الخاصة بالمتجر إذا كان storeId موجود */}
        {storeId && (
          <OffersSlider 
            storeId={storeId} 
            storeName={storeName}
          />
        )}
        
        {/* العنوان والإحصائيات */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span>
                {storeId && storeName 
                  ? `منتجات ${storeName}` 
                  : "جميع المنتجات"
                }
              </span>
            </h2>
            
            {/* مجموعة الشارات */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="defaultNew">
                <Package className="w-4 h-4 ml-1" />
                {products.length} منتج
              </Badge>
              
              {availableProducts.length > 0 && (
                <Badge variant="success">
                  {availableProducts.length} متوفر
                </Badge>
              )}
              
              {discountedProducts.length > 0 && (
                <Badge variant="danger">
                  <Tag className="w-4 h-4 ml-1" />
                  {discountedProducts.length} مخفض
                </Badge>
              )}
              
              {averageDiscount > 0 && (
                <Badge variant="warning">
                  <Percent className="w-4 h-4 ml-1" />
                  متوسط الخصم {averageDiscount}%
                </Badge>
              )}
              
              {newProducts.length > 0 && (
                <Badge variant="info">
                  {newProducts.length} جديد
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/** البحث */}

        {/* عرض المنتجات */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-gray-500">
              {storeId && storeName 
                ? `لم يتم العثور على أي منتجات في ${storeName} حالياً`
                : "لم يتم العثور على أي منتجات في هذا المتجر حالياً"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;