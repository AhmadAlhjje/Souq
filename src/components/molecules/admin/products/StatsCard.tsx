'use client';
// molecules/StatCard.tsx - تم تعديله ليستخدم مكونات الـ atoms الجديدة
import React from 'react';
import Typography from '@/components/atoms/Typography';

export interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, className = '' }) => {
  return (
    <div className={`group space-y-3 p-3 lg:p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 ${className}`}>
      <Typography 
        variant="h1" 
        className="group-hover:scale-110 transition-transform duration-300 text-2xl lg:text-3xl xl:text-4xl"
      >
        {value}
      </Typography>
      <Typography variant="caption" className="font-medium">
        {label}
      </Typography>
    </div>
  );
};

export default StatCard;
