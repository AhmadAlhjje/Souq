'use client';
// molecules/FeatureItem.tsx - تم تعديله ليستخدم مكونات الـ atoms الجديدة
import React from 'react';
import Typography from '../atoms/Typography';

export interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start space-x-4 space-x-reverse group">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <Typography variant="h3" className="leading-tight mb-1">
          {title}
        </Typography>
        {description && (
          <Typography variant="caption">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default FeatureItem;
