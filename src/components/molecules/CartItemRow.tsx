// components/molecules/CartItemRow.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Checkbox, ProductImage, PriceDisplay, TableCell } from '../atoms';
import ProductInfo from './ProductInfo';
import QuantityControl from './QuantityControl';

interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  total: number;
  inStock?: boolean;
  discount?: number;
}

interface CartItemRowProps {
  item: CartItem;
  index: number;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  index,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove
}) => {
  return (
    <tr className={`group transition-all duration-200 ${
      index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
    } hover:bg-blue-50/30 ${!item.inStock ? 'opacity-60' : ''}`}>
      
      {/* Checkbox */}
      <TableCell>
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
        />
      </TableCell>

      {/* Product Image */}
      <TableCell>
        <ProductImage
          src={item.image}
          alt={item.name}
          discount={item.discount}
          inStock={item.inStock}
        />
      </TableCell>

      {/* Product Info */}
      <TableCell>
        <ProductInfo
          name={item.name}
          description={item.description}
          inStock={item.inStock}
        />
      </TableCell>

      {/* Price */}
      <TableCell>
        <PriceDisplay
          price={item.price}
          originalPrice={item.originalPrice}
        />
      </TableCell>

      {/* Quantity */}
      <TableCell>
        <QuantityControl
          quantity={item.quantity}
          onIncrease={() => onQuantityChange(item.quantity + 1)}
          onDecrease={() => onQuantityChange(item.quantity - 1)}
          disabled={!item.inStock}
        />
      </TableCell>

      {/* Total */}
      <TableCell>
        <span className="font-bold text-[#004D5A] text-lg">${item.total}</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 transform group-hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </TableCell>
    </tr>
  );
};

export default CartItemRow;