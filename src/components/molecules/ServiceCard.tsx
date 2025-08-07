// components/molecules/ServiceCard.tsx
import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  gradient?: string;
}

export default function ServiceCard({ 
  title, 
  description, 
  imageSrc, 
  buttonText,
  gradient = "from-blue-500 to-blue-600"
}: ServiceCardProps) {
  return (
    <div className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden rounded-t-3xl">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Icon Badge */}
        <div className="absolute top-4 right-4">
          <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
            <span className="text-white text-lg">✨</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h4 className="text-lg md:text-xl font-bold text-[#004D5A] mb-3 leading-tight">
          {title}
        </h4>
        
        {/* Description */}
        <p className="text-[#004D5A]/70 text-sm md:text-base leading-relaxed mb-4">
          {description}
        </p>

        {/* Button */}
        <button className={`w-full bg-gradient-to-r ${gradient} text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}