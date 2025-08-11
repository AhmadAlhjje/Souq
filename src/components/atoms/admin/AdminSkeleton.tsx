"use client";

import React from "react";
import useTheme from "@/hooks/useTheme";

export type AdminSkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card';
export type AdminSkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

interface AdminSkeletonProps {
  variant?: AdminSkeletonVariant;
  size?: AdminSkeletonSize;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const AdminSkeleton: React.FC<AdminSkeletonProps> = ({
  variant = 'text',
  size = 'md',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const { isDark } = useTheme();

  const getBaseClasses = () => {
    return `animate-pulse ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'rectangle':
        return 'rounded-lg';
      case 'card':
        return 'rounded-xl';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getSizeClasses = () => {
    if (width || height) return '';
    
    switch (size) {
      case 'sm':
        return variant === 'text' ? 'h-3 w-16' : 
               variant === 'circle' ? 'w-6 h-6' : 'h-8 w-24';
      case 'md':
        return variant === 'text' ? 'h-4 w-24' : 
               variant === 'circle' ? 'w-8 h-8' : 'h-10 w-32';
      case 'lg':
        return variant === 'text' ? 'h-6 w-32' : 
               variant === 'circle' ? 'w-12 h-12' : 'h-12 w-48';
      case 'xl':
        return variant === 'text' ? 'h-8 w-48' : 
               variant === 'circle' ? 'w-16 h-16' : 'h-16 w-64';
      default:
        return 'h-4 w-24';
    }
  };

  const getStyles = () => {
    const styles: React.CSSProperties = {};
    if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
    return styles;
  };

  const skeletonElement = (
    <div
      className={`
        ${getBaseClasses()}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      style={getStyles()}
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={index}>
          {skeletonElement}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AdminSkeleton;