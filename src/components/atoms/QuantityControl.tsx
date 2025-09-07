// components/atoms/QuantityControl.tsx
'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 20,
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-20',
      button: 'p-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
      display: 'w-6 text-xs'
    },
    md: {
      container: 'w-24',
      button: 'p-1',
      icon: 'w-3 h-3',
      text: 'text-sm',
      display: 'w-8 text-sm'
    },
    lg: {
      container: 'w-28',
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-base',
      display: 'w-10 text-base'
    }
  };

  const classes = sizeClasses[size];
  const isMinReached = quantity <= min;
  const isMaxReached = quantity >= max;

  const handleDecrease = () => {
    if (!isMinReached && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (!isMaxReached && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded text-center ${classes.container} ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={isMinReached || disabled}
        className={`${classes.button} disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200 disabled:cursor-not-allowed`}
      >
        <Minus className={classes.icon} />
      </button>
      <span className={`${classes.display} py-1 bg-gray-50 ${classes.text} font-medium`}>
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        disabled={isMaxReached || disabled}
        className={`${classes.button} disabled:opacity-50 hover:bg-gray-100 transition-colors duration-200 disabled:cursor-not-allowed`}
      >
        <Plus className={classes.icon} />
      </button>
    </div>
  );
};

export default QuantityControl;