
// components/molecules/QuantityCounter.tsx
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import Button from '../atoms/Button';
import { StarVariant } from '@/types/product';

interface QuantityCounterProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

const QuantityCounter: React.FC<QuantityCounterProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  min = 0 
}) => (
  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
    <Button
      variant="ghost"
      size="sm"
      onClick={onDecrease}
      disabled={quantity <= min}
      className="w-8 h-8 p-0 rounded-md hover:bg-red-100 hover:text-red-600"
    >
      <Minus className="w-4 h-4" />
    </Button>
    <span className="mx-3 font-medium text-teal-800 min-w-[2rem] text-center">{quantity}</span>
    <Button
      variant="ghost"
      size="sm"
      onClick={onIncrease}
      className="w-8 h-8 p-0 rounded-md hover:bg-green-100 hover:text-green-600"
    >
      <Plus className="w-4 h-4" />
    </Button>
  </div>
);

interface CompactQuantityCounterProps extends QuantityCounterProps {
  variant?: StarVariant;
}

const CompactQuantityCounter: React.FC<CompactQuantityCounterProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  min = 0, 
  variant = 'default' 
}) => {
  const bgColor = variant === 'new' ? 'bg-[#CFF7EE]' : 'bg-gray-50';
  const textColor = variant === 'new' ? 'text-[#004D5A]' : 'text-teal-800';
  const hoverColors = variant === 'new' 
    ? 'hover:bg-[#96EDD9] hover:text-[#004D5A]' 
    : 'hover:bg-red-100 hover:text-red-600';
  const increaseHoverColors = variant === 'new' 
    ? 'hover:bg-[#96EDD9] hover:text-[#004D5A]' 
    : 'hover:bg-green-100 hover:text-green-600';
  
  return (
    <div className={`flex items-center space-x-1 ${bgColor} rounded p-1`}>
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`w-5 h-5 rounded text-xs ${hoverColors} disabled:opacity-50 transition-colors`}
      >
        -
      </button>
      <span className={`mx-2 text-xs font-medium ${textColor} min-w-[1rem] text-center`}>{quantity}</span>
      <button
        onClick={onIncrease}
        className={`w-5 h-5 rounded text-xs ${increaseHoverColors} transition-colors`}
      >
        +
      </button>
    </div>
  );
};

export { QuantityCounter, CompactQuantityCounter };
