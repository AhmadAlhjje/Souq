// utils/productDataConverter.ts
import { ProductUpdateData } from "@/api/products";
import { Product } from "../types/product";

// تحويل بيانات المنتج من تنسيق الواجهة إلى تنسيق API
export const convertProductToApiFormat = (product: Product & { newImages?: File[] }): ProductUpdateData => {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    stock_quantity: typeof product.inStock === "boolean" ? (product.inStock ? 1 : 0) : product.inStock,
    images: product.newImages || undefined,
  };
};

// تحويل بيانات المنتج من تنسيق API إلى تنسيق الواجهة
export const convertApiToProductFormat = (apiData: any): Product => {
  return {
    ...apiData,
    inStock: apiData.stock_quantity, // هنا نتركها كما هي، يمكن أن تكون number أو boolean حسب تعريف Product
  };
};

// مقارنة المنتجات وإرجاع البيانات المختلفة فقط
export const getChangedProductData = (
  original: Product,
  updated: Product & { newImages?: File[] }
): ProductUpdateData => {
  const changes: ProductUpdateData = {};

  if (original.name !== updated.name) {
    changes.name = updated.name;
  }

  if (original.description !== updated.description) {
    changes.description = updated.description;
  }

  if (original.price !== updated.price) {
    changes.price = updated.price;
  }

  if (original.inStock !== updated.inStock) {
    changes.stock_quantity = typeof updated.inStock === "boolean" ? (updated.inStock ? 1 : 0) : updated.inStock;
  }

  if (updated.newImages && updated.newImages.length > 0) {
    changes.images = updated.newImages;
  }

  return changes;
};

// دالة مساعدة للتحقق من وجود تغييرات
export const hasProductChanges = (
  original: Product,
  updated: Product & { newImages?: File[] }
): boolean => {
  const changes = getChangedProductData(original, updated);
  return Object.keys(changes).length > 0;
};
