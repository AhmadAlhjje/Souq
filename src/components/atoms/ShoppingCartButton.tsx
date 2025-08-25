import React from 'react';
import { ShoppingCart } from "lucide-react";
import useTheme from "../../hooks/useTheme";

interface ShoppingCartButtonProps {
  itemCount?: number;
}

const ShoppingCartButton: React.FC<ShoppingCartButtonProps> = ({ itemCount = 3 }) => {
  const { isDark } = useTheme();

const handleCartClick = () => {
  window.location.href = '/cart';
};

  return (
    <button 
      onClick={handleCartClick}
      className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 group shadow-sm hover:scale-105 active:scale-95 ${
        isDark 
          ? 'bg-slate-700/50 hover:bg-slate-600/50' 
          : 'bg-white/30 hover:bg-white/40'
      }`}
      aria-label={`عرض السلة - ${itemCount} منتج`}
      title={`السلة (${itemCount} منتج)`}
    >
      <ShoppingCart className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${
        isDark ? 'text-emerald-300' : 'text-[#004D5A]'
      }`} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default ShoppingCartButton;