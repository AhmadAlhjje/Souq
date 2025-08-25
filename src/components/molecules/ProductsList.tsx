import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types/orders';

interface ProductsListProps {
  products: Product[];
  isDark: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, isDark }) => {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <ShoppingBag size={18} />
        المنتجات
      </h3>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              isDark 
                ? 'border-gray-700 bg-gray-700/30' 
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg ${
                isDark ? 'bg-gray-600' : 'bg-white'
              }`}>
                {product.image}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  الكمية: {product.quantity.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {product.totalPrice.toLocaleString()} ر.س
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.price.toLocaleString()} ر.س / قطعة
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;