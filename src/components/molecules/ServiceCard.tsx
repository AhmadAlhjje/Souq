// components/molecules/ServiceCard.tsx
import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function ServiceCard({ 
  title, 
  description, 
  imageSrc, 
}: ServiceCardProps) {
  return (
    <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative h-48 md:h-64 overflow-hidden rounded-t-3xl">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Icon Badge */}
        <div className="absolute top-4 right-4">
        
        </div>
      </div>

      {/* Content */}
      <div className="p-6 mb-2">
        {/* Title */}
        <h4 className="text-lg md:text-xl font-bold text-[#004D5A] mb-3 leading-tight">
          {title}
        </h4>
        
        {/* Description */}
        <p className="text-[#004D5A]/70 text-sm md:text-base leading-relaxed mb-4">
          {description}
        </p>

       
      </div>
    </div>
  );
}