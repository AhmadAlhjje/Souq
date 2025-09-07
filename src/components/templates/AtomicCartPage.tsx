// components/templates/CompactCartPage.tsx
"use client"
import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';

// Types
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

interface CompactCartPageProps {
  items: CartItem[];
  selectedItems: Set<number>;
  subtotal: number;
  deliveryFee: number;
  tax?: number;
  total: number;
  isLoading?: boolean;
  onSelectItem: (itemId: number, selected: boolean) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: () => void;
  onBackToShopping?: () => void;
}

// Helper function to generate dummy images
const getDummyImage = (id: number): string => {
  const dummyImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', // Watch
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop', // Smartwatch
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop', // Sunglasses
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop', // Laptop
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop', // Phone
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', // Shoes
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', // T-shirt
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop', // Bag
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop', // Camera
  ];
  
  return dummyImages[id % dummyImages.length];
};

// Atoms - مصغرة
const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}> = ({ checked, onChange, disabled = false, className = '' }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className={`w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1 ${className}`}
    />
  );
};

const ProductImage: React.FC<{
  src: string;
  alt: string;
  discount?: number;
  inStock?: boolean;
  className?: string;
}> = ({ src, alt, discount, inStock = true, className = '' }) => {
  return (
    <div className={`relative w-12 h-12 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-200"
        sizes="48px"
      />
      
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-[8px] font-medium">نفد</span>
        </div>
      )}
      
      {discount && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] px-1 py-0.5 rounded-bl font-medium">
          -{discount}%
        </div>
      )}
    </div>
  );
};

const PriceDisplay: React.FC<{
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}> = ({ price, originalPrice, currency = 'ر.س', size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base'
  };

  return (
    <div className={`space-y-0.5 ${className}`}>
      <span className={`text-teal-600 font-bold ${sizeClasses[size]}`}>
        {price} {currency}
      </span>
      {originalPrice && originalPrice > price && (
        <div className="text-[10px] text-gray-400 line-through">
          {originalPrice} {currency}
        </div>
      )}
    </div>
  );
};

const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <th className={`text-right py-2 px-4 text-gray-700 font-bold text-xs ${className}`}>
      {children}
    </th>
  );
};

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <td className={`py-2 px-2 ${className}`}>
      {children}
    </td>
  );
};

// Molecules - مصغرة
const ProductInfo: React.FC<{
  name: string;
  description?: string;
  className?: string;
}> = ({ name, description, className = '' }) => {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <h3 className="font-semibold text-gray-900 text-xs group-hover:text-blue-600 transition-colors line-clamp-1">
        {name}
      </h3>
      {description && (
        <p className="text-[10px] text-gray-500 line-clamp-1">{description}</p>
      )}
    </div>
  );
};

const QuantityControl: React.FC<{
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}> = ({ quantity, onIncrease, onDecrease, disabled = false, min = 1, max = 99, className = '' }) => {
  const canDecrease = quantity > min && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div className={`flex items-center border ml-2 border-gray-300 rounded-md overflow-hidden bg-white shadow-sm ${className}`}>
      <button 
        onClick={onDecrease}
        disabled={!canDecrease}
        className=" py-1 hover:bg-gray-100 transition-colors text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="px-2 py-1 bg-gray-50 min-w-[2rem] text-center font-medium text-xs">
        {quantity}
      </span>
      <button 
        onClick={onIncrease}
        disabled={!canIncrease}
        className="px-1.5 py-1 hover:bg-gray-100 transition-colors text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

const CartItemRow: React.FC<{
  item: CartItem;
  index: number;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}> = ({ item, index, isSelected, onSelect, onQuantityChange, onRemove }) => {
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
          src={getDummyImage(item.id)}
          alt={item.name}
          discount={item.discount}
          inStock={item.inStock}
        />
      </TableCell>

      {/* Product Info */}
      <TableCell className="max-w-[120px]">
        <ProductInfo
          name={item.name}
          description={item.description}
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
      {/* Price */}
      <TableCell>
        <PriceDisplay
          price={item.price}
          originalPrice={item.originalPrice}
          size="xs"
        />
      </TableCell>

   

      {/* Total */}
      <TableCell>
        <span className="font-bold text-teal-600 text-sm">{item.total} ر.س</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-all duration-200 transform group-hover:scale-110"
        >
<Trash2 className="w-4 h-4" />        </button>
      </TableCell>
    </tr>
  );
};

const SummaryRow: React.FC<{
  label: string;
  value: string;
  isTotal?: boolean;
  className?: string;
}> = ({ label, value, isTotal = false, className = '' }) => {
  const baseClasses = "flex justify-between items-center py-2";
  const borderClasses = isTotal 
    ? "bg-white rounded-lg px-3 shadow-sm" 
    : "border-b border-teal-200";
  
  const textClasses = isTotal
    ? "text-lg font-bold text-gray-900"
    : "text-gray-700 font-medium text-sm";
    
  const valueClasses = isTotal
    ? "text-xl font-bold text-teal-600"
    : "font-bold text-gray-900 text-sm";

  return (
    <div className={`${baseClasses} ${borderClasses} ${className}`}>
      <span className={textClasses}>{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
};

// Organisms
const CartHeader: React.FC<{
  selectedCount: number;
  onDeleteSelected: () => void;
  onBack?: () => void;
}> = ({ selectedCount, onDeleteSelected, onBack }) => {
  return (
    <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 px-6 py-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative flex justify-between items-center">
        <button 
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          حذف ({selectedCount})
        </button>
        
        <h1 className="text-xl font-bold text-white drop-shadow-sm">سلة التسوق</h1>
        
        {onBack && (
          <button 
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        {!onBack && <div className="w-12"></div>}
      </div>
    </div>
  );
};

const CompactCartTable: React.FC<{
  items: CartItem[];
  selectedItems: Set<number>;
  onSelectItem: (itemId: number, selected: boolean) => void;
  onSelectAll: () => void;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}> = ({ items, selectedItems, onSelectItem, onSelectAll, onQuantityChange, onRemoveItem }) => {
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  return (
    <div>
      {/* Compact Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full">
        <thead>
  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
    <TableHeader className="w-12"> {/* Checkbox */}
      <div className="flex items-center justify-center">
        <Checkbox checked={allSelected} onChange={onSelectAll} />
      </div>
    </TableHeader>
    
    <TableHeader className="w-20"> {/* Image */}
      صورة
    </TableHeader>
    
    <TableHeader className="min-w-[160px]"> {/* Product */}
      المنتج
    </TableHeader>
    
  <TableHeader className="w-20 pl-1"> {/* Quantity */}
  الكمية
</TableHeader>

<TableHeader className="w-24"> {/* Price */}
  السعر
</TableHeader>
    
    <TableHeader className="w-24"> {/* Total */}
      المجموع
    </TableHeader>
    
    <TableHeader className="w-12"> {/* Delete */}
      حذف
    </TableHeader>
  </tr>
</thead>
          <tbody>
            {items.map((item, index) => (
              <CartItemRow
                key={item.id}
                item={item}
                index={index}
                isSelected={selectedItems.has(item.id)}
                onSelect={(selected) => onSelectItem(item.id, selected)}
                onQuantityChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
                onRemove={() => onRemoveItem(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CompactCartSummary: React.FC<{
  subtotal: number;
  deliveryFee: number;
  tax?: number;
  total: number;
  onCheckout: () => void;
  loading?: boolean;
}> = ({ subtotal, deliveryFee, tax = 0, total, onCheckout, loading = false }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-teal-100 h-fit">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">إجمالي السلة</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded mx-auto"></div>
      </div>
      
      <div className="space-y-3">
        <SummaryRow
          label="المجموع الفرعي"
          value={`${subtotal.toFixed(2)} ر.س`}
        />
        
        <SummaryRow
          label="رسوم التوصيل"
          value={deliveryFee === 0 ? 'مجاني' : `${deliveryFee.toFixed(2)} ر.س`}
        />

        {tax > 0 && (
          <SummaryRow
            label="ضريبة القيمة المضافة (15%)"
            value={`${tax.toFixed(2)} ر.س`}
          />
        )}
        
        <SummaryRow
          label="الإجمالي النهائي"
          value={`${total.toFixed(2)} ر.س`}
          isTotal
        />
      </div>
      
      <button 
        onClick={onCheckout}
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:transform-none disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-4 h-4" />
        {loading ? 'جاري المعالجة...' : 'المتابعة للدفع'}
      </button>
    </div>
  );
};

// Main Template
const CompactCartPage: React.FC<CompactCartPageProps> = ({
  items,
  selectedItems,
  subtotal,
  deliveryFee,
  tax = 0,
  total,
  isLoading = false,
  onSelectItem,
  onSelectAll,
  onDeleteSelected,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onBackToShopping
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 mt-24" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl overflow-hidden border border-gray-100">
          
          {/* Compact Header */}
          <CartHeader
            selectedCount={selectedItems.size}
            onDeleteSelected={onDeleteSelected}
            onBack={onBackToShopping}
          />

          {/* Compact Content */}
          <div className="p-6">
            {/* Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cart Table - 2/3 of width */}
              <div className="lg:col-span-2">
                <CompactCartTable
                  items={items}
                  selectedItems={selectedItems}
                  onSelectItem={onSelectItem}
                  onSelectAll={onSelectAll}
                  onQuantityChange={onQuantityChange}
                  onRemoveItem={onRemoveItem}
                />
              </div>

              {/* Cart Summary - 1/3 of width */}
              <div className="lg:col-span-1">
                <CompactCartSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  tax={tax}
                  total={total}
                  onCheckout={onCheckout}
                  loading={isLoading}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage with dummy data
export const DummyCartData = {
  items: [
    {
      id: 1,
      name: "سماعات لاسلكية",
      description: "سماعات بلوتوث عالية الجودة",
      price: 250.00,
      originalPrice: 320.00,
      quantity: 2,
      image: "", // Will be replaced by getDummyImage(1)
      total: 500.00,
      inStock: true,
      discount: 22
    },
    {
      id: 2,
      name: "ساعة ذكية",
      description: "ساعة ذكية مع مراقب صحي",
      price: 450.00,
      quantity: 1,
      image: "", // Will be replaced by getDummyImage(2)
      total: 450.00,
      inStock: true
    },
    {
      id: 3,
      name: "حذاء رياضي",
      description: "حذاء رياضي مريح",
      price: 180.00,
      originalPrice: 220.00,
      quantity: 1,
      image: "", // Will be replaced by getDummyImage(3)
      total: 180.00,
      inStock: false,
      discount: 18
    }
  ] as CartItem[],
  
  selectedItems: new Set([1, 2]),
  subtotal: 950.00,
  deliveryFee: 25.00,
  tax: 142.50,
  total: 1117.50
};

export default CompactCartPage;