
// components/molecules/QuantityControl.tsx
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ 
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  min = 1,
  max = 99,
  className = '' 
}) => {
  const canDecrease = quantity > min && !disabled;
  const canIncrease = quantity < max && !disabled;

  return (
    <div className={`flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm ${className}`}>
      <button 
        onClick={onDecrease}
        disabled={!canDecrease}
        className="px-3 py-2 hover:bg-gray-100 transition-colors text-[#004D5A] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="px-4 py-2 bg-gray-50 min-w-[3rem] text-center font-medium">
        {quantity}
      </span>
      <button 
        onClick={onIncrease}
        disabled={!canIncrease}
        className="px-3 py-2 hover:bg-gray-100 transition-colors text-[#004D5A] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantityControl;
