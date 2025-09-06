// utils/productDataConverter.ts
import { ProductUpdateData } from "@/api/products";
import { Product } from "../types/product";

// تحويل بيانات المنتج من تنسيق الواجهة إلى تنسيق API
export const convertProductToApiFormat = (product: Product & { newImages?: File[] }): ProductUpdateData => {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    stock_quantity: product.stock, // تحويل من stock إلى stock_quantity
    images: product.newImages || undefined, // استخدام newImages بدلاً من images
  };
};

// تحويل بيانات المنتج من تنسيق API إلى تنسيق الواجهة
export const convertApiToProductFormat = (apiData: any): Product => {
  return {
    ...apiData,
    stock: apiData.stock_quantity, // تحويل من stock_quantity إلى stock
  };
};

// مقارنة المنتجات وإرجاع البيانات المختلفة فقط
export const getChangedProductData = (
  original: Product,
  updated: Product & { newImages?: File[] }
): ProductUpdateData => {
  const changes: ProductUpdateData = {};

  // التحقق من التغييرات في البيانات النصية
  if (original.name !== updated.name) {
    changes.name = updated.name;
  }

  if (original.description !== updated.description) {
    changes.description = updated.description;
  }

  if (original.price !== updated.price) {
    changes.price = updated.price;
  }

  if (original.stock !== updated.stock) {
    changes.stock_quantity = updated.stock; // تحويل إلى stock_quantity
  }

  // إضافة الصور الجديدة إذا كانت موجودة
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