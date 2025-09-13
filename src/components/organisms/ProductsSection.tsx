// components/organisms/ProductsSection.tsx
import React from "react";
import { TrendingUp } from "lucide-react";
import Badge from "../atoms/Badge";
import ProductCard from "./ProductCard"; // تأكد من المسار الصحيح
import { Product } from "@/types/product";

interface ProductsSectionProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onViewDetails,
}) => {
  return (
    <div className="lg:col-span-3">
      {/* خلفية القسم الكاملة */}
      <div
        className="p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: "#CFF7EE" }}
      >
        {/* العنوان والشارة */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold text-center text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-teal-600" />
              <span>جميع المنتجات</span>
            </h2>
            <Badge variant="defaultNew">لديك {products.length} منتج متاح</Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {products
            .filter(
              (product): product is Product & { id: number } =>
                product.id !== undefined
            )
            .map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
