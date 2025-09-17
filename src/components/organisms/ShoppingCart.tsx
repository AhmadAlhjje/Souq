// src/components/organisms/ShoppingCart.tsx
"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import { QuantityCounter } from "../molecules/QuantityCounter";
import { CartItem } from "@/types/product"; // ✅ تم استيراده من product.ts

interface ShoppingCartComponentProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const ShoppingCartComponent: React.FC<ShoppingCartComponentProps> = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  
  // حساب السعر باستخدام salePrice إن وُجد، وإلا price
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = item.salePrice !== undefined ? item.salePrice : item.price;
    return sum + (itemPrice * item.cartQuantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <Card className="p-6 text-center">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">السلة فارغة</p>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 text-right">
      <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center justify-end">
        <span>سلة التسوق ({totalItems} منتج)</span>
        <ShoppingCart className="w-5 h-5 mr-2" />
      </h3>
      
      <div className="space-y-4 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FAFBFC' }}>
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveItem(item.id!)}
                text="×"
              />
              <QuantityCounter
                quantity={item.cartQuantity}
                onIncrease={() => onUpdateQuantity(item.id!, item.cartQuantity + 1)}
                onDecrease={() => onUpdateQuantity(item.id!, item.cartQuantity - 1)}
                min={1}
              />
            </div>
            <div className="flex-1 text-right">
              <h4 className="font-medium text-gray-900">{item.nameAr || item.name}</h4>
              <p className="text-sm text-gray-600">
                {(item.salePrice || item.price).toFixed(2)} $
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold text-teal-800">
          <span>{totalPrice.toFixed(2)} $</span>
          <span>المجموع:</span>
        </div>
        <Button 
          className="w-full mt-4" 
          size="lg"
          text="إتمام الشراء"
        />
      </div>
    </Card>
  );
};

export default ShoppingCartComponent;