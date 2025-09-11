// app/cart/page.tsx
"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import CompactCartPage from "@/components/templates/AtomicCartPage"; // تصحيح المسار

// تحويل عناصر السلة من CartContext إلى تنسيق CompactCartPage
const transformCartItems = (cartItems: any[]) => {
  return cartItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "منتج عالي الجودة",
    price: item.salePrice || item.originalPrice || item.price || 0,
    originalPrice: item.originalPrice,
    quantity: item.cartQuantity,
    image: item.image,
    total:
      (item.salePrice || item.originalPrice || item.price || 0) *
      item.cartQuantity,
    inStock: item.inStock !== false,
    discount:
      item.salePrice && item.originalPrice
        ? Math.round(
            ((item.originalPrice - item.salePrice) / item.originalPrice) * 100
          )
        : undefined,
  }));
};

const CartPage: React.FC = () => {
  const router = useRouter();
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // تحويل عناصر السلة
  const cartItems = transformCartItems(items);

  // حساب المجاميع
  const subtotal = totalPrice;
  const deliveryFee = subtotal > 200 ? 0 : 15; // شحن مجاني للطلبات أكثر من 200 $
  const tax = subtotal * 0.15; // ضريبة القيمة المضافة 15%
  const total = subtotal + deliveryFee + tax;

  // طباعة للتشخيص
  console.log("Cart items from context:", items);
  console.log("Transformed cart items:", cartItems);
  console.log("Total price:", totalPrice);

  // معالجات الأحداث
  const handleSelectItem = (itemId: number, selected: boolean) => {
    const newSelected = new Set(selectedItems);
    if (selected) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size > 0) {
      const confirmed = window.confirm(
        `هل أنت متأكد من حذف ${selectedItems.size} منتج؟`
      );
      if (confirmed) {
        selectedItems.forEach((itemId) => {
          removeFromCart(itemId);
        });
        setSelectedItems(new Set());
      }
    }
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      const confirmed = window.confirm("هل تريد حذف هذا المنتج من السلة؟");
      if (confirmed) {
        removeFromCart(itemId);
      }
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (confirmed) {
      removeFromCart(itemId);
      // إزالة العنصر من المحددات إذا كان محدداً
      const newSelected = new Set(selectedItems);
      newSelected.delete(itemId);
      setSelectedItems(newSelected);
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // محاكاة معالجة
    setTimeout(() => {
      setIsLoading(false);
      router.push("/checkout");
    }, 1500);
  };

  const handleBackToShopping = () => {
    router.push("/products");
  };

  // إذا كانت السلة فارغة
  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen items-center flex justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 py-8"
        dir="rtl"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              سلة التسوق فارغة
            </h2>
            <p className="text-gray-600 mb-6">
              أضف بعض المنتجات إلى سلتك لتبدأ التسوق
            </p>
            <button
              onClick={handleBackToShopping}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowRight className="w-4 h-4" />
              تصفح المنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompactCartPage
      items={cartItems}
      selectedItems={selectedItems}
      subtotal={subtotal}
      deliveryFee={deliveryFee}
      tax={tax}
      total={total}
      isLoading={isLoading}
      onSelectItem={handleSelectItem}
      onSelectAll={handleSelectAll}
      onDeleteSelected={handleDeleteSelected}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
      onBackToShopping={handleBackToShopping}
    />
  );
};

export default CartPage;
