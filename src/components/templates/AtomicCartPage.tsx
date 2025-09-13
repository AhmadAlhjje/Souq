// components/templates/AtomicCartPage.tsx
"use client"
import React from 'react';
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

interface AtomicCartPageProps {
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

// Helper function to get fallback image if the main image fails
const getFallbackImage = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  return `${baseUrl}/uploads/placeholder.jpg`;
};

// Atoms - مكونات أساسية صغيرة
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
      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
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
  const [imageSrc, setImageSrc] = React.useState(src);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    console.log('❌ Image failed to load:', src);
    setImageError(true);
    setImageSrc(getFallbackImage());
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', src);
    setImageError(false);
  };

  React.useEffect(() => {
    setImageSrc(src);
    setImageError(false);
  }, [src]);

  return (
    <div className={`relative w-16 h-16 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow ${className}`}>
      <img
  src={imageSrc}
  alt={alt}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
  onError={handleImageError}
  onLoad={handleImageLoad}
  style={{ objectFit: 'cover' }}
/>
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xs">صورة</span>
        </div>
      )}
      
      {!inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white text-xs font-medium">نفد</span>
        </div>
      )}
      
      {discount && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-bl font-medium">
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
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ price, originalPrice, currency = 'ر.س', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <span className={`text-teal-600 font-bold ${sizeClasses[size]}`}>
        {price.toFixed(2)} {currency}
      </span>
      {originalPrice && originalPrice > price && (
        <div className="text-sm text-gray-400 line-through">
          {originalPrice.toFixed(2)} {currency}
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
    <th className={`text-right py-3 px-4 text-gray-700 font-bold text-sm ${className}`}>
      {children}
    </th>
  );
};

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <td className={`py-3 px-4 ${className}`}>
      {children}
    </td>
  );
};

// Molecules - مكونات متوسطة
const ProductInfo: React.FC<{
  name: string;
  description?: string;
  className?: string;
}> = ({ name, description, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
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
    <div className={`flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm ${className}`}>
      <button 
        onClick={onDecrease}
        disabled={!canDecrease}
        className="px-2 py-1 hover:bg-gray-100 transition-colors text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-3 py-1 bg-gray-50 min-w-[3rem] text-center font-medium text-sm">
        {quantity}
      </span>
      <button 
        onClick={onIncrease}
        disabled={!canIncrease}
        className="px-2 py-1 hover:bg-gray-100 transition-colors text-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
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
          disabled={!item.inStock}
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
      <TableCell className="max-w-[200px]">
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
          size="sm"
        />
      </TableCell>

      {/* Total */}
      <TableCell>
        <span className="font-bold text-teal-600 text-base">{item.total.toFixed(2)} ر.س</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-all duration-200 transform group-hover:scale-110"
        >
          <Trash2 className="w-5 h-5" />
        </button>
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
  const baseClasses = "flex justify-between items-center py-3";
  const borderClasses = isTotal 
    ? "bg-white rounded-lg px-4 shadow-md border-2 border-teal-200" 
    : "border-b border-gray-200";
  
  const textClasses = isTotal
    ? "text-xl font-bold text-gray-900"
    : "text-gray-700 font-medium";
    
  const valueClasses = isTotal
    ? "text-2xl font-bold text-teal-600"
    : "font-bold text-gray-900";

  return (
    <div className={`${baseClasses} ${borderClasses} ${className}`}>
      <span className={textClasses}>{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
};

// Organisms - مكونات كبيرة
const CartHeader: React.FC<{
  selectedCount: number;
  onDeleteSelected: () => void;
  onBack?: () => void;
}> = ({ selectedCount, onDeleteSelected, onBack }) => {
  return (
    <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 px-6 py-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative flex justify-between items-center">
        <button 
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          حذف المحدد ({selectedCount})
        </button>
        
        <h1 className="text-2xl font-bold text-white drop-shadow-md">سلة التسوق</h1>
        
        {onBack && (
          <button 
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        )}
        {!onBack && <div className="w-16"></div>}
      </div>
    </div>
  );
};

const AtomicCartTable: React.FC<{
  items: CartItem[];
  selectedItems: Set<number>;
  onSelectItem: (itemId: number, selected: boolean) => void;
  onSelectAll: () => void;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}> = ({ items, selectedItems, onSelectItem, onSelectAll, onQuantityChange, onRemoveItem }) => {
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TableHeader className="w-16">
                <div className="flex items-center justify-center">
                  <Checkbox checked={allSelected} onChange={onSelectAll} />
                </div>
              </TableHeader>
              
              <TableHeader className="w-20">
                صورة
              </TableHeader>
              
              <TableHeader className="min-w-[200px]">
                المنتج
              </TableHeader>
              
              <TableHeader className="w-32">
                الكمية
              </TableHeader>

              <TableHeader className="w-24">
                السعر
              </TableHeader>
              
              <TableHeader className="w-28">
                المجموع
              </TableHeader>
              
              <TableHeader className="w-16">
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

const AtomicCartSummary: React.FC<{
  subtotal: number;
  deliveryFee: number;
  tax?: number;
  total: number;
  onCheckout: () => void;
  loading?: boolean;
}> = ({ subtotal, deliveryFee, tax = 0, total, onCheckout, loading = false }) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-teal-100 h-fit sticky top-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ملخص الطلب</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded mx-auto"></div>
      </div>
      
      <div className="space-y-4">
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
        className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:transform-none disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-5 h-5" />
        {loading ? 'جاري المعالجة...' : 'المتابعة للدفع'}
      </button>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>شحن مجاني للطلبات فوق 200 ر.س</p>
      </div>
    </div>
  );
};

// Main Template
const AtomicCartPage: React.FC<AtomicCartPageProps> = ({
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl overflow-hidden">
          
          {/* Header */}
          <CartHeader
            selectedCount={selectedItems.size}
            onDeleteSelected={onDeleteSelected}
            onBack={onBackToShopping}
          />

          {/* Content */}
          <div className="p-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              
              {/* Cart Table - 3/4 of width */}
              <div className="xl:col-span-3">
                <AtomicCartTable
                  items={items}
                  selectedItems={selectedItems}
                  onSelectItem={onSelectItem}
                  onSelectAll={onSelectAll}
                  onQuantityChange={onQuantityChange}
                  onRemoveItem={onRemoveItem}
                />
              </div>

              {/* Cart Summary - 1/4 of width */}
              <div className="xl:col-span-1">
                <AtomicCartSummary
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

export default AtomicCartPage;