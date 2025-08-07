// src/components/molecules/Section.tsx

'use client';

import ProductCard from '../atoms/ProductCard';
import { Product, Feature } from '../../lib/data/homePageData';

interface SectionProps {
  products: Product[];
  features: Feature[];
  heading: string;
  body: string;
}

export default function Section({ products, features, heading, body }: SectionProps) {
  return (
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 py-10 px-4">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* المنتجات */}
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}

        {/* القسم النصي */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{heading}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{body}</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-0.5 flex-shrink-0">{feature.icon}</span>
                <span className="text-gray-600 text-sm">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}