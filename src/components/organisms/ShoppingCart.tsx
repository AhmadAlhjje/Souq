// components/organisms/ShoppingCart.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { QuantityCounter } from '../molecules/QuantityCounter';
import { CartItem } from '@/types/product';

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
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // إصلاح: التعامل مع إمكانية عدم وجود originalPrice وإضافة فحص للقيم
  const totalPrice = cartItems.reduce((sum, item) => {
    // فحص وجود العنصر وخصائصه
    if (!item) return sum;
    
    const itemPrice = item.salePrice || item.price || 0; // استخدام price بدلاً من originalPrice مع قيمة افتراضية
    return sum + itemPrice * (item.quantity || 0);
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
                onClick={() => onRemoveItem(item.id)}
                text="×"
              />
              <QuantityCounter
                quantity={item.quantity}
                onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
                min={1}
              />
            </div>
            <div className="flex-1 text-right">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              {/* إصلاح: فحص وجود السعر قبل العرض */}
              <p className="text-sm text-gray-600">
                {(item.salePrice || item.price || 0)} ر.س
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold text-teal-800">
          <span>{totalPrice.toFixed(2)} ر.س</span>
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